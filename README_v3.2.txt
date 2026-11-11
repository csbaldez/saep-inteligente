SAEP INTELIGENTE - VERSAO 3.2

O que mudou:
- O dashboard passou a consultar as turmas no Supabase.
- Administrador e coordenacao consultam as turmas da unidade (respeitando RLS).
- Professor consulta apenas as turmas atribuídas em professor_turmas.
- A aba Turmas e alunos também apresenta as turmas reais, sem dados de alunos nesta etapa.
- As métricas de desempenho, gráficos, agenda e resultados continuam demonstrativos e NÃO foram conectados.

ANTES DE TESTAR:
1. Faça uma cópia da pasta da versão 3.1.
2. Extraia esta versão em uma pasta nova.
3. Confira se supabase-config.js contém a URL e a publishable key já utilizadas na versão 3.1.
4. No Supabase SQL Editor, execute ETAPA_SQL_CURSOS_PROFESSOR.sql. Essa policy é necessária para o professor ler o nome do curso das próprias turmas. Ela concede somente SELECT e não concede escrita.
5. Abra index.html pelo Live Server.

TESTES:
- Entrar como administrador: deverá ver as turmas da unidade.
- Entrar como coordenação: deverá ver as turmas permitidas da unidade.
- Entrar como professor Cleyton Baldez: deverá ver somente as turmas atribuídas em professor_turmas.
- Verificar a turma HT-MEC-02-N-24-13490 / Técnico em Mecânica.
- Na aba Turmas e alunos, conferir se a lista é a mesma permitida ao perfil.

Se houver erro, a tabela do dashboard exibirá a mensagem retornada pelo Supabase. Não cadastrar dados reais de alunos nesta etapa.
