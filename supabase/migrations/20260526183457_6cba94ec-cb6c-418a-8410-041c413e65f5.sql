DROP POLICY IF EXISTS "Attempts anyone insert" ON public.assessment_attempts;
REVOKE INSERT ON public.assessment_attempts FROM anon, authenticated;