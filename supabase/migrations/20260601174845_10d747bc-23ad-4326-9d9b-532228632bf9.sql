
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assessments TO authenticated;
GRANT SELECT ON public.assessments TO anon;
GRANT ALL ON public.assessments TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.assessment_questions TO authenticated;
GRANT ALL ON public.assessment_questions TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.score_bands TO authenticated;
GRANT SELECT ON public.score_bands TO anon;
GRANT ALL ON public.score_bands TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.assessment_attempts TO authenticated;
GRANT ALL ON public.assessment_attempts TO service_role;
