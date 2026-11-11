-- SAEP Inteligente v3.2
-- Permite que o professor consulte somente os cursos associados às turmas
-- às quais ele foi atribuído. Não concede escrita.

DROP POLICY IF EXISTS professor_ver_cursos_suas_turmas ON public.cursos;

CREATE POLICY professor_ver_cursos_suas_turmas
ON public.cursos
FOR SELECT
TO authenticated
USING (
  public.meu_papel() = 'professor'
  AND EXISTS (
    SELECT 1
    FROM public.turmas t
    WHERE t.curso_id = cursos.id
      AND public.saep_pode_acessar_turma(t.id)
  )
);

-- A consulta da aplicação também depende de SELECT em turmas e professor_turmas.
-- As policies existentes dessas tabelas devem continuar habilitadas.
