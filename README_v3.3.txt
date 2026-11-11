SAEP INTELIGENTE - VERSÃO 3.3
Módulo inicial de cadastro e consulta de estudantes integrado ao Supabase.

NOVIDADES
- A tela Turmas e alunos consulta turmas disponíveis conforme o perfil autenticado.
- Consulta estudantes na tabela public.alunos, relacionados por turma_id.
- Filtro para visualizar estudantes de uma turma específica ou de todas as turmas disponíveis.
- Administrador e coordenação visualizam o botão de cadastro.
- Cadastro de estudante com turma, nome e matrícula opcional.
- Professor permanece com consulta, sem botão de inclusão.
- Mensagens de erro quando o Supabase negar leitura ou gravação.

IMPORTANTE
- Esta versão não altera o esquema do banco e não executa SQL automaticamente.
- A gravação depende de política INSERT adequada em public.alunos para administrador/coordenação.
- A leitura depende das políticas SELECT já configuradas para cada perfil.
- Antes de usar dados pessoais reais, valide as permissões com os três perfis e confirme que cada professor só consulta alunos de suas turmas.
- Não inclua service_role/secret key no navegador. Mantenha apenas a chave publishable/anon no supabase-config.js.

ARQUIVOS
- index.html: interface principal
- app.js: telas, consultas e cadastro de estudantes
- auth.js: autenticação e controle de navegação por perfil
- supabase-config.js: URL e chave publishable do projeto
- style.css: estilos
- supabase-schema.sql: referência inicial do esquema (não representa necessariamente todas as políticas atualmente aplicadas no projeto)
