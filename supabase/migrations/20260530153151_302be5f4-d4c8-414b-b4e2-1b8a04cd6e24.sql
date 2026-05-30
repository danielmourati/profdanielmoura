
-- Difficulty enum
CREATE TYPE public.question_difficulty AS ENUM ('facil', 'medio', 'dificil');

-- Questions bank
CREATE TABLE public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  statement text NOT NULL,
  comment text NOT NULL DEFAULT '',
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  option_e text,
  correct_option text NOT NULL CHECK (correct_option IN ('a','b','c','d','e')),
  discipline text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  area text NOT NULL DEFAULT '',
  exam text NOT NULL DEFAULT '',
  organization text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT '',
  education text NOT NULL DEFAULT '',
  banca text,
  year integer,
  difficulty public.question_difficulty NOT NULL DEFAULT 'medio',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.questions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.questions TO authenticated;
GRANT ALL ON public.questions TO service_role;

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questions public read" ON public.questions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Questions admin write" ON public.questions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_questions_discipline ON public.questions(discipline);
CREATE INDEX idx_questions_subject ON public.questions(subject);
CREATE INDEX idx_questions_area ON public.questions(area);
CREATE INDEX idx_questions_organization ON public.questions(organization);
CREATE INDEX idx_questions_year ON public.questions(year);
CREATE INDEX idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX idx_questions_active ON public.questions(active);

CREATE TRIGGER trg_questions_updated_at
BEFORE UPDATE ON public.questions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Public view without gabarito/comentário
CREATE VIEW public.questions_public AS
SELECT id, statement, option_a, option_b, option_c, option_d, option_e,
       discipline, subject, area, exam, organization, city, role, education,
       banca, year, difficulty, active
FROM public.questions
WHERE active = true;

GRANT SELECT ON public.questions_public TO anon, authenticated;

-- Question attempts
CREATE TABLE public.question_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  question_id uuid NOT NULL,
  session_id uuid NOT NULL,
  picked_option text NOT NULL,
  is_correct boolean NOT NULL,
  discipline text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  difficulty public.question_difficulty NOT NULL DEFAULT 'medio',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.question_attempts TO authenticated;
GRANT ALL ON public.question_attempts TO service_role;

ALTER TABLE public.question_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "QAttempts select own or admin" ON public.question_attempts FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_qattempts_user_session ON public.question_attempts(user_id, session_id);

-- RPC: answer a question (hides gabarito até responder)
CREATE OR REPLACE FUNCTION public.answer_question(
  p_question_id uuid,
  p_session_id uuid,
  p_picked text
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_q record;
  v_ok boolean;
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'auth required'; END IF;
  IF p_picked NOT IN ('a','b','c','d','e') THEN RAISE EXCEPTION 'invalid option'; END IF;

  SELECT * INTO v_q FROM public.questions WHERE id = p_question_id AND active = true;
  IF NOT FOUND THEN RAISE EXCEPTION 'question not found'; END IF;

  v_ok := (p_picked = v_q.correct_option);

  INSERT INTO public.question_attempts (
    user_id, question_id, session_id, picked_option, is_correct,
    discipline, subject, difficulty
  ) VALUES (
    v_uid, p_question_id, p_session_id, p_picked, v_ok,
    v_q.discipline, v_q.subject, v_q.difficulty
  );

  RETURN jsonb_build_object(
    'is_correct', v_ok,
    'correct_option', v_q.correct_option,
    'comment', v_q.comment
  );
END;
$$;

REVOKE ALL ON FUNCTION public.answer_question(uuid, uuid, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.answer_question(uuid, uuid, text) TO authenticated;
