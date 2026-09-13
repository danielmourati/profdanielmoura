DROP POLICY IF EXISTS "Questions public read" ON public.questions;
REVOKE SELECT ON public.questions FROM anon;
REVOKE SELECT ON public.questions FROM authenticated;
GRANT SELECT ON public.questions TO authenticated;
CREATE POLICY "Questions admin read" ON public.questions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
GRANT SELECT ON public.questions_public TO anon, authenticated;