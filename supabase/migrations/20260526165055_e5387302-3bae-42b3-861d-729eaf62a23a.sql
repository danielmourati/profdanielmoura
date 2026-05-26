
-- 1) Lock down assessment_questions: only admins can read raw rows (which include correct_option_id)
DROP POLICY IF EXISTS "Questions public read" ON public.assessment_questions;

CREATE POLICY "Questions admin read"
ON public.assessment_questions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

REVOKE SELECT ON public.assessment_questions FROM anon;

-- 2) Create a public view that excludes correct_option_id
CREATE OR REPLACE VIEW public.assessment_questions_public
WITH (security_invoker = true) AS
SELECT id, assessment_id, question, options, order_index, created_at, updated_at
FROM public.assessment_questions;

GRANT SELECT ON public.assessment_questions_public TO anon, authenticated;

-- 3) Server-side scoring RPC: keeps correct answers on the server
CREATE OR REPLACE FUNCTION public.submit_assessment(
  p_assessment_id uuid,
  p_answers jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total int := 0;
  v_correct int := 0;
  v_score int := 0;
  v_band record;
  v_detail jsonb := '[]'::jsonb;
  v_q record;
  v_picked text;
  v_ok boolean;
  v_attempt_id uuid;
BEGIN
  IF p_assessment_id IS NULL THEN
    RAISE EXCEPTION 'assessment_id required';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.assessments WHERE id = p_assessment_id AND active = true) THEN
    RAISE EXCEPTION 'Assessment not found';
  END IF;

  FOR v_q IN
    SELECT id, correct_option_id
    FROM public.assessment_questions
    WHERE assessment_id = p_assessment_id
    ORDER BY order_index
  LOOP
    v_total := v_total + 1;
    v_picked := p_answers ->> v_q.id::text;
    v_ok := v_picked IS NOT NULL AND v_picked = v_q.correct_option_id;
    IF v_ok THEN v_correct := v_correct + 1; END IF;
    v_detail := v_detail || jsonb_build_object(
      'question_id', v_q.id,
      'picked', v_picked,
      'correct', v_ok
    );
  END LOOP;

  IF v_total > 0 THEN
    v_score := round((v_correct::numeric / v_total::numeric) * 100);
  END IF;

  SELECT label, message, color INTO v_band
  FROM public.score_bands
  WHERE assessment_id = p_assessment_id
    AND v_score >= min_score
    AND v_score <= max_score
  ORDER BY min_score
  LIMIT 1;

  INSERT INTO public.assessment_attempts (
    assessment_id, user_id, score, correct_count, total_questions,
    band_label, band_message, answers
  ) VALUES (
    p_assessment_id, auth.uid(), v_score, v_correct, v_total,
    v_band.label, v_band.message, v_detail
  ) RETURNING id INTO v_attempt_id;

  RETURN jsonb_build_object(
    'attempt_id', v_attempt_id,
    'score', v_score,
    'correct', v_correct,
    'total', v_total,
    'band', CASE WHEN v_band.label IS NULL THEN NULL ELSE jsonb_build_object(
      'label', v_band.label,
      'message', v_band.message,
      'color', v_band.color
    ) END
  );
END;
$$;

REVOKE ALL ON FUNCTION public.submit_assessment(uuid, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_assessment(uuid, jsonb) TO anon, authenticated;

-- 4) Tighten execute on internal trigger-only SECURITY DEFINER functions
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
