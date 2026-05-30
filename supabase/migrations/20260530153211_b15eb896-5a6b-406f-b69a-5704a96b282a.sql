
DROP VIEW IF EXISTS public.questions_public;
CREATE VIEW public.questions_public
WITH (security_invoker = true) AS
SELECT id, statement, option_a, option_b, option_c, option_d, option_e,
       discipline, subject, area, exam, organization, city, role, education,
       banca, year, difficulty, active
FROM public.questions
WHERE active = true;
GRANT SELECT ON public.questions_public TO anon, authenticated;
