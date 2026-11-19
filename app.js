// SAEP Inteligente - protótipo de interface. Dados fictícios para demonstração.
const demo = {
  applications:[
    {turma:"Técnico em Manutenção de Máquinas Industriais",curso:"Técnico em Manutenção",data:"2026-11-12",professor:"João Mendes",status:"Concluído",media:76},
    {turma:"Técnico em Eletromecânica - Noite",curso:"Técnico em Eletromecânica",data:"2026-11-16",professor:"Maria Souza",status:"Agendado",media:0},
    {turma:"Aprendizagem em Manutenção Eletromecânica",curso:"Aprendizagem Industrial",data:"2026-11-19",professor:"Carlos Lima",status:"Pendente",media:0},
    {turma:"Técnico em Eletromecânica - Manhã",curso:"Técnico em Eletromecânica",data:"2026-11-24",professor:"Maria Souza",status:"Agendado",media:0}
  ],
  evolution:[{label:"Simulado 1",value:58},{label:"Simulado 2",value:64},{label:"Simulado 3",value:69},{label:"Simulado 4",value:76}],
  attention:["1 aplicação aguardando confirmação do professor.","2 competências apresentam desempenho abaixo da meta de referência.","A importação de resultados ainda não foi realizada nesta demonstração."]
};
let importedRows=[];
const $=s=>document.querySelector(s);
const fmtDate=s=>new Date(s+"T12:00:00").toLocaleDateString("pt-BR");
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2800)}
function metric(label,value,sub,icon){return `<div class="metric"><div class="metric-top"><span>${label}</span><span class="metric-icon">${icon}</span></div><strong>${value}</strong><small>${sub}</small></div>`}
function renderDashboard(){
 const apps=demo.applications,done=apps.filter(a=>a.status==="Concluído").length,pending=apps.filter(a=>a.status==="Pendente").length;
 $("#metrics").innerHTML=metric("Turmas monitoradas","12","Cursos técnicos e aprendizagem","▤")+metric("Estudantes","186","Estudantes vinculados às turmas","♙")+metric("Aplicações realizadas",done,"De "+apps.length+" aplicações cadastradas","✓")+metric("Média institucional","76%","Último resultado demonstrativo","↗");
 $("#evolutionChart").innerHTML=demo.evolution.map(x=>`<div class="chart-col"><div class="bar" style="height:${x.value}%"><b>${x.value}%</b></div><small>${x.label}</small></div>`).join("");
 $("#statusSummary").innerHTML=[["Concluídas",done,"#159b78"],["Agendadas",apps.filter(a=>a.status==="Agendado").length,"#3978b8"],["Pendentes",pending,"#e99a3e"]].map(([n,v,c])=>`<div class="status-row"><span>${n}</span><div class="track"><div class="fill" style="width:${v/apps.length*100}%;background:${c}"></div></div><b>${v}</b></div>`).join("");
 const oldRows=$("#upcomingRows"); if(oldRows) oldRows.innerHTML=apps.map(a=>`<tr><td>${a.turma}</td><td>${a.curso}</td><td>${fmtDate(a.data)}</td><td>${a.professor}</td><td><span class="status ${a.status==="Concluído"?"done":a.status==="Agendado"?"scheduled":"pending"}">${a.status}</span></td></tr>`).join("");
 $("#attentionList").innerHTML=demo.attention.map(x=>`<div class="attention"><i></i><span>${x}</span></div>`).join("");
 $("#courseFilter").innerHTML='<option value="">Todos os cursos</option>'+[...new Set(apps.map(a=>a.curso))].map(c=>`<option>${c}</option>`).join("");
}
const views={
 agenda:["Agenda SAEP",`<div class="panel calendar-panel">
 <div class="calendar-toolbar"><div><h3>Calendário de aplicações</h3><p>Visualização mensal das aplicações dos simulados SAEP.</p></div>
 <div class="calendar-nav"><button class="secondary" id="prevMonth" aria-label="Mês anterior">‹</button><strong id="monthLabel"></strong><button class="secondary" id="nextMonth" aria-label="Próximo mês">›</button><button class="secondary" id="todayMonth">Hoje</button></div></div>
 <div class="calendar-legend"><span><i class="legend-dot done-dot"></i> Concluída</span><span><i class="legend-dot scheduled-dot"></i> Agendada</span><span><i class="legend-dot pending-dot"></i> Pendente</span></div>
 <div class="calendar-grid" id="calendarGrid"></div>
 <div class="selected-day" id="selectedDay"><h3>Aplicações do dia</h3><p>Selecione uma data no calendário para visualizar os detalhes.</p></div>
 <div class="calendar-actions"><button class="primary" id="newApplication">＋ Cadastrar aplicação</button></div>
 <div class="inline-form hidden" id="applicationForm"><h3>Nova aplicação</h3><div class="form-grid">
 <label>Turma<input id="appTurma" placeholder="Nome da turma"></label><label>Curso<input id="appCurso" placeholder="Curso"></label>
 <label>Data<input id="appDate" type="date"></label><label>Professor<select id="appProfessor"><option value="">Selecione</option></select></label>
 <label>Status<select id="appStatus"><option>Agendado</option><option>Pendente</option></select></label></div>
 <div class="form-actions"><button class="primary" id="saveApplication">Salvar aplicação</button><button class="secondary" id="cancelApplication">Cancelar</button></div></div>
 </div>`],
 turmas:["Turmas e alunos",`<div class="panel" id="turmasPanel"><div class="panel-heading"><div><h3>Turmas e estudantes</h3><p>Consulta de estudantes vinculados às turmas disponíveis no seu perfil.</p></div></div><p class="muted">Carregando dados do Supabase...</p></div>`],
 resultados:["Resultados e notas",`<div class="panel" id="pedagogicalPanel"><div class="panel-heading"><div><h3>Resultados e notas</h3><p>Notas registradas nas aplicações das turmas acessíveis ao seu perfil.</p></div></div><p class="muted">Carregando resultados do Supabase...</p></div>`],
 competencias:["Competências",`<div class="panel" id="pedagogicalPanel"><div class="panel-heading"><div><h3>Desempenho por competência</h3><p>Consolidação das pontuações registradas por competência.</p></div></div><p class="muted">Carregando dados do Supabase...</p></div>`],
 relatorios:["Relatórios",`<div class="panel" id="pedagogicalPanel"><div class="panel-heading"><div><h3>Relatórios pedagógicos</h3><p>Desempenho dos estudantes, competências e intervenções pedagógicas.</p></div></div><p class="muted">Carregando dados do Supabase...</p></div>`],
 professores:["Professores",`<div class="panel"><div class="panel-heading"><div><h3>Cadastro de professores</h3><p>Cadastre o e-mail que receberá os comunicados de agendamento.</p></div></div>
 <div class="inline-form"><div class="form-grid"><label>Nome do professor<input id="profName" placeholder="Nome completo"></label><label>E-mail institucional<input id="profEmail" type="email" placeholder="professor@instituicao.com.br"></label></div><div class="form-actions"><button class="primary" id="saveProfessor">Cadastrar professor</button></div></div>
 <div class="table-wrap"><table><thead><tr><th>Professor</th><th>E-mail</th><th>Situação</th></tr></thead><tbody id="professorRows"></tbody></table></div></div>`],
 comunicacao:["Modelos de e-mail",`<div class="panel"><div class="panel-heading"><div><h3>Modelo padrão de comunicação</h3><p>Edite as recomendações e a assinatura que serão utilizadas nos avisos de agendamento.</p></div></div>
 <div class="email-editor"><label>Assunto padrão<input id="emailSubject" class="text-input" value="Agendamento de aplicação do Simulado SAEP"></label>
 <label>Mensagem e recomendações<textarea id="emailBody" rows="10">Prezado(a) professor(a),\\n\\nInformamos que foi agendada uma aplicação do Simulado SAEP para sua turma.\\n\\nRecomendações para a aplicação:\\n• Verifique previamente o acesso dos estudantes ao ambiente do simulado.\\n• Oriente a turma sobre os objetivos e o tempo disponível.\\n• Garanta condições adequadas, tranquilidade e organização do ambiente.\\n• Registre ausências, intercorrências e dificuldades técnicas.\\n• Ao finalizar, confirme a realização da aplicação junto à coordenação.\\n\\nDados do agendamento:\\n{TURMA}\\n{CURSO}\\n{DATA}\\n{PROFESSOR}\\n\\nAtenciosamente,</textarea></label>
 <label>Assinatura padrão<textarea id="emailSignature" rows="4">Coordenação Pedagógica\\nSENAI – {UNIDADE}</textarea></label>
 <div class="hint">Campos automáticos disponíveis: {TURMA}, {CURSO}, {DATA}, {PROFESSOR} e {UNIDADE}.</div>
 <div class="form-actions"><button class="primary" id="saveEmailTemplate">Salvar modelo padrão</button><button class="secondary" id="previewEmail">Visualizar exemplo</button></div><div id="emailPreview" class="email-preview hidden"></div></div></div>`],
 usuarios:["Usuários e acessos",`<div class="panel"><h3>Perfis de acesso</h3><div class="role-grid"><div><b>Administrador</b><p>Configura a plataforma, gerencia usuários e acessa todos os dados.</p></div><div><b>Coordenação</b><p>Monitora aplicações, resultados, indicadores e intervenções.</p></div><div><b>Professor / Aplicador</b><p>Acessa somente suas turmas e respectivos resultados.</p></div></div><p class="hint">A autenticação e as permissões reais serão ativadas com o Supabase na etapa de integração.</p></div>`],
 configuracoes:["Configurações",`<div class="panel"><h3>Configuração da unidade</h3><label class="field-label">Nome de exibição da unidade</label><input class="text-input" id="unitName" value="Minha unidade SENAI"><button class="primary" onclick="document.querySelector('.unit-name').textContent=document.getElementById('unitName').value;toast('Nome atualizado nesta demonstração.')">Salvar configuração</button><p class="hint">A configuração será persistida no banco de dados na etapa de integração.</p></div>`]
};
const dashboardMarkup = `
<div class="welcome"><div><div class="eyebrow light">PAINEL DA UNIDADE</div><h2>Acompanhamento dos simulados SAEP</h2><p>Monitore aplicações, resultados e oportunidades de melhoria pedagógica.</p></div><div class="welcome-icon">◉</div></div>
<div class="metric-grid" id="metrics"></div>
<div class="dashboard-grid">
 <article class="panel chart-panel"><div class="panel-heading"><div><h3>Evolução do desempenho</h3><p>Média geral por aplicação · dados demonstrativos</p></div><select id="courseFilter"><option value="">Todos os cursos</option></select></div><div class="chart" id="evolutionChart"></div></article>
 <article class="panel"><div class="panel-heading"><div><h3>Status das aplicações</h3><p>Planejamento e execução</p></div></div><div id="statusSummary" class="status-summary"></div></article>
 <article class="panel wide"><div class="panel-heading"><div><h3>Turmas vinculadas</h3><p>Dados consultados diretamente no Supabase conforme seu perfil</p></div><button class="text-button" data-go="agenda">Ver agenda →</button></div><div class="table-wrap"><table><thead><tr><th>Turma</th><th>Curso</th><th>Professor responsável</th><th>Situação</th></tr></thead><tbody id="dashboardTurmaRows"><tr><td colspan="4">Carregando turmas...</td></tr></tbody></table></div></article>
 <article class="panel"><div class="panel-heading"><div><h3>Pontos de atenção</h3><p>Indicadores para acompanhamento</p></div></div><div id="attentionList" class="attention-list"></div></article>
</div>
<div class="notice"><strong>Ambiente de validação:</strong> autenticação real ativa. Os painéis e indicadores ainda contêm dados demonstrativos; importação, agenda e gravações ainda não estão conectadas às tabelas institucionais.</div>`;
let saepSession = { client: null, profile: null };
let currentView = 'dashboard';
const safeText = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
window.addEventListener('saep:profile-ready', event => {
  saepSession = event.detail || saepSession;
  if (currentView === 'dashboard') loadDashboardTurmas();
});
async function getTurmasDoUsuario(){
  const {client, profile} = saepSession;
  if(!client || !profile) throw new Error('Sessão do usuário ainda não foi carregada.');
  let turmaIds = null;
  if(profile.papel === 'professor'){
    const {data: vinculos, error: vinculoError} = await client.from('professor_turmas').select('turma_id').eq('professor_id', profile.id);
    if(vinculoError) throw vinculoError;
    turmaIds = (vinculos || []).map(v => v.turma_id);
    if(!turmaIds.length) return [];
  }
  let query = client.from('turmas').select('id,nome,curso_id,unidade_id').order('nome');
  if(profile.papel === 'coordenacao') query = query.eq('unidade_id', profile.unidade_id);
  if(turmaIds) query = query.in('id', turmaIds);
  const {data: turmas, error} = await query;
  if(error) throw error;
  const rows = turmas || [];
  const cursoIds = [...new Set(rows.map(t=>t.curso_id).filter(Boolean))];
  let cursos = [];
  if(cursoIds.length){
    const result = await client.from('cursos').select('id,nome').in('id',cursoIds);
    if(result.error) throw result.error;
    cursos = result.data || [];
  }
  const cursoMap = new Map(cursos.map(c=>[c.id,c.nome]));
  return rows.map(t=>({...t, curso_nome:cursoMap.get(t.curso_id) || 'Curso não disponível'}));
}
async function loadDashboardTurmas(){
  const tbody = document.getElementById('dashboardTurmaRows');
  if(!tbody) return;
  tbody.innerHTML = '<tr><td colspan="4">Carregando turmas...</td></tr>';
  try{
    const turmas = await getTurmasDoUsuario();
    if(!document.getElementById('dashboardTurmaRows')) return;
    if(!turmas.length){
      tbody.innerHTML = '<tr><td colspan="4">Nenhuma turma vinculada a este perfil foi encontrada.</td></tr>';
      return;
    }
    tbody.innerHTML = turmas.map(t=>`<tr><td>${safeText(t.nome)}</td><td>${safeText(t.curso_nome)}</td><td>${saepSession.profile.papel === 'professor' ? safeText(saepSession.profile.nome) : '—'}</td><td><span class="status done">Cadastrada</span></td></tr>`).join('');
  }catch(err){
    console.error('Falha ao carregar turmas:', err);
    if(document.getElementById('dashboardTurmaRows')) tbody.innerHTML = `<tr><td colspan="4">Não foi possível carregar as turmas: ${safeText(err.message || 'erro de consulta')}</td></tr>`;
  }
}
// Cadastro de turmas e alunos - importacao de cinco colunas (sem notas).
async function renderTurmasReais(){
  const root=document.getElementById('turmasPanel'); if(!root)return;
  const {client,profile}=saepSession;
  const manage=['administrador','coordenacao'].includes(profile?.papel)&&profile?.ativo!==false;
  const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const clean=v=>String(v??'').trim();
  const options=(rows,placeholder)=>`<option value="">${placeholder}</option>`+rows.map(r=>`<option value="${safeText(r.id)}">${safeText(r.nome)}</option>`).join('');
  let turmas=[],cursos=[],unidades=[],previewRows=[],pendingClass=null;
  const fail=err=>{console.error('SAEP Turmas e alunos:',err);toast(err.message||'Erro no Supabase.');};
  const fetchData=async()=>{
    turmas=await getTurmasDoUsuario();
    if(manage){
      const [c,u]=await Promise.all([client.from('cursos').select('id,nome,unidade_id,ativo').order('nome'),client.from('unidades').select('id,nome,ativo').order('nome')]);
      if(c.error)throw c.error;if(u.error)throw u.error;
      cursos=c.data||[];unidades=u.data||[];
    }
  };
  const classOpts=()=>options(turmas,'Selecione a turma');
  const fillClasses=(selectId,courseId)=>{
    const el=document.getElementById(selectId);if(!el)return;
    const rows=courseId?turmas.filter(t=>t.curso_id===courseId):turmas;
    el.innerHTML=options(rows,'Selecione a turma');
  };
  const updateLists=()=>{
    for(const id of ['studentCourse','classCourse']){
      const el=document.getElementById(id);if(el){const old=el.value;el.innerHTML=options(cursos.filter(c=>c.ativo!==false),'Selecione o curso');if(cursos.some(c=>c.id===old))el.value=old;}
    }
    const search=document.getElementById('classCourseSearch');
    const suggestions=document.getElementById('classCourseSuggestions');
    if(suggestions)suggestions.innerHTML=cursos.filter(c=>c.ativo!==false).map(c=>`<option value="${safeText(c.nome)}"></option>`).join('');
    const existingSuggestions=document.getElementById('existingCourseSuggestions');if(existingSuggestions)existingSuggestions.innerHTML=cursos.filter(c=>c.ativo!==false).map(c=>`<option value="${safeText(c.nome)}"></option>`).join('');
    if(search){const selected=cursos.find(c=>c.id===document.getElementById('classCourse')?.value);search.value=selected?.nome||'';}
    const courseUnit=document.getElementById('courseUnit');if(courseUnit){const old=courseUnit.value;courseUnit.innerHTML=options(unidades.filter(u=>u.ativo!==false),'Selecione a unidade');if(unidades.some(u=>u.id===old))courseUnit.value=old;if(profile.papel==='coordenacao'){courseUnit.value=profile.unidade_id||'';courseUnit.disabled=true;}}
    const unit=document.getElementById('classUnit');if(unit){const old=unit.value;unit.innerHTML=options(unidades.filter(u=>u.ativo!==false),'Selecione a unidade');if(unidades.some(u=>u.id===old))unit.value=old;if(profile.papel==='coordenacao'){unit.value=profile.unidade_id||'';unit.disabled=true;}}
    const filter=document.getElementById('filterStudentClass');if(filter){const old=filter.value;filter.innerHTML=options(turmas,'Todas as turmas');if(turmas.some(t=>t.id===old))filter.value=old;}
    fillClasses('studentClass',document.getElementById('studentCourse')?.value||'');
  };
  const loadStudents=async()=>{
    const target=document.getElementById('studentsTable');if(!target)return;
    if(!turmas.length){target.innerHTML='<p class="muted">Nenhuma turma cadastrada para este perfil.</p>';return;}
    target.innerHTML='<p class="muted">Consultando estudantes...</p>';
    try{
      const chosen=document.getElementById('filterStudentClass')?.value||'';
      const ids=chosen?[chosen]:turmas.map(t=>t.id);
      const {data,error}=await client.from('alunos').select('id,turma_id,matricula,nome,ativo').in('turma_id',ids).order('nome');if(error)throw error;
      const students=data||[];const map=new Map(turmas.map(t=>[t.id,t]));
      target.innerHTML=students.length?`<div class="table-wrap"><table><thead><tr><th>Matrícula</th><th>Nome do estudante</th><th>Curso</th><th>Turma</th><th>Unidade</th><th>Situação</th>${manage?'<th>Ação</th>':''}</tr></thead><tbody>${students.map(a=>{const t=map.get(a.turma_id);const u=unidades.find(x=>x.id===t?.unidade_id);return `<tr><td>${safeText(a.matricula||'—')}</td><td>${safeText(a.nome)}</td><td>${safeText(t?.curso_nome||'—')}</td><td>${safeText(t?.nome||'—')}</td><td>${safeText(u?.nome||'—')}</td><td>${a.ativo?'Ativo':'Inativo'}</td>${manage?`<td><button type="button" class="secondary" data-edit-student="${safeText(a.id)}">Editar</button></td>`:''}</tr>`;}).join('')}</tbody></table></div><p class="hint">${students.length} estudante(s).</p>`:'<p class="muted">Nenhum estudante encontrado.</p>';
      if(manage)target.querySelectorAll('[data-edit-student]').forEach(btn=>btn.addEventListener('click',()=>{
        const s=students.find(x=>x.id===btn.dataset.editStudent);if(!s)return;
        document.getElementById('editStudentId').value=s.id;
        document.getElementById('editStudentName').value=s.nome;
        document.getElementById('editStudentEnrollment').value=s.matricula||'';
        document.getElementById('editStudentStatus').value=String(s.ativo);
        document.getElementById('studentEditForm').classList.remove('hidden');
      }));
    }catch(err){target.innerHTML=`<p class="muted">Erro ao consultar estudantes: ${safeText(err.message)}</p>`;}
  };
  root.innerHTML='<p class="muted">Carregando cursos, turmas e alunos...</p>';
  try{
    await fetchData();if(!document.getElementById('turmasPanel'))return;
    root.innerHTML=`<div class="panel-heading"><div><h3>Turmas e alunos</h3><p>Cadastro e consulta de estudantes por curso e turma.</p></div></div>
      ${manage?`<div class="form-actions"><button class="secondary" id="toggleCourseForm" type="button">＋ Cadastrar curso</button><button class="primary" id="toggleClassForm" type="button">＋ Cadastrar turma</button><button class="secondary" id="toggleStudentForm" type="button">＋ Cadastrar aluno</button><button class="secondary" id="toggleImportStudents" type="button">⇧ Importar Excel</button><button class="secondary" id="exportStudents" type="button">⇩ Exportar alunos</button></div>
      <div class="inline-form hidden" id="courseForm"><h3>Cadastrar curso</h3><p class="hint">Pesquise um curso já cadastrado antes de criar outro. Cursos novos ficam disponíveis para futuras turmas.</p><div class="form-grid"><label>Pesquisar ou digitar o nome do curso<input id="newCourseName" maxlength="160" list="existingCourseSuggestions" autocomplete="off" placeholder="Ex.: Técnico em ..."><datalist id="existingCourseSuggestions"></datalist></label><label>Unidade<select id="courseUnit"></select></label></div><div id="courseMatchMessage" class="hint"></div><div class="form-actions"><button class="primary" id="saveCourse" type="button">Salvar novo curso</button><button class="secondary" id="cancelCourse" type="button">Cancelar</button></div></div>
      <div class="inline-form hidden" id="classForm"><h3>Nova turma</h3><div class="form-grid"><label>Pesquisar curso existente<input id="classCourseSearch" list="classCourseSuggestions" autocomplete="off" placeholder="Digite para localizar um curso"><datalist id="classCourseSuggestions"></datalist><select id="classCourse" style="display:none" aria-hidden="true" tabindex="-1"></select></label><label>Código / nome da turma<input id="className" maxlength="160" placeholder="Ex.: HT-ELM-01-N-22-13490"></label><label>Unidade<select id="classUnit"></select></label><label>Situação<select id="classActive"><option value="true">Ativa</option><option value="false">Encerrada</option></select></label></div><p class="hint">Os campos turno e datas ainda não existem na tabela turmas. Nenhuma turma existente será modificada.</p><div class="form-actions"><button class="primary" id="saveClass" type="button">Salvar turma</button><button class="secondary" id="cancelClass" type="button">Cancelar</button></div></div>
      <div class="inline-form hidden" id="studentForm"><h3>Novo aluno</h3><div class="form-grid"><label>Curso<select id="studentCourse"></select></label><label>Turma<select id="studentClass"></select></label><label>Nome completo<input id="studentName" maxlength="160"></label><label>Matrícula<input id="studentEnrollment" maxlength="60"></label></div><div class="form-actions"><button class="secondary" id="newClassFromStudent" type="button">＋ Nova turma</button><button class="primary" id="saveStudent" type="button">Salvar aluno</button><button class="secondary" id="cancelStudent" type="button">Cancelar</button></div></div>
      <div class="inline-form hidden" id="importStudentsForm"><h3>Importar cadastro de alunos</h3><p class="hint">Modelo: Matrícula | Nome do estudante | Curso | Turma | Unidade. A turma será identificada pelo arquivo. Caso não exista, será necessário cadastrá-la antes de confirmar a importação. Não importa notas.</p><label>Arquivo Excel ou CSV<input id="studentImportFile" type="file" accept=".xlsx,.xls,.csv"></label><div id="studentImportPreview"></div><div class="form-actions"><button class="primary" id="confirmStudentImport" type="button" disabled>Confirmar importação</button><button class="secondary" id="cancelStudentImport" type="button">Cancelar</button></div></div>`:''}
      <div class="inline-form"><label>Filtrar por turma<select id="filterStudentClass"></select></label></div><div id="studentsTable"></div>
      ${manage?`<div class="inline-form hidden" id="studentEditForm"><h3>Editar aluno</h3><input type="hidden" id="editStudentId"><div class="form-grid"><label>Nome<input id="editStudentName"></label><label>Matrícula<input id="editStudentEnrollment"></label><label>Situação<select id="editStudentStatus"><option value="true">Ativo</option><option value="false">Inativo</option></select></label></div><div class="form-actions"><button class="primary" id="updateStudent" type="button">Salvar alterações</button><button class="secondary" id="cancelEditStudent" type="button">Cancelar</button></div></div>`:''}`;
    updateLists();document.getElementById('filterStudentClass').addEventListener('change',loadStudents);
    if(manage){
      const show=id=>document.getElementById(id).classList.remove('hidden');
      const hide=id=>document.getElementById(id).classList.add('hidden');
      const toggle=id=>document.getElementById(id).classList.toggle('hidden');
      document.getElementById('toggleCourseForm').onclick=()=>toggle('courseForm');
      document.getElementById('cancelCourse').onclick=()=>hide('courseForm');
      const courseInput=document.getElementById('newCourseName');
      const refreshCourseMatches=()=>{
        const name=clean(courseInput.value),unitId=document.getElementById('courseUnit').value;
        const found=cursos.find(c=>norm(c.nome)===norm(name)&&(!unitId||c.unidade_id===unitId));
        document.getElementById('courseMatchMessage').textContent=found?'Este curso já está cadastrado nesta unidade. Selecione-o ao cadastrar uma turma.':'Informe o nome completo de um curso ainda não cadastrado.';
        document.getElementById('saveCourse').disabled=!name||!!found;
      };
      courseInput.oninput=refreshCourseMatches;document.getElementById('courseUnit').onchange=refreshCourseMatches;
      document.getElementById('saveCourse').onclick=async()=>{
        const btn=document.getElementById('saveCourse');btn.disabled=true;
        try{
          const nome=clean(courseInput.value),unidade_id=document.getElementById('courseUnit').value;
          if(!nome||!unidade_id)throw new Error('Informe o nome do curso e a unidade.');
          if(profile.papel==='coordenacao'&&unidade_id!==profile.unidade_id)throw new Error('Unidade não autorizada.');
          const {data:existing,error:readError}=await client.from('cursos').select('id,nome,unidade_id').eq('unidade_id',unidade_id);if(readError)throw readError;
          if((existing||[]).some(c=>norm(c.nome)===norm(nome)))throw new Error('Este curso já está cadastrado nesta unidade.');
          const {error}=await client.from('cursos').insert({nome,unidade_id,ativo:true});if(error)throw error;
          await fetchData();updateLists();courseInput.value='';hide('courseForm');toast('Curso cadastrado no Supabase.');
        }catch(err){fail(err);}finally{refreshCourseMatches();}
      };
      const classSearch=document.getElementById('classCourseSearch');
      classSearch.oninput=()=>{const match=cursos.filter(c=>c.ativo!==false&&norm(c.nome)===norm(clean(classSearch.value)));document.getElementById('classCourse').value=match.length===1?match[0].id:'';};
      document.getElementById('toggleClassForm').onclick=()=>toggle('classForm');
      document.getElementById('toggleStudentForm').onclick=()=>toggle('studentForm');
      document.getElementById('newClassFromStudent').onclick=()=>show('classForm');
      document.getElementById('toggleImportStudents').onclick=()=>toggle('importStudentsForm');
      document.getElementById('cancelClass').onclick=()=>hide('classForm');
      document.getElementById('cancelStudent').onclick=()=>hide('studentForm');
      document.getElementById('cancelEditStudent').onclick=()=>hide('studentEditForm');
      document.getElementById('cancelStudentImport').onclick=()=>{hide('importStudentsForm');previewRows=[];pendingClass=null;document.getElementById('studentImportPreview').innerHTML='';document.getElementById('studentImportFile').value='';document.getElementById('confirmStudentImport').disabled=true;};
      document.getElementById('studentCourse').onchange=e=>fillClasses('studentClass',e.target.value);
      document.getElementById('existingCourseSuggestions').innerHTML=cursos.filter(c=>c.ativo!==false).map(c=>`<option value="${safeText(c.nome)}"></option>`).join('');
      refreshCourseMatches();
      const createClass=async(courseId,name,unitId,active=true)=>{
        if(!courseId||!name||!unitId)throw new Error('Informe curso, código da turma e unidade.');
        if(profile.papel==='coordenacao'&&unitId!==profile.unidade_id)throw new Error('Unidade não autorizada.');
        const course=cursos.find(c=>c.id===courseId);if(!course)throw new Error('Pesquise e selecione um curso já cadastrado.');
        if(course.unidade_id&&course.unidade_id!==unitId)throw new Error('O curso pertence a outra unidade.');
        if(turmas.some(t=>norm(t.nome)===norm(name)&&t.unidade_id===unitId))throw new Error('Já existe turma com este código nesta unidade.');
        const {data,error}=await client.from('turmas').insert({nome:name,curso_id:courseId,unidade_id:unitId,ativo:active}).select('id').single();if(error)throw error;
        await fetchData();updateLists();loadStudents();loadDashboardTurmas();return data.id;
      };
      document.getElementById('saveClass').onclick=async()=>{
        const btn=document.getElementById('saveClass');btn.disabled=true;
        try{classSearch.oninput();const courseId=document.getElementById('classCourse').value;const name=clean(document.getElementById('className').value);const unitId=document.getElementById('classUnit').value;const id=await createClass(courseId,name,unitId,document.getElementById('classActive').value==='true');hide('classForm');document.getElementById('studentCourse').value=courseId;fillClasses('studentClass',courseId);document.getElementById('studentClass').value=id;toast('Turma cadastrada no Supabase.');}
        catch(err){fail(err);}finally{btn.disabled=false;}
      };
      document.getElementById('saveStudent').onclick=async()=>{
        const btn=document.getElementById('saveStudent');btn.disabled=true;
        try{
          const turma_id=document.getElementById('studentClass').value;const t=turmas.find(x=>x.id===turma_id);
          const nome=clean(document.getElementById('studentName').value),matricula=clean(document.getElementById('studentEnrollment').value);
          if(!t||!nome||!matricula)throw new Error('Selecione uma turma e informe nome e matrícula.');
          const {data:found,error:lookupError}=await client.from('alunos').select('id,matricula').eq('turma_id',turma_id).eq('matricula',matricula).limit(1);if(lookupError)throw lookupError;
          if(found?.length)throw new Error('Matrícula já cadastrada nesta turma.');
          const {error}=await client.from('alunos').insert({turma_id,unidade_id:t.unidade_id,nome,matricula,ativo:true});if(error)throw error;
          document.getElementById('studentName').value='';document.getElementById('studentEnrollment').value='';hide('studentForm');document.getElementById('filterStudentClass').value=turma_id;await loadStudents();toast('Aluno cadastrado.');
        }catch(err){fail(err);}finally{btn.disabled=false;}
      };
      document.getElementById('updateStudent').onclick=async()=>{
        const btn=document.getElementById('updateStudent');btn.disabled=true;
        try{const id=document.getElementById('editStudentId').value;const nome=clean(document.getElementById('editStudentName').value);if(!nome)throw new Error('Informe o nome.');const {error}=await client.from('alunos').update({nome,matricula:clean(document.getElementById('editStudentEnrollment').value)||null,ativo:document.getElementById('editStudentStatus').value==='true'}).eq('id',id);if(error)throw error;hide('studentEditForm');await loadStudents();toast('Aluno atualizado.');}catch(err){fail(err);}finally{btn.disabled=false;}
      };
      const resolveRow=(r)=>{
        const course=cursos.filter(c=>norm(c.nome)===norm(r.curso));
        const unit=unidades.filter(u=>norm(u.nome)===norm(r.unidade));
        if(course.length!==1)throw new Error(`Curso não encontrado ou ambíguo: ${r.curso}`);
        if(unit.length!==1)throw new Error(`Unidade não encontrada ou ambígua: ${r.unidade}`);
        if(profile.papel==='coordenacao'&&unit[0].id!==profile.unidade_id)throw new Error('A planilha contém unidade fora do seu perfil.');
        if(course[0].unidade_id&&course[0].unidade_id!==unit[0].id)throw new Error('Curso e unidade não correspondem.');
        return {course:course[0],unit:unit[0]};
      };
      const importBtn=document.getElementById('confirmStudentImport');
      document.getElementById('studentImportFile').onchange=async e=>{
        previewRows=[];pendingClass=null;importBtn.disabled=true;
        const target=document.getElementById('studentImportPreview');target.innerHTML='';const file=e.target.files?.[0];if(!file)return;
        try{
          if(!/\.(xlsx|xls|csv)$/i.test(file.name)||file.size>10*1024*1024)throw new Error('Use Excel ou CSV de até 10 MB.');
          if(!window.XLSX)throw new Error('Biblioteca XLSX não carregada.');
          const wb=/\.csv$/i.test(file.name)?XLSX.read(await file.text(),{type:'string'}):XLSX.read(await file.arrayBuffer(),{type:'array'});
          const sheet=wb.Sheets[wb.SheetNames[0]];if(!sheet)throw new Error('Planilha sem aba válida.');
          const raw=XLSX.utils.sheet_to_json(sheet,{defval:'',raw:false});if(!raw.length)throw new Error('Planilha vazia.');
          const keys=Object.keys(raw[0]);const key=aliases=>keys.find(k=>aliases.includes(norm(k)));
          const k={mat:key(['matricula']),nome:key(['nomedoestudante','nome','aluno']),curso:key(['curso']),turma:key(['turma']),unidade:key(['unidade'])};
          if(Object.values(k).some(x=>!x))throw new Error('Cabeçalhos obrigatórios: Matrícula, Nome do estudante, Curso, Turma, Unidade.');
          const rows=raw.map((x,i)=>({linha:i+2,matricula:clean(x[k.mat]),nome:clean(x[k.nome]),curso:clean(x[k.curso]),turma:clean(x[k.turma]),unidade:clean(x[k.unidade])}));
          if(rows.some(r=>!r.matricula||!r.nome||!r.curso||!r.turma||!r.unidade))throw new Error('Há linhas com campos obrigatórios vazios.');
          const groups=new Set(rows.map(r=>[norm(r.curso),norm(r.turma),norm(r.unidade)].join('|')));
          if(groups.size!==1)throw new Error('Importe uma turma por arquivo. Separe os estudantes de outras turmas em outra planilha.');
          const seen=new Set();for(const r of rows){const id=norm(r.matricula);if(seen.has(id))throw new Error(`Matrícula repetida na planilha: ${r.matricula}`);seen.add(id);}
          const {course,unit}=resolveRow(rows[0]);
          const matches=turmas.filter(t=>norm(t.nome)===norm(rows[0].turma)&&t.curso_id===course.id&&t.unidade_id===unit.id);
          if(matches.length>1)throw new Error('Mais de uma turma corresponde ao arquivo.');
          pendingClass={course,unit,nome:rows[0].turma,turma:matches[0]||null};
          previewRows=rows;
          target.innerHTML=`<p><b>${rows.length} aluno(s)</b> • Curso: ${safeText(rows[0].curso)} • Turma: ${safeText(rows[0].turma)} • Unidade: ${safeText(rows[0].unidade)}</p>${!pendingClass.turma?'<p class="hint"><b>Turma ainda não cadastrada.</b> Ao confirmar, o sistema solicitará autorização para criar a turma antes dos alunos.</p>':'<p class="hint">Turma já cadastrada. Matrículas existentes serão ignoradas.</p>'}<div class="table-wrap"><table><thead><tr><th>Matrícula</th><th>Nome do estudante</th><th>Curso</th><th>Turma</th><th>Unidade</th></tr></thead><tbody>${rows.slice(0,30).map(r=>`<tr><td>${safeText(r.matricula)}</td><td>${safeText(r.nome)}</td><td>${safeText(r.curso)}</td><td>${safeText(r.turma)}</td><td>${safeText(r.unidade)}</td></tr>`).join('')}</tbody></table></div><p class="hint">Prévia das primeiras ${Math.min(rows.length,30)} linhas. Nenhum dado gravado.</p>`;
          importBtn.disabled=false;
        }catch(err){target.innerHTML=`<p class="muted">${safeText(err.message)}</p>`;}
      };
      importBtn.onclick=async()=>{
        if(!previewRows.length||!pendingClass)return;
        if(!pendingClass.turma&&!window.confirm(`A turma ${pendingClass.nome} não existe. Deseja cadastrá-la e importar os alunos?`))return;
        importBtn.disabled=true;importBtn.textContent='Importando...';
        try{
          let turmaId=pendingClass.turma?.id;
          if(!turmaId)turmaId=await createClass(pendingClass.course.id,pendingClass.nome,pendingClass.unit.id,true);
          const {data:existing,error:checkError}=await client.from('alunos').select('matricula').eq('turma_id',turmaId);if(checkError)throw checkError;
          const known=new Set((existing||[]).map(a=>norm(a.matricula)).filter(Boolean));
          const fresh=previewRows.filter(r=>!known.has(norm(r.matricula)));
          let count=0;
          for(let i=0;i<fresh.length;i+=100){
            const batch=fresh.slice(i,i+100).map(r=>({nome:r.nome,matricula:r.matricula,turma_id:turmaId,unidade_id:pendingClass.unit.id,ativo:true}));
            const {error}=await client.from('alunos').insert(batch);if(error)throw new Error(`Falha após ${count} aluno(s) importado(s): ${error.message}`);
            count+=batch.length;
          }
          document.getElementById('filterStudentClass').value=turmaId;await loadStudents();
          document.getElementById('studentImportPreview').innerHTML=`<p><b>Importação concluída:</b> ${count} novo(s) aluno(s), ${previewRows.length-count} matrícula(s) já existente(s).</p>`;
          previewRows=[];pendingClass=null;document.getElementById('studentImportFile').value='';toast(`${count} aluno(s) importado(s).`);
        }catch(err){fail(err);document.getElementById('studentImportPreview').insertAdjacentHTML('beforeend',`<p class="muted">${safeText(err.message)}. Confira os cadastros antes de repetir.</p>`);}
        finally{importBtn.textContent='Confirmar importação';importBtn.disabled=!previewRows.length;}
      };
      document.getElementById('exportStudents').onclick=async()=>{
        try{
          if(!window.XLSX)throw new Error('Biblioteca XLSX não carregada.');
          const selected=document.getElementById('filterStudentClass').value;
          const chosen=selected?turmas.filter(t=>t.id===selected):turmas;
          if(!chosen.length)throw new Error('Não há turmas para exportar.');
          const {data,error}=await client.from('alunos').select('nome,matricula,turma_id').in('turma_id',chosen.map(t=>t.id)).order('nome');if(error)throw error;
          const map=new Map(turmas.map(t=>[t.id,t]));
          const rows=(data||[]).map(a=>{const t=map.get(a.turma_id),u=unidades.find(x=>x.id===t?.unidade_id);return {'Matrícula':a.matricula||'','Nome do estudante':a.nome,'Curso':t?.curso_nome||'','Turma':t?.nome||'','Unidade':u?.nome||''};});
          const ws=XLSX.utils.json_to_sheet(rows,{header:['Matrícula','Nome do estudante','Curso','Turma','Unidade']});
          const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Alunos');
          XLSX.writeFile(wb,`SAEP_Alunos_${selected?chosen[0].nome.replace(/[^a-z0-9_-]/gi,'_'):'Todas_as_turmas'}.xlsx`);
        }catch(err){fail(err);}
      };
    }
    await loadStudents();
  }catch(err){console.error(err);if(document.getElementById('turmasPanel'))root.innerHTML=`<p class="muted">Não foi possível carregar o cadastro: ${safeText(err.message)}</p>`;}
}

// Módulo pedagógico integrado ao Supabase - v3.5.0
let pedagogicalData = null;
const scoreFmt = value => value === null || value === undefined || value === '' ? '—' : Number(value).toLocaleString('pt-BR',{maximumFractionDigits:2});
const dateFmt = value => value ? new Date(value + (String(value).length===10?'T12:00:00':'')).toLocaleDateString('pt-BR') : '—';
async function loadPedagogicalData(){
  const {client, profile} = saepSession;
  if(!client || !profile) throw new Error('Sessão do usuário ainda não foi carregada.');
  const turmas = await getTurmasDoUsuario();
  const turmaIds = turmas.map(t=>t.id);
  if(!turmaIds.length) return {turmas,students:[],applications:[],results:[],competencies:[],simulados:[],interventions:[]};
  const [studentRes, appRes] = await Promise.all([
    client.from('alunos').select('id,nome,matricula,turma_id,ativo').in('turma_id',turmaIds).order('nome'),
    client.from('aplicacoes').select('id,simulado_id,turma_id,professor_id,data_aplicacao,horario,status,observacoes').in('turma_id',turmaIds).order('data_aplicacao',{ascending:false})
  ]);
  if(studentRes.error) throw studentRes.error;
  if(appRes.error) throw appRes.error;
  const students = studentRes.data || [], applications = appRes.data || [];
  const appIds = applications.map(a=>a.id);
  const studentIds = students.map(a=>a.id);
  const simuladoIds = [...new Set(applications.map(a=>a.simulado_id).filter(Boolean))];
  const [resultRes, simRes] = await Promise.all([
    appIds.length ? client.from('resultados').select('id,aluno_id,aplicacao_id,competencia_id,pontuacao,criado_em').in('aplicacao_id',appIds) : Promise.resolve({data:[],error:null}),
    simuladoIds.length ? client.from('simulados').select('id,nome,descricao,ativo').in('id',simuladoIds) : Promise.resolve({data:[],error:null})
  ]);
  if(resultRes.error) throw resultRes.error;
  if(simRes.error) throw simRes.error;
  const results = resultRes.data || [], simulados = simRes.data || [];
  const competencyIds = [...new Set(results.map(r=>r.competencia_id).filter(Boolean))];
  const courseIds = [...new Set(turmas.map(t=>t.curso_id).filter(Boolean))];
  const [compRes, interventionRes] = await Promise.all([
    competencyIds.length ? client.from('competencias').select('id,codigo,descricao,curso_id').in('id',competencyIds) : Promise.resolve({data:[],error:null}),
    studentIds.length ? client.from('intervencoes').select('id,aluno_id,competencia_id,descricao,status,criado_em').in('aluno_id',studentIds) : Promise.resolve({data:[],error:null})
  ]);
  if(compRes.error) throw compRes.error;
  if(interventionRes.error) throw interventionRes.error;
  return {turmas,students,applications,results,competencies:compRes.data||[],simulados,interventions:interventionRes.data||[],courseIds};
}
function pedMaps(data){
  return {
    turma:new Map(data.turmas.map(x=>[x.id,x.nome])),
    student:new Map(data.students.map(x=>[x.id,x])),
    app:new Map(data.applications.map(x=>[x.id,x])),
    sim:new Map(data.simulados.map(x=>[x.id,x.nome])),
    comp:new Map(data.competencies.map(x=>[x.id,x]))
  };
}
function pedFiltersMarkup(data){
  return `<div class="inline-form"><div class="form-grid">
    <label>Turma<select id="pedFilterClass"><option value="">Todas as turmas</option>${data.turmas.map(t=>`<option value="${safeText(t.id)}">${safeText(t.nome)}</option>`).join('')}</select></label>
    <label>Estudante<select id="pedFilterStudent"><option value="">Todos os estudantes</option>${data.students.map(s=>`<option value="${safeText(s.id)}">${safeText(s.nome)}</option>`).join('')}</select></label>
    <label>Avaliação<select id="pedFilterApplication"><option value="">Todas as avaliações</option>${data.applications.map(a=>`<option value="${safeText(a.id)}">${safeText(data.simulados.find(s=>s.id===a.simulado_id)?.nome || 'Simulado')} · ${safeText(dateFmt(a.data_aplicacao))}</option>`).join('')}</select></label>
  </div></div>`;
}
function getPedFiltered(data){
  const turmaId=document.getElementById('pedFilterClass')?.value||'';
  const studentId=document.getElementById('pedFilterStudent')?.value||'';
  const appId=document.getElementById('pedFilterApplication')?.value||'';
  const allowedStudents=new Set(data.students.filter(s=>(!turmaId||s.turma_id===turmaId)&&(!studentId||s.id===studentId)).map(s=>s.id));
  const allowedApps=new Set(data.applications.filter(a=>(!turmaId||a.turma_id===turmaId)&&(!appId||a.id===appId)).map(a=>a.id));
  const results=data.results.filter(r=>allowedStudents.has(r.aluno_id)&&allowedApps.has(r.aplicacao_id));
  return {turmaId,studentId,appId,results,students:data.students.filter(s=>(!turmaId||s.turma_id===turmaId)&&(!studentId||s.id===studentId)),applications:data.applications.filter(a=>(!turmaId||a.turma_id===turmaId)&&(!appId||a.id===appId)),interventions:data.interventions.filter(i=>allowedStudents.has(i.aluno_id))};
}
function wirePedFilters(data, render){
  const cls=document.getElementById('pedFilterClass'), stu=document.getElementById('pedFilterStudent'), app=document.getElementById('pedFilterApplication');
  const refresh=()=>{
    const oldStudent=stu.value, oldApp=app.value, turmaId=cls.value;
    const students=data.students.filter(s=>!turmaId||s.turma_id===turmaId);
    const apps=data.applications.filter(a=>!turmaId||a.turma_id===turmaId);
    stu.innerHTML='<option value="">Todos os estudantes</option>'+students.map(s=>`<option value="${safeText(s.id)}">${safeText(s.nome)}</option>`).join('');
    app.innerHTML='<option value="">Todas as avaliações</option>'+apps.map(a=>`<option value="${safeText(a.id)}">${safeText(data.simulados.find(s=>s.id===a.simulado_id)?.nome||'Simulado')} · ${safeText(dateFmt(a.data_aplicacao))}</option>`).join('');
    if(students.some(s=>s.id===oldStudent)) stu.value=oldStudent;
    if(apps.some(a=>a.id===oldApp)) app.value=oldApp;
    render();
  };
  cls.addEventListener('change',refresh); stu.addEventListener('change',render); app.addEventListener('change',render);
}

// SAEP Inteligente 3.6.0
// Importação de resultados: pré-visualização sem gravação.

function canPreviewResultImport() {
  const profile = saepSession.profile;

  return ['administrador', 'coordenacao'].includes(profile?.papel)
    && profile?.ativo !== false;
}

function resultImportMarkup() {
  if (!canPreviewResultImport()) return '';

  return `
    <div class="form-actions">
      <button type="button" class="secondary"
        data-open-result-import>
        ⇧ Importar resultados (Excel/CSV)
      </button>
    </div>

    <div class="inline-form hidden" id="resultImportPanel">
      <h3>Pré-visualizar importação de resultados</h3>

      <p class="hint">
        Selecione uma planilha para conferência local.
        Nenhum dado será enviado ao Supabase nesta etapa.
      </p>

      <label>
        Arquivo Excel ou CSV
        <input type="file" id="resultImportFile"
          accept=".xlsx,.xls,.csv">
      </label>

      <div id="resultImportPreview" aria-live="polite"></div>

      <div class="form-actions">
        <button type="button" class="primary" disabled
          title="Disponível após validação e integração segura">
          Confirmar importação (em desenvolvimento)
        </button>

        <button type="button" class="secondary"
          data-close-result-import>
          Fechar
        </button>
      </div>
    </div>
  `;
}

function wireResultImportPreview() {
  const panel = document.getElementById('resultImportPanel');

  if (!panel || !canPreviewResultImport()) return;

  const fileInput = panel.querySelector('#resultImportFile');
  const preview = panel.querySelector('#resultImportPreview');

  panel.parentElement
    .querySelector('[data-open-result-import]')
    ?.addEventListener('click', () => {
      panel.classList.toggle('hidden');
    });

  panel.querySelector('[data-close-result-import]')
    ?.addEventListener('click', () => {
      panel.classList.add('hidden');
      fileInput.value = '';
      preview.innerHTML = '';
    });

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    preview.innerHTML = '';

    if (!file) return;

    try {
      if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
        throw new Error('Selecione um arquivo Excel ou CSV.');
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error(
          'Arquivo acima do limite de pré-visualização (10 MB).'
        );
      }

      if (!window.XLSX) {
        throw new Error(
          'Leitor Excel/CSV não disponível nesta página.'
        );
      }

      const wb = /\.csv$/i.test(file.name)
        ? XLSX.read(await file.text(), { type: 'string' })
        : XLSX.read(await file.arrayBuffer(), { type: 'array' });

      const sheet = wb.Sheets[wb.SheetNames[0]];

      if (!sheet) {
        throw new Error('Não foi encontrada uma aba válida.');
      }

      const rows = XLSX.utils.sheet_to_json(sheet, {
        defval: '',
        raw: false
      });

      const cols = rows.length ? Object.keys(rows[0]) : [];

      const header = cols
        .map(c => `<th>${safeText(c)}</th>`)
        .join('');

      const body = rows.slice(0, 8)
        .map(row => `
          <tr>
            ${cols.map(c =>
              `<td>${safeText(row[c])}</td>`
            ).join('')}
          </tr>
        `).join('');

      preview.innerHTML = `
        <p>
          <b>${safeText(file.name)}</b> —
          ${rows.length} linha(s),
          ${cols.length} coluna(s).
        </p>

        ${rows.length ? `
          <div class="table-wrap">
            <table>
              <thead><tr>${header}</tr></thead>
              <tbody>${body}</tbody>
            </table>
          </div>
        ` : '<p class="muted">A primeira aba está vazia.</p>'}

        <p class="hint">
          Somente as primeiras 8 linhas são exibidas.
          Pré-visualização local; nenhuma gravação foi realizada.
        </p>
      `;

    } catch (err) {
      preview.innerHTML = `
        <p class="muted">
          ${safeText(err.message || 'Falha ao ler arquivo.')}
        </p>
      `;
    }
  });
}
function renderResultsContent(data){
  const target=document.getElementById('pedagogicalPanel'); if(!target)return;
  if(!data.turmas.length){target.innerHTML='<p class="muted">Não há turmas disponíveis para este perfil.</p>';return;}
  const maps=pedMaps(data);
  const draw=()=>{
    const f=getPedFiltered(data);
    const rows=f.results.map(r=>{const s=maps.student.get(r.aluno_id),a=maps.app.get(r.aplicacao_id),c=maps.comp.get(r.competencia_id);return `<tr><td>${safeText(dateFmt(a?.data_aplicacao))}</td><td>${safeText(maps.turma.get(a?.turma_id)||'—')}</td><td>${safeText(s?.nome||'Estudante não disponível')}</td><td>${safeText(maps.sim.get(a?.simulado_id)||'Simulado')}</td><td>${safeText(c?.codigo||'')} ${safeText(c?.descricao||'Competência não informada')}</td><td>${safeText(scoreFmt(r.pontuacao))}</td></tr>`;}).join('');
    const table=rows?`<div class="table-wrap"><table><thead><tr><th>Data</th><th>Turma</th><th>Estudante</th><th>Avaliação</th><th>Competência</th><th>Pontuação</th></tr></thead><tbody>${rows}</tbody></table></div><p class="hint">${f.results.length} registro(s) de resultado. A pontuação é exibida conforme gravada no banco, sem conversão para percentual.</p>`:'<p class="muted">Nenhum resultado encontrado para os filtros selecionados.</p>';
    const heading=target.querySelector('#pedResultsTable'); if(heading)heading.innerHTML=table;
  };
target.innerHTML = `<div class="panel-heading"><div><h3>Resultados e notas</h3><p>Consulta de pontuações reais do Supabase, respeitando as permissões do seu perfil.</p></div></div>${resultImportMarkup()}${pedFiltersMarkup(data)}<div id="pedResultsTable"></div>`;

wirePedFilters(data, draw);
wireResultImportPreview();
draw();
}
function renderCompetenciesContent(data){
  const target=document.getElementById('pedagogicalPanel'); if(!target)return;
  if(!data.turmas.length){target.innerHTML='<p class="muted">Não há turmas disponíveis para este perfil.</p>';return;}
  const maps=pedMaps(data);
  const draw=()=>{
    const f=getPedFiltered(data), groups=new Map();
    f.results.forEach(r=>{const key=r.competencia_id||'sem';const g=groups.get(key)||{sum:0,count:0};if(r.pontuacao!==null&&r.pontuacao!==undefined){g.sum+=Number(r.pontuacao);g.count++;}groups.set(key,g);});
    const rows=[...groups.entries()].map(([id,g])=>{const c=maps.comp.get(id);return `<tr><td>${safeText(c?.codigo||'—')}</td><td>${safeText(c?.descricao||'Competência não identificada')}</td><td>${g.count}</td><td>${g.count?scoreFmt(g.sum/g.count):'—'}</td></tr>`;}).join('');
    const box=target.querySelector('#pedCompetencyTable');if(box)box.innerHTML=rows?`<div class="table-wrap"><table><thead><tr><th>Código</th><th>Competência</th><th>Registros</th><th>Média da pontuação</th></tr></thead><tbody>${rows}</tbody></table></div><p class="hint">Médias calculadas sobre os valores numéricos gravados em resultados.pontuacao.</p>`:'<p class="muted">Não há resultados associados a competências nos filtros selecionados.</p>';
  };
  target.innerHTML=`<div class="panel-heading"><div><h3>Desempenho por competência</h3><p>Consolidação das pontuações registradas.</p></div></div>${pedFiltersMarkup(data)}<div id="pedCompetencyTable"></div>`;
  wirePedFilters(data,draw);draw();
}
function renderReportsContent(data){
  const target=document.getElementById('pedagogicalPanel'); if(!target)return;
  if(!data.turmas.length){target.innerHTML='<p class="muted">Não há turmas disponíveis para este perfil.</p>';return;}
  const maps=pedMaps(data);
  const draw=()=>{
    const f=getPedFiltered(data), byStudent=new Map(), byComp=new Map();
    f.results.forEach(r=>{
      const s=byStudent.get(r.aluno_id)||{sum:0,count:0};if(r.pontuacao!==null&&r.pontuacao!==undefined){s.sum+=Number(r.pontuacao);s.count++;}byStudent.set(r.aluno_id,s);
      const c=byComp.get(r.competencia_id||'sem')||{sum:0,count:0};if(r.pontuacao!==null&&r.pontuacao!==undefined){c.sum+=Number(r.pontuacao);c.count++;}byComp.set(r.competencia_id||'sem',c);
    });
    const studentRows=f.students.map(s=>{const g=byStudent.get(s.id)||{sum:0,count:0};const interventions=f.interventions.filter(i=>i.aluno_id===s.id).length;return `<tr><td>${safeText(s.nome)}</td><td>${safeText(maps.turma.get(s.turma_id)||'—')}</td><td>${g.count}</td><td>${g.count?scoreFmt(g.sum/g.count):'—'}</td><td>${interventions}</td></tr>`;}).join('');
    const compRows=[...byComp.entries()].map(([id,g])=>{const c=maps.comp.get(id);return `<tr><td>${safeText(c?.codigo||'—')}</td><td>${safeText(c?.descricao||'Competência não identificada')}</td><td>${g.count}</td><td>${g.count?scoreFmt(g.sum/g.count):'—'}</td></tr>`;}).join('');
    const interventionRows=f.interventions.map(i=>{const s=maps.student.get(i.aluno_id),c=maps.comp.get(i.competencia_id);return `<tr><td>${safeText(s?.nome||'—')}</td><td>${safeText(c?.codigo||'—')}</td><td>${safeText(i.descricao||'—')}</td><td>${safeText(i.status||'—')}</td><td>${safeText(dateFmt(i.criado_em))}</td></tr>`;}).join('');
    const box=target.querySelector('#pedReportTables');if(box)box.innerHTML=`<h3>Desempenho por estudante</h3>${studentRows?`<div class="table-wrap"><table><thead><tr><th>Estudante</th><th>Turma</th><th>Notas registradas</th><th>Média da pontuação</th><th>Intervenções</th></tr></thead><tbody>${studentRows}</tbody></table></div>`:'<p class="muted">Nenhum estudante encontrado.</p>'}<h3>Desempenho por competência</h3>${compRows?`<div class="table-wrap"><table><thead><tr><th>Código</th><th>Competência</th><th>Registros</th><th>Média da pontuação</th></tr></thead><tbody>${compRows}</tbody></table></div>`:'<p class="muted">Não há resultados por competência.</p>'}<h3>Intervenções pedagógicas</h3>${interventionRows?`<div class="table-wrap"><table><thead><tr><th>Estudante</th><th>Competência</th><th>Descrição</th><th>Status</th><th>Data</th></tr></thead><tbody>${interventionRows}</tbody></table></div>`:'<p class="muted">Nenhuma intervenção encontrada para os filtros selecionados.</p>'}<p class="hint">Relatório calculado com os registros disponíveis no Supabase. Médias exibem a pontuação original, sem presumir escala percentual.</p>`;
  };
target.innerHTML=`<div class="panel-heading"><div><h3>Relatórios pedagógicos</h3><p>Desempenho por estudante e competência, com acompanhamento das intervenções.</p></div></div>${resultImportMarkup()}${pedFiltersMarkup(data)}<div id="pedReportTables"></div>`;

wirePedFilters(data,draw);
wireResultImportPreview();
draw();
}
async function renderPedagogicalView(name){
  const target=document.getElementById('pedagogicalPanel'); if(!target)return;
  target.innerHTML='<p class="muted">Consultando dados pedagógicos no Supabase...</p>';
  try{
    const data=await loadPedagogicalData();
    if(!document.getElementById('pedagogicalPanel'))return;
    pedagogicalData=data;
    if(name==='resultados')renderResultsContent(data);
    else if(name==='competencias')renderCompetenciesContent(data);
    else renderReportsContent(data);
  }catch(err){
    console.error('Falha ao carregar dados pedagógicos:',err);
    if(document.getElementById('pedagogicalPanel'))target.innerHTML=`<div class="panel-heading"><div><h3>Não foi possível carregar os dados pedagógicos</h3><p>Verifique as políticas RLS e a conexão com o Supabase.</p></div></div><p class="muted">${safeText(err.message||'Erro de consulta')}</p><button class="secondary" id="retryPedagogical">Tentar novamente</button>`;
    document.getElementById('retryPedagogical')?.addEventListener('click',()=>renderPedagogicalView(name));
  }
}

function showView(name){
 currentView = name;
 const modePill=document.getElementById('dataModePill');
 if(modePill){
  modePill.textContent=['turmas','resultados','competencias','relatorios'].includes(name)?'DADOS DO SUPABASE':'DADOS DEMONSTRATIVOS';
  modePill.title=['turmas','resultados','competencias','relatorios'].includes(name)?'Esta tela consulta dados reais do Supabase conforme as permissões do perfil.':'Esta área ainda utiliza dados demonstrativos ou funcionalidades em validação.';
 }
 if(name==="dashboard"){
  $("#pageTitle").textContent="Visão geral";
  $("#content").innerHTML=dashboardMarkup;
  renderDashboard();
  loadDashboardTurmas();
 } else {
  const v=views[name]; if(!v)return;
  $("#pageTitle").textContent=v[0];
  $("#content").innerHTML=v[1];
 }
 document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
 if(name==="turmas")renderTurmasReais();
 if(["resultados","competencias","relatorios"].includes(name))renderPedagogicalView(name);
 if(name==="agenda")initAgenda();
 if(name==="professores")initProfessors();
 if(name==="comunicacao")initMail();
 const sidebar=$("#sidebar"); if(sidebar)sidebar.classList.remove("open");
}
$("#navigation").addEventListener("click",e=>{const b=e.target.closest("[data-view]");if(b)showView(b.dataset.view)});
document.addEventListener("click",e=>{const b=e.target.closest("[data-go]");if(b)showView(b.dataset.go)});
$("#mobileMenu").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#fileInput").addEventListener("change",async e=>{
 const f=e.target.files[0];if(!f)return;
 try{
  let rows;
  if(f.name.toLowerCase().endsWith(".csv")){const txt=await f.text();rows=XLSX.utils.sheet_to_json(XLSX.read(txt,{type:"string"}).Sheets[XLSX.read(txt,{type:"string"}).SheetNames[0]],{defval:""});}
  else{const wb=XLSX.read(await f.arrayBuffer(),{type:"array"});rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{defval:""});}
  importedRows=rows;
  const cols=rows.length?Object.keys(rows[0]):[];
  $("#importPreview").innerHTML=`<div class="preview"><b>Arquivo lido: ${f.name}</b><p>${rows.length} registros encontrados · ${cols.length} colunas identificadas.</p><div class="table-wrap"><table><thead><tr>${cols.map(c=>`<th>${c}</th>`).join("")}</tr></thead><tbody>${rows.slice(0,8).map(r=>`<tr>${cols.map(c=>`<td>${String(r[c]??"")}</td>`).join("")}</tr>`).join("")}</tbody></table></div><p class="hint">Pré-visualização local. Ainda não houve gravação no banco de dados.</p></div>`;
  toast("Planilha carregada para pré-visualização.");
 }catch(err){toast("Não foi possível ler a planilha. Verifique o formato.");}
 e.target.value="";
});
$("#today").textContent=new Date().toLocaleDateString("pt-BR",{weekday:"short",day:"2-digit",month:"short",year:"numeric"});
renderDashboard();

// Dados locais de demonstração: serão migrados para o Supabase na integração.
let professors = JSON.parse(localStorage.getItem("saep_professors") || "[]");
let calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let selectedCalendarDate = null;
const defaultMail = {
 subject:"Agendamento de aplicação do Simulado SAEP",
 body:"Prezado(a) professor(a),\n\nInformamos que foi agendada uma aplicação do Simulado SAEP para sua turma.\n\nRecomendações para a aplicação:\n• Verifique previamente o acesso dos estudantes ao ambiente do simulado.\n• Oriente a turma sobre os objetivos e o tempo disponível.\n• Garanta condições adequadas, tranquilidade e organização do ambiente.\n• Registre ausências, intercorrências e dificuldades técnicas.\n• Ao finalizar, confirme a realização da aplicação junto à coordenação.\n\nDados do agendamento:\n{TURMA}\n{CURSO}\n{DATA}\n{PROFESSOR}\n\nAtenciosamente,",
 signature:"Coordenação Pedagógica\nSENAI – {UNIDADE}"
};
function getMail(){try{return {...defaultMail,...JSON.parse(localStorage.getItem("saep_mail_template")||"{}")}}catch(e){return defaultMail}}
function persistProfessors(){localStorage.setItem("saep_professors",JSON.stringify(professors))}
function renderCalendar(){
 const y=calendarMonth.getFullYear(),m=calendarMonth.getMonth();
 $("#monthLabel").textContent=calendarMonth.toLocaleDateString("pt-BR",{month:"long",year:"numeric"});
 const first=new Date(y,m,1),offset=(first.getDay()+6)%7,days=new Date(y,m+1,0).getDate();
 const labels=["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
 let html=labels.map(d=>`<div class="calendar-weekday">${d}</div>`).join("");
 for(let i=0;i<offset;i++)html+=`<div class="calendar-day empty"></div>`;
 for(let d=1;d<=days;d++){
  const date=new Date(y,m,d),key=`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const events=demo.applications.filter(a=>a.data===key);
  const today=new Date();const isToday=date.toDateString()===today.toDateString();
  html+=`<button class="calendar-day ${isToday?"today":""} ${selectedCalendarDate===key?"selected":""}" data-date="${key}"><span>${d}</span><div class="day-dots">${events.map(e=>`<i class="${e.status==="Concluído"?"done-dot":e.status==="Agendado"?"scheduled-dot":"pending-dot"}"></i>`).join("")}</div>${events.length?`<small>${events.length} aplicação(ões)</small>`:""}</button>`;
 }
 $("#calendarGrid").innerHTML=html;
 $("#calendarGrid").querySelectorAll("[data-date]").forEach(b=>b.addEventListener("click",()=>{selectedCalendarDate=b.dataset.date;renderCalendar();renderSelectedDay()}));
 renderSelectedDay();
}
function renderSelectedDay(){
 const target=$("#selectedDay");if(!target)return;
 if(!selectedCalendarDate){target.innerHTML="<h3>Aplicações do dia</h3><p>Selecione uma data no calendário para visualizar os detalhes.</p>";return}
 const events=demo.applications.filter(a=>a.data===selectedCalendarDate);
 target.innerHTML=`<h3>${fmtDate(selectedCalendarDate)} · Aplicações</h3>`+(events.length?events.map(a=>`<div class="event-card"><div><b>${a.turma}</b><small>${a.curso} · Professor: ${a.professor}</small></div><span class="status ${a.status==="Concluído"?"done":a.status==="Agendado"?"scheduled":"pending"}">${a.status}</span></div>`).join(""):"<p>Nenhuma aplicação cadastrada para esta data.</p>");
}
function initAgenda(){
 if(!$("#calendarGrid"))return;
 $("#prevMonth").onclick=()=>{calendarMonth.setMonth(calendarMonth.getMonth()-1);renderCalendar()};
 $("#nextMonth").onclick=()=>{calendarMonth.setMonth(calendarMonth.getMonth()+1);renderCalendar()};
 $("#todayMonth").onclick=()=>{calendarMonth=new Date(new Date().getFullYear(),new Date().getMonth(),1);selectedCalendarDate=null;renderCalendar()};
 $("#newApplication").onclick=()=>{$("#applicationForm").classList.toggle("hidden");$("#appProfessor").innerHTML='<option value="">Selecione</option>'+professors.map(p=>`<option>${p.name}</option>`).join("")};
 $("#cancelApplication").onclick=()=>$("#applicationForm").classList.add("hidden");
 $("#saveApplication").onclick=()=>{
  const turma=$("#appTurma").value.trim(),curso=$("#appCurso").value.trim(),data=$("#appDate").value,professor=$("#appProfessor").value,status=$("#appStatus").value;
  if(!turma||!curso||!data||!professor){toast("Preencha turma, curso, data e professor.");return}
  const p=professors.find(x=>x.name===professor);
  demo.applications.push({turma,curso,data,professor,status,media:0,email:p?.email||""});
  selectedCalendarDate=data;calendarMonth=new Date(data+"T12:00:00");renderCalendar();$("#applicationForm").classList.add("hidden");
  toast(p?.email?"Aplicação cadastrada. O aviso ficará pronto para envio após a integração de e-mail.":"Aplicação cadastrada.");
 };
 renderCalendar();
}
function initProfessors(){
 if(!$("#professorRows"))return;
 $("#professorRows").innerHTML=professors.map(p=>`<tr><td>${p.name}</td><td>${p.email}</td><td><span class="status done">Cadastrado</span></td></tr>`).join("")||'<tr><td colspan="3">Nenhum professor cadastrado nesta demonstração.</td></tr>';
 $("#saveProfessor").onclick=()=>{const name=$("#profName").value.trim(),email=$("#profEmail").value.trim();if(!name||!email||!email.includes("@")){toast("Informe nome e e-mail válido.");return}if(professors.some(p=>p.email.toLowerCase()===email.toLowerCase())){toast("Este e-mail já está cadastrado.");return}professors.push({name,email});persistProfessors();initProfessors();toast("Professor cadastrado nesta demonstração.")};
}
function initMail(){
 if(!$("#emailSubject"))return;const t=getMail();$("#emailSubject").value=t.subject;$("#emailBody").value=t.body;$("#emailSignature").value=t.signature;
 $("#saveEmailTemplate").onclick=()=>{localStorage.setItem("saep_mail_template",JSON.stringify({subject:$("#emailSubject").value,body:$("#emailBody").value,signature:$("#emailSignature").value}));toast("Modelo padrão salvo neste navegador.")};
 $("#previewEmail").onclick=()=>{const sample={TURMA:"Técnico em Manutenção – Turma A",CURSO:"Técnico em Manutenção de Máquinas Industriais",DATA:"16/11/2026",PROFESSOR:"Professor(a) Exemplo",UNIDADE:"Minha unidade SENAI"};const fill=s=>s.replace(/\{([A-Z_]+)\}/g,(_,k)=>sample[k]||`{${k}}`);$("#emailPreview").textContent=`Assunto: ${$("#emailSubject").value}\n\n${fill($("#emailBody").value)}\n${fill($("#emailSignature").value)}`;$("#emailPreview").classList.toggle("hidden")};
}
