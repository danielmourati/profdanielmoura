
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.flashcard_difficulty AS ENUM ('facil', 'medio', 'dificil');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles select own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Profiles update own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Profiles insert own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- ============ TRIGGER: auto-create profile on signup ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ UPDATED_AT TRIGGER ============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- ============ FLASHCARDS ============
CREATE TABLE public.flashcard_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.flashcard_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.flashcard_categories TO authenticated;
GRANT ALL ON public.flashcard_categories TO service_role;
ALTER TABLE public.flashcard_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories public read" ON public.flashcard_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Categories admin write" ON public.flashcard_categories FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER tg_flashcard_categories_updated BEFORE UPDATE ON public.flashcard_categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.flashcard_categories(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  difficulty public.flashcard_difficulty NOT NULL DEFAULT 'medio',
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.flashcards TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.flashcards TO authenticated;
GRANT ALL ON public.flashcards TO service_role;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Flashcards public read" ON public.flashcards FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Flashcards admin write" ON public.flashcards FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER tg_flashcards_updated BEFORE UPDATE ON public.flashcards FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ PRODUCTS ============
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_cents INT NOT NULL DEFAULT 0,
  image_url TEXT,
  checkout_url TEXT NOT NULL DEFAULT '#',
  badge TEXT,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  accent TEXT NOT NULL DEFAULT 'from-primary to-accent',
  active BOOLEAN NOT NULL DEFAULT true,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products public read" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Products admin write" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER tg_products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ DOWNLOADS ============
CREATE TABLE public.downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'FILE',
  icon TEXT NOT NULL DEFAULT 'file',
  active BOOLEAN NOT NULL DEFAULT true,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.downloads TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.downloads TO authenticated;
GRANT ALL ON public.downloads TO service_role;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Downloads public read" ON public.downloads FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Downloads admin write" ON public.downloads FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER tg_downloads_updated BEFORE UPDATE ON public.downloads FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ TESTIMONIALS ============
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  avatar_url TEXT,
  rating INT NOT NULL DEFAULT 5,
  active BOOLEAN NOT NULL DEFAULT true,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Testimonials public read" ON public.testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Testimonials admin write" ON public.testimonials FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER tg_testimonials_updated BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ ASSESSMENTS ============
CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.assessments TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.assessments TO authenticated;
GRANT ALL ON public.assessments TO service_role;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Assessments public read" ON public.assessments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Assessments admin write" ON public.assessments FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER tg_assessments_updated BEFORE UPDATE ON public.assessments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_option_id TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.assessment_questions TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.assessment_questions TO authenticated;
GRANT ALL ON public.assessment_questions TO service_role;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questions public read" ON public.assessment_questions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Questions admin write" ON public.assessment_questions FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER tg_questions_updated BEFORE UPDATE ON public.assessment_questions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.score_bands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  min_score INT NOT NULL,
  max_score INT NOT NULL,
  label TEXT NOT NULL,
  message TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'primary',
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.score_bands TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.score_bands TO authenticated;
GRANT ALL ON public.score_bands TO service_role;
ALTER TABLE public.score_bands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bands public read" ON public.score_bands FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Bands admin write" ON public.score_bands FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  correct_count INT NOT NULL,
  band_label TEXT,
  band_message TEXT,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.assessment_attempts TO authenticated;
GRANT INSERT ON public.assessment_attempts TO anon, authenticated;
GRANT ALL ON public.assessment_attempts TO service_role;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Attempts anyone insert" ON public.assessment_attempts FOR INSERT TO anon, authenticated WITH CHECK (
  user_id IS NULL OR user_id = auth.uid()
);
CREATE POLICY "Attempts user select own" ON public.assessment_attempts FOR SELECT TO authenticated USING (
  user_id = auth.uid() OR public.has_role(auth.uid(),'admin')
);
CREATE POLICY "Attempts admin delete" ON public.assessment_attempts FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE INDEX idx_attempts_user ON public.assessment_attempts(user_id);
CREATE INDEX idx_attempts_assessment ON public.assessment_attempts(assessment_id);
CREATE INDEX idx_flashcards_category ON public.flashcards(category_id);
CREATE INDEX idx_questions_assessment ON public.assessment_questions(assessment_id);
CREATE INDEX idx_bands_assessment ON public.score_bands(assessment_id);

-- ============ STORAGE BUCKETS ============
INSERT INTO storage.buckets (id, name, public) VALUES ('downloads', 'downloads', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Downloads bucket public read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'downloads');
CREATE POLICY "Downloads bucket admin write" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'downloads' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Downloads bucket admin update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'downloads' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Downloads bucket admin delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'downloads' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Products bucket public read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'products');
CREATE POLICY "Products bucket admin write" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'products' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Products bucket admin update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'products' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Products bucket admin delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'products' AND public.has_role(auth.uid(),'admin'));
