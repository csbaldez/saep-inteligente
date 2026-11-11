// Autenticação inicial do SAEP Inteligente. Nesta etapa, somente login e leitura do próprio perfil são conectados.
(() => {
  const cfg = window.SAEP_SUPABASE_CONFIG;
  const loginScreen = document.getElementById('loginScreen');
  const appShell = document.getElementById('appShell');
  const form = document.getElementById('loginForm');
  const message = document.getElementById('loginMessage');
  const button = document.getElementById('loginButton');
  let client = null;
  let loadingProfile = false;

  const roleNames = {
    administrador: 'Administrador',
    coordenacao: 'Coordenação',
    professor: 'Professor'
  };
  const allowedViews = {
    administrador: ['dashboard','agenda','professores','comunicacao','turmas','resultados','competencias','relatorios','usuarios','configuracoes'],
    coordenacao: ['dashboard','agenda','professores','comunicacao','turmas','resultados','competencias','relatorios'],
    professor: ['dashboard','agenda','turmas','resultados']
  };

  function showLogin(text='') {
    loginScreen.classList.remove('hidden');
    appShell.classList.add('hidden');
    message.textContent = text;
    message.className = 'login-message';
    button.disabled = false;
    button.textContent = 'Entrar';
  }

  function showApp(profile) {
    loginScreen.classList.add('hidden');
    appShell.classList.remove('hidden');
    const name = profile.nome || 'Usuário';
    const role = profile.papel;
    document.getElementById('userName').textContent = name;
    document.getElementById('userRole').textContent = roleNames[role] || role;
    document.getElementById('userAvatar').textContent = name.split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase();
    const allowed = allowedViews[role] || [];
    document.querySelectorAll('#navigation [data-view]').forEach(el => {
      el.classList.toggle('hidden', !allowed.includes(el.dataset.view));
    });
    document.querySelectorAll('#navigation .nav-separator').forEach(el => el.classList.toggle('hidden', role !== 'administrador'));
    const unit = document.querySelector('.unit-name');
    if (unit) unit.textContent = 'SENAI - Ubá';
    const notice = document.querySelector('.notice');
    if (notice) notice.innerHTML = '<strong>Ambiente de validação:</strong> autenticação real ativa. Os painéis e indicadores ainda contêm dados demonstrativos; importação, agenda e gravações ainda não estão conectadas às tabelas institucionais.';
  }

  async function loadProfile(user) {
    if (loadingProfile) return;
    loadingProfile = true;
    try {
      const { data, error } = await client.from('perfis')
        .select('id,nome,email,papel,unidade_id,ativo')
        .eq('id', user.id).maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Sua conta existe, mas não há perfil cadastrado. Solicite à administração a regularização do acesso.');
      if (!data.ativo) throw new Error('Seu perfil está inativo. Procure a administração da unidade.');
      if (!allowedViews[data.papel]) throw new Error('O papel deste usuário não está reconhecido pelo sistema.');
      showApp(data);
      window.dispatchEvent(new CustomEvent('saep:profile-ready', { detail: { client, profile: data } }));
    } catch (err) {
      await client.auth.signOut();
      showLogin('Não foi possível carregar seu perfil: ' + (err.message || 'erro inesperado'));
    } finally {
      loadingProfile = false;
    }
  }

  async function start() {
    if (!window.supabase || !cfg?.url || !cfg?.publishableKey) {
      showLogin('Não foi possível inicializar a conexão com o Supabase. Confira os arquivos de configuração.');
      return;
    }
    client = window.supabase.createClient(cfg.url, cfg.publishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    const { data: { session } } = await client.auth.getSession();
    if (session?.user) await loadProfile(session.user);
    else showLogin();
    client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) showLogin();
      else if (event === 'SIGNED_IN') loadProfile(session.user);
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!client) return showLogin('Conexão com o Supabase ainda não inicializada.');
    button.disabled = true;
    button.textContent = 'Verificando...';
    message.textContent = '';
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      message.textContent = 'Não foi possível entrar. Verifique o e-mail e a senha.';
      button.disabled = false;
      button.textContent = 'Entrar';
      return;
    }
    if (data.user) await loadProfile(data.user);
  });

  document.getElementById('logoutButton').addEventListener('click', async () => {
    const { error } = await client.auth.signOut();
    if (error) toast('Não foi possível encerrar a sessão. Tente novamente.');
  });

  start().catch(() => showLogin('Falha ao iniciar a autenticação. Atualize a página e tente novamente.'));
})();
