REVOKE EXECUTE ON FUNCTION public.get_assessment_public_questions(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_assessment_public_questions(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_assessment_public_questions(uuid) TO service_role;