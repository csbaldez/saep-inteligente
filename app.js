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
 resultados:["Resultados e notas",`<div class="panel"><div class="panel-heading"><div><h3>Importação de resultados</h3><p>Importe uma planilha Excel (.xlsx, .xls) ou CSV com as notas dos simulados.</p></div></div><div class="import-box"><div class="import-symbol">⇧</div><h3>Importar planilha de resultados</h3><p>Selecione um arquivo no seu computador. Nesta versão, os dados são lidos no navegador para validação do formato.</p><button class="primary" onclick="document.getElementById('fileInput').click()">Selecionar planilha</button><p class="hint">Colunas recomendadas: aluno, turma, curso, simulado, competencia, nota, total_questoes, data_aplicacao.</p></div><div id="importPreview"></div></div>`],
 competencias:["Competências",`<div class="panel"><h3>Análise por competência</h3><p class="muted">Após importar os resultados com identificação das competências, será possível visualizar acertos, dificuldades recorrentes e evolução por capacidade técnica.</p></div>`],
 relatorios:["Relatórios",`<div class="panel"><h3>Relatórios gerenciais</h3><p class="muted">Relatórios previstos: síntese institucional, desempenho por turma, evolução individual, mapa de competências e acompanhamento das intervenções pedagógicas.</p></div>`],
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
  if(profile.papel !== 'administrador') query = query.eq('unidade_id', profile.unidade_id);
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
async function renderTurmasReais(){
  const container = document.getElementById('turmasPanel');
  if(!container) return;
  const {client, profile} = saepSession;
  container.innerHTML = '<div class="panel-heading"><div><h3>Turmas e estudantes</h3><p>Consulta de estudantes vinculados às turmas disponíveis no seu perfil.</p></div></div><p class="muted">Carregando turmas e estudantes...</p>';
  try{
    const turmas = await getTurmasDoUsuario();
    if(!document.getElementById('turmasPanel')) return;
    if(!turmas.length){container.innerHTML = '<div class="panel-heading"><div><h3>Turmas e estudantes</h3><p>Nenhuma turma disponível para este perfil.</p></div></div>';return;}
    const canManage = ['administrador','coordenacao'].includes(profile.papel);
    const canCreate = canManage || profile.papel === 'professor';
    container.innerHTML = `<div class="panel-heading"><div><h3>Turmas e estudantes</h3><p>${turmas.length} turma(s) disponível(is) conforme seu perfil.</p></div>${canCreate?'<button class="primary" id="toggleStudentForm">＋ Cadastrar estudante</button>':''}${canManage?'<button class="secondary" id="toggleImportStudents">⇧ Importar Excel</button>':''}</div>
      ${canManage?`<div class="inline-form hidden" id="importStudentsForm"><h3>Importar planilha institucional</h3><p class="hint">Importe as nove colunas: Aluno, Matrícula, CPF, desempenho da última e penúltima avaliação, Status, Convite, Data de entrada e Data prevista de saída. CPF ficará visível somente para Administrador e Coordenação.</p><div class="form-grid"><label>Turma de destino<select id="importStudentClass"><option value="">Selecione a turma</option>${turmas.map(t=>`<option value="${safeText(t.id)}">${safeText(t.nome)}</option>`).join('')}</select></label><label>Arquivo Excel ou CSV<input id="studentImportFile" type="file" accept=".xlsx,.xls,.csv"></label></div><div id="studentImportPreview"></div><div class="form-actions"><button class="primary" id="confirmStudentImport" type="button" disabled>Confirmar importação</button><button class="secondary" id="cancelStudentImport" type="button">Cancelar</button></div><p class="hint">A importação identifica matrículas repetidas na turma e na própria planilha. Nada será gravado antes da confirmação.</p></div>`:''}
      ${canCreate?`<div class="inline-form hidden" id="studentForm"><h3>Novo estudante</h3><div class="form-grid"><label>Turma<select id="studentClass"><option value="">Selecione a turma</option>${turmas.map(t=>`<option value="${safeText(t.id)}">${safeText(t.nome)}</option>`).join('')}</select></label><label>Nome completo<input id="studentName" maxlength="160" autocomplete="off" placeholder="Nome do estudante"></label><label>Matrícula (opcional)<input id="studentEnrollment" maxlength="60" autocomplete="off" placeholder="Número de matrícula"></label></div><div class="form-actions"><button class="primary" id="saveStudent">Salvar estudante</button><button class="secondary" id="cancelStudent">Cancelar</button></div><p class="hint">Confira os dados antes de salvar. O registro será gravado no Supabase.</p></div>`:''}
      <div class="inline-form"><div class="form-grid"><label>Filtrar estudantes por turma<select id="filterStudentClass"><option value="">Todas as turmas</option>${turmas.map(t=>`<option value="${safeText(t.id)}">${safeText(t.nome)}</option>`).join('')}</select></label></div></div>
      <div id="studentsTable" class="table-wrap"><p class="muted">Carregando estudantes...</p></div>
      ${canManage?`<div class="inline-form hidden" id="studentEditForm"><h3>Editar estudante</h3><input type="hidden" id="editStudentId"><div class="form-grid"><label>Nome completo<input id="editStudentName" maxlength="160" autocomplete="off" required></label><label>Matrícula (opcional)<input id="editStudentEnrollment" maxlength="60" autocomplete="off"></label><label>Situação<select id="editStudentStatus"><option value="true">Ativo</option><option value="false">Inativo</option></select></label></div><div class="form-actions"><button class="primary" id="updateStudent" type="button">Salvar alterações</button><button class="secondary" id="cancelEditStudent" type="button">Cancelar</button></div><p class="hint">A edição atualiza nome, matrícula e situação. A turma do estudante não será alterada nesta etapa.</p></div>`:''}`;
    const loadStudents = async () => {
      const target = document.getElementById('studentsTable'); if(!target) return;
      target.innerHTML = '<p class="muted">Consultando estudantes...</p>';
      try{
        const chosen = document.getElementById('filterStudentClass')?.value || '';
        const ids = chosen ? [chosen] : turmas.map(t=>t.id);
        let q = client.from('alunos').select('id,turma_id,matricula,nome,ativo').in('turma_id',ids).order('nome');
        const {data,error} = await q; if(error) throw error;
        const classMap = new Map(turmas.map(t=>[t.id,t.nome]));
        const students = data || [];
        target.innerHTML = students.length ? `<table><thead><tr><th>Estudante</th><th>Matrícula</th><th>Turma</th><th>Situação</th>${canManage?'<th>Ação</th>':''}</tr></thead><tbody>${students.map(a=>`<tr><td>${safeText(a.nome)}</td><td>${safeText(a.matricula || '—')}</td><td>${safeText(classMap.get(a.turma_id) || '—')}</td><td><span class="status ${a.ativo?'done':'pending'}">${a.ativo?'Ativo':'Inativo'}</span></td>${canManage?`<td><button class="secondary" type="button" data-edit-student="${safeText(a.id)}">Editar</button></td>`:''}</tr>`).join('')}</tbody></table><p class="hint">${students.length} estudante(s) encontrado(s).</p>` : '<p class="muted">Nenhum estudante cadastrado para o filtro selecionado.</p>';
        if(canManage){
          target.querySelectorAll('[data-edit-student]').forEach(button=>button.addEventListener('click',()=>{
            const student=students.find(item=>item.id===button.dataset.editStudent);
            if(!student)return;
            const editor=document.getElementById('studentEditForm');
            editor.classList.remove('hidden');
            document.getElementById('editStudentId').value=student.id;
            document.getElementById('editStudentName').value=student.nome || '';
            document.getElementById('editStudentEnrollment').value=student.matricula || '';
            document.getElementById('editStudentStatus').value=student.ativo?'true':'false';
            editor.scrollIntoView({behavior:'smooth',block:'center'});
          }));
        }
      }catch(err){
        console.error('Falha ao consultar estudantes:',err);
        target.innerHTML = `<p class="muted">Não foi possível consultar estudantes. Verifique as políticas de leitura da tabela alunos no Supabase. Detalhe: ${safeText(err.message || 'erro de consulta')}</p>`;
      }
    };
    document.getElementById('filterStudentClass').addEventListener('change',loadStudents);
    if(canManage){
      let importRows=[];
      const panel=document.getElementById('importStudentsForm');
      const preview=document.getElementById('studentImportPreview');
      const confirm=document.getElementById('confirmStudentImport');
      const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
      const findKey=(keys,tests)=>keys.find(k=>tests.some(t=>norm(k)===t || norm(k).includes(t)));
      const clean=v=>String(v??'').trim();
      const dateISO=v=>{
        if(v===null||v===undefined||clean(v)==='')return null;
        if(typeof v==='number' && window.XLSX?.SSF){const d=XLSX.SSF.parse_date_code(v);if(d)return `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`;}
        const x=clean(v);let m=x.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);if(m)return `${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`;
        m=x.match(/^(\d{4})-(\d{2})-(\d{2})/);if(m)return `${m[1]}-${m[2]}-${m[3]}`;
        return null;
      };
      document.getElementById('toggleImportStudents').addEventListener('click',()=>panel.classList.toggle('hidden'));
      document.getElementById('importStudentClass').addEventListener('change',()=>{importRows=[];preview.innerHTML='<p class="hint">Turma alterada. Selecione novamente a planilha.</p>';confirm.disabled=true;document.getElementById('studentImportFile').value='';});
      document.getElementById('cancelStudentImport').addEventListener('click',()=>{panel.classList.add('hidden');importRows=[];preview.innerHTML='';confirm.disabled=true;document.getElementById('studentImportFile').value='';});
      document.getElementById('studentImportFile').addEventListener('change',async ev=>{
        importRows=[];preview.innerHTML='';confirm.disabled=true;
        const file=ev.target.files?.[0];if(!file)return;
        if(!document.getElementById('importStudentClass').value){toast('Selecione a turma de destino.');ev.target.value='';return;}
        try{
          if(!window.XLSX)throw new Error('Biblioteca Excel não carregada. Atualize a página.');
          const wb=file.name.toLowerCase().endsWith('.csv')?XLSX.read(await file.text(),{type:'string'}):XLSX.read(await file.arrayBuffer(),{type:'array',cellDates:false});
          const ws=wb.Sheets[wb.SheetNames[0]];const raw=XLSX.utils.sheet_to_json(ws,{defval:'',raw:false});
          if(!raw.length)throw new Error('A planilha está vazia.');
          const keys=Object.keys(raw[0]);
          const k={nome:findKey(keys,['aluno','nome','estudante']),matricula:findKey(keys,['matricula','ra']),cpf:findKey(keys,['cpf']),ult:findKey(keys,['desempenhoultimaavaliacao','desempeultimaavaliacao','desempenhoultima','desempeultima']),pen:findKey(keys,['desempenhopenultimaavaliacao','desempepenultimaavaliacao','desempenhopenultima','desempepenultima']),status:findKey(keys,['status']),convite:findKey(keys,['convite']),entrada:findKey(keys,['datadeentrada','entrada']),saida:findKey(keys,['dataprevistadesaida','previstadesaida','datasaida'])};
          if(!k.nome||!k.matricula)throw new Error('Não localizei as colunas Aluno e Matrícula. Confira os cabeçalhos da primeira linha.');
          const turmaId=document.getElementById('importStudentClass').value;
          const {data:existing,error}=await client.from('alunos').select('matricula').eq('turma_id',turmaId);if(error)throw error;
          const seen=new Set((existing||[]).map(a=>clean(a.matricula).toLowerCase()).filter(Boolean));
          const inFile=new Set();
          importRows=raw.map((row,i)=>{
            const nome=clean(row[k.nome]),matricula=clean(row[k.matricula]);let motivo='';
            if(!nome)motivo='Aluno sem nome';else if(!matricula)motivo='Matrícula não informada';else if(seen.has(matricula.toLowerCase()))motivo='Matrícula já cadastrada na turma';else if(inFile.has(matricula.toLowerCase()))motivo='Matrícula repetida na planilha';
            if(matricula)inFile.add(matricula.toLowerCase());
            const cpf=clean(k.cpf?row[k.cpf]:'').replace(/\D/g,'');
            const ult=clean(k.ult?row[k.ult]:'').replace(',','.');const pen=clean(k.pen?row[k.pen]:'').replace(',','.');
            const dataEntrada=dateISO(k.entrada?row[k.entrada]:'');const dataSaida=dateISO(k.saida?row[k.saida]:'');
            if(!motivo&&k.cpf&&cpf&&cpf.length!==11)motivo='CPF deve conter 11 dígitos';
            if(!motivo&&k.ult&&clean(row[k.ult])!==''&&!Number.isFinite(Number(ult)))motivo='Desempenho da última avaliação inválido';
            if(!motivo&&k.pen&&clean(row[k.pen])!==''&&!Number.isFinite(Number(pen)))motivo='Desempenho da penúltima avaliação inválido';
            if(!motivo&&k.entrada&&clean(row[k.entrada])!==''&&!dataEntrada)motivo='Data de entrada inválida';
            if(!motivo&&k.saida&&clean(row[k.saida])!==''&&!dataSaida)motivo='Data prevista de saída inválida';
            return {linha:i+2,nome,matricula,cpf:cpf||null,desempenho_ultima_avaliacao:ult===''?null:Number(ult),desempenho_penultima_avaliacao:pen===''?null:Number(pen),status_institucional:clean(k.status?row[k.status]:''),convite:clean(k.convite?row[k.convite]:''),data_entrada:dataEntrada,data_prevista_saida:dataSaida,erro:motivo};
          });
          const ok=importRows.filter(r=>!r.erro).length;
          preview.innerHTML=`<p><b>${raw.length} linha(s) analisada(s).</b> ${ok} pronta(s); ${raw.length-ok} com pendência.</p><div class="table-wrap"><table><thead><tr><th>Linha</th><th>Aluno</th><th>Matrícula</th><th>CPF</th><th>Última</th><th>Penúltima</th><th>Status</th><th>Convite</th><th>Entrada</th><th>Saída prevista</th><th>Validação</th></tr></thead><tbody>${importRows.slice(0,50).map(r=>`<tr><td>${r.linha}</td><td>${safeText(r.nome||'—')}</td><td>${safeText(r.matricula||'—')}</td><td>${safeText(r.cpf||'—')}</td><td>${r.desempenho_ultima_avaliacao??'—'}</td><td>${r.desempenho_penultima_avaliacao??'—'}</td><td>${safeText(r.status_institucional||'—')}</td><td>${safeText(r.convite||'—')}</td><td>${safeText(r.data_entrada||'—')}</td><td>${safeText(r.data_prevista_saida||'—')}</td><td>${r.erro?`<span class="status pending">${safeText(r.erro)}</span>`:'<span class="status done">Pronto</span>'}</td></tr>`).join('')}</tbody></table></div>${importRows.length>50?`<p class="hint">Exibindo 50 de ${importRows.length} linhas; todas foram validadas.</p>`:''}`;
          confirm.disabled=ok===0;
        }catch(err){console.error('Erro ao validar planilha institucional:',err);preview.innerHTML=`<p class="muted">${safeText(err.message||'Não foi possível ler a planilha.')}</p>`;}
      });
      confirm.addEventListener('click',async()=>{
        const turma_id=document.getElementById('importStudentClass').value;const turma=turmas.find(t=>t.id===turma_id);const ready=importRows.filter(r=>!r.erro);
        if(!turma||!turma.unidade_id||!ready.length){toast('Confira a turma e as linhas da planilha.');return;}
        confirm.disabled=true;confirm.textContent='Importando...';
        try{
          let count=0;
          for(const r of ready){
            const {data:aluno,error:insertError}=await client.from('alunos').insert({turma_id,unidade_id:turma.unidade_id,nome:r.nome,matricula:r.matricula,ativo:true}).select('id').single();
            if(insertError)throw insertError;
            const extra={aluno_id:aluno.id,cpf:r.cpf,desempenho_ultima_avaliacao:r.desempenho_ultima_avaliacao,desempenho_penultima_avaliacao:r.desempenho_penultima_avaliacao,status_institucional:r.status_institucional||null,convite:r.convite||null,data_entrada:r.data_entrada,data_prevista_saida:r.data_prevista_saida};
            const {error:extraError}=await client.from('alunos_dados_institucionais').insert(extra);
            if(extraError)throw new Error(`O estudante ${r.nome} foi criado, mas os dados complementares não foram gravados: ${extraError.message}. Verifique a migração SQL antes de repetir a importação.`);
            count++;
          }
          document.getElementById('filterStudentClass').value=turma_id;await loadStudents();panel.classList.add('hidden');importRows=[];preview.innerHTML='';document.getElementById('studentImportFile').value='';toast(`${count} estudante(s) importado(s) com os nove campos.`);
        }catch(err){console.error('Falha na importação:',err);toast(`Importação interrompida: ${err.message||'erro no Supabase'}`);await loadStudents();}
        finally{confirm.textContent='Confirmar importação';confirm.disabled=false;}
      });
    }
    if(canCreate){
      document.getElementById('toggleStudentForm').addEventListener('click',()=>document.getElementById('studentForm').classList.toggle('hidden'));
      document.getElementById('cancelStudent').addEventListener('click',()=>document.getElementById('studentForm').classList.add('hidden'));
      document.getElementById('saveStudent').addEventListener('click',async()=>{
        const turma_id=document.getElementById('studentClass').value;
        const nome=document.getElementById('studentName').value.trim();
        const matricula=document.getElementById('studentEnrollment').value.trim();
        const save=document.getElementById('saveStudent');
        if(!turma_id || !nome){toast('Selecione a turma e informe o nome do estudante.');return;}
        save.disabled=true; save.textContent='Salvando...';
        try{
          // Recupera a unidade da turma já carregada do Supabase.
          // A política RLS coordenacao_alunos valida unidade_id no INSERT.
          const turmaSelecionada = turmas.find(t => t.id === turma_id);
          if(!turmaSelecionada || !turmaSelecionada.unidade_id){
            throw new Error('Não foi possível identificar a unidade vinculada à turma selecionada.');
          }
          const payload={
            turma_id,
            unidade_id:turmaSelecionada.unidade_id,
            nome,
            matricula:matricula || null,
            ativo:true
          };
          const {error}=await client.from('alunos').insert(payload);
          if(error) throw error;
          document.getElementById('studentName').value='';
          document.getElementById('studentEnrollment').value='';
          document.getElementById('studentForm').classList.add('hidden');
          document.getElementById('filterStudentClass').value=turma_id;
          await loadStudents();
          toast('Estudante cadastrado no Supabase.');
        }catch(err){
          console.error('Falha ao cadastrar estudante:',err);
          toast('Não foi possível cadastrar. Verifique as permissões de gravação da tabela alunos.');
          const msg=document.getElementById('studentsTable');
          if(msg) msg.insertAdjacentHTML('afterbegin',`<p class="muted">Detalhe: ${safeText(err.message || 'erro de gravação')}</p>`);
        }finally{save.disabled=false;save.textContent='Salvar estudante';}
      });
    }
    if(canManage){
      document.getElementById('cancelEditStudent').addEventListener('click',()=>document.getElementById('studentEditForm').classList.add('hidden'));
      document.getElementById('updateStudent').addEventListener('click',async()=>{
        const id=document.getElementById('editStudentId').value;
        const nome=document.getElementById('editStudentName').value.trim();
        const matricula=document.getElementById('editStudentEnrollment').value.trim();
        const ativo=document.getElementById('editStudentStatus').value==='true';
        const button=document.getElementById('updateStudent');
        if(!nome){toast('Informe o nome do estudante.');return;}
        button.disabled=true;button.textContent='Salvando...';
        try{
          const {error}=await client.from('alunos').update({nome,matricula:matricula||null,ativo}).eq('id',id);
          if(error)throw error;
          document.getElementById('studentEditForm').classList.add('hidden');
          await loadStudents();
          toast('Dados do estudante atualizados no Supabase.');
        }catch(err){
          console.error('Falha ao editar estudante:',err);
          toast('Não foi possível atualizar. Verifique as permissões RLS da tabela alunos.');
          const target=document.getElementById('studentsTable');
          if(target)target.insertAdjacentHTML('afterbegin',`<p class="muted">Detalhe: ${safeText(err.message||'erro de atualização')}</p>`);
        }finally{button.disabled=false;button.textContent='Salvar alterações';}
      });
    }
    await loadStudents();
  }catch(err){
    console.error('Falha ao consultar turmas:',err);
    if(document.getElementById('turmasPanel')) container.innerHTML = `<div class="panel-heading"><div><h3>Turmas e estudantes</h3></div></div><p class="muted">Erro ao consultar as turmas: ${safeText(err.message || 'falha de acesso')}</p>`;
  }
}
function showView(name){
 currentView = name;
 const modePill=document.getElementById('dataModePill');
 if(modePill){
  modePill.textContent=name==='turmas'?'DADOS DO SUPABASE':'DADOS DEMONSTRATIVOS';
  modePill.title=name==='turmas'?'Esta tela consulta os dados reais da tabela alunos no Supabase.':'Esta área ainda utiliza dados demonstrativos ou funcionalidades em validação.';
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
