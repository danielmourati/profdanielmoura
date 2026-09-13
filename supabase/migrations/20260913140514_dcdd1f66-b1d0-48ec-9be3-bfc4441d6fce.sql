ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS coming_soon boolean NOT NULL DEFAULT false;

GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;