CREATE OR REPLACE FUNCTION public.get_assessment_public_questions(p_assessment_id uuid)
RETURNS TABLE (
  id uuid,
  assessment_id uuid,
  question text,
  options jsonb,
  order_index integer,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT q.id, q.assessment_id, q.question, q.options, q.order_index, q.created_at, q.updated_at
  FROM public.assessment_questions q
  JOIN public.assessments a ON a.id = q.assessment_id
  WHERE q.assessment_id = p_assessment_id
    AND a.active = true
  ORDER BY q.order_index, q.created_at;
$$;

GRANT EXECUTE ON FUNCTION public.get_assessment_public_questions(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_assessment_public_questions(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_assessment_public_questions(uuid) TO service_role;