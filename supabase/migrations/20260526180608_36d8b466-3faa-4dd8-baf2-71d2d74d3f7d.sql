-- 1. Add phone to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;

-- 2. Update handle_new_user trigger to include phone
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, display_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$function$;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Flashcard sessions table
CREATE TABLE IF NOT EXISTS public.flashcard_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  category_id uuid,
  category_name text,
  level text,
  total integer NOT NULL,
  correct integer NOT NULL,
  wrong integer NOT NULL,
  duration_seconds integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.flashcard_sessions TO authenticated;
GRANT ALL ON public.flashcard_sessions TO service_role;

ALTER TABLE public.flashcard_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sessions user select own"
ON public.flashcard_sessions FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Sessions user insert own"
ON public.flashcard_sessions FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_flashcard_sessions_user ON public.flashcard_sessions(user_id, created_at DESC);