# SAEP Inteligente — protótipo inicial

## O que já está disponível
- Interface responsiva com identidade visual azul institucional.
- Visão geral com indicadores demonstrativos, evolução, status e agenda.
- Navegação inicial entre agenda, turmas, resultados, competências, relatórios, usuários e configurações.
- Leitura local de planilhas Excel (.xlsx/.xls) e CSV com pré-visualização das colunas e registros.
- Modelo inicial de banco de dados Supabase em `supabase-schema.sql`.

## Como testar
1. Extraia o ZIP.
2. Abra `index.html` em um navegador atualizado.
3. A tela inicial usa dados fictícios.
4. Entre em **Resultados e notas** e selecione uma planilha para testar a leitura e pré-visualização.

## Colunas recomendadas para a planilha
Use uma linha de cabeçalho, com estes nomes (a importação será adaptada ao modelo real da unidade):
- `aluno`
- `matricula`
- `turma`
- `curso`
- `simulado`
- `competencia`
- `nota`
- `acertos`
- `total_questoes`
- `data_aplicacao`

A planilha real deverá ser analisada antes de definir o importador definitivo, especialmente para mapear nomes, códigos de turma, escalas de notas e competências.

## Próxima etapa: integração segura
- Criar projeto Supabase institucional.
- Executar e revisar o SQL com o responsável técnico.
- Cadastrar unidade e perfis.
- Implementar autenticação real e políticas RLS de leitura e escrita para os três perfis.
- Implementar importação com validação, prévia, detecção de duplicidades e registro de auditoria.
- Substituir os dados demonstrativos por dados reais.

## Segurança e LGPD
Este ZIP é um protótipo de interface. A tela não possui autenticação real e os dados demonstrativos não são dados oficiais. Não inserir dados pessoais reais de alunos neste protótipo. Para produção, utilizar autenticação, políticas de acesso por unidade e perfil, trilha de auditoria, cópias de segurança e validação institucional. Não publicar chave `service_role` no front-end.


## Atualização: agenda mensal e comunicação com professores
- Calendário mensal com navegação para mês anterior/próximo e atalho Hoje.
- Indicadores visuais por status (concluída, agendada, pendente).
- Seleção de dia para consultar aplicações.
- Formulário demonstrativo de cadastro de aplicação.
- Cadastro local de professor com nome e e-mail.
- Editor de assunto, recomendações e assinatura padrão de e-mail.
- Pré-visualização com campos automáticos: `{TURMA}`, `{CURSO}`, `{DATA}`, `{PROFESSOR}`, `{UNIDADE}`.

### Limite importante desta versão
O navegador não envia e-mails automaticamente. Para envio real ao cadastrar/agendar, a próxima etapa deverá conectar uma função segura no servidor (por exemplo, Supabase Edge Function) a um provedor de e-mail transacional. A chave do provedor nunca deve ficar no JavaScript público. O fluxo de produção deverá registrar envio, falha, reenvio e horário, além de permitir pré-visualização antes do envio.


## Versão 3 — autenticação inicial Supabase
- Login por e-mail e senha usando Supabase Auth.
- Recuperação da sessão após atualizar a página.
- Leitura do perfil autenticado na tabela `public.perfis`.
- Bloqueio de acesso quando o perfil não existe, está inativo ou tem papel desconhecido.
- Navegação apresentada conforme o papel (administrador, coordenação ou professor).
- Botão para encerrar a sessão.

### Configuração e limites desta etapa
- A configuração pública do projeto está em `supabase-config.js`. A chave usada é a publishable key, própria para uso no navegador; nunca inclua `service_role` ou secret key.
- O site precisa ser servido por HTTPS ou por servidor local, não aberto por `file://`.
- Esta etapa conecta somente autenticação e leitura do próprio perfil. Os indicadores, calendário, cadastro e importação continuam demonstrativos e não gravam nas tabelas do Supabase.
- Antes de conectar dados de estudantes, resultados e agenda, é obrigatório revisar as policies RLS, corrigir as permissões por operação e testar cada perfil com sessão real.
- Não utilizar dados reais de alunos nesta versão de validação.


## Correção 3.1 — navegação e sessão
- A navegação para Visão geral/Desempenho Geral não recarrega mais a página.
- O painel é redesenhado no conteúdo central, preservando o rodapé com usuário logado e a sessão ativa.
- A renovação de token não dispara uma nova leitura de perfil; a sessão é mantida pelo cliente Supabase.
