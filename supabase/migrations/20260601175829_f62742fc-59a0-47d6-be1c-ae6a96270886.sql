REVOKE EXECUTE ON FUNCTION public.get_assessment_public_questions(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_assessment_public_questions(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_assessment_public_questions(uuid) TO service_role;