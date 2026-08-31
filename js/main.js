/* ===========================
   Navigation: mobile toggle + active link
   =========================== */
(function () {
  const toggle = document.querySelector('.navbar__toggle');
  const links = document.querySelector('.navbar__links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
  }

  // Mark active link
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === current) a.classList.add('active');
  });
})();

/* ===========================
   Diary entries
   =========================== */
(function () {
  const form = document.getElementById('diary-form');
  if (!form) return;

  const database = window.diaryDatabase;
  const accountEmail = window.diaryAccountEmail;
  const loginForm = document.getElementById('diary-login-form');
  const loginPassword = document.getElementById('diary-login-password');
  const signedOutPanel = document.getElementById('diary-signed-out');
  const signedInPanel = document.getElementById('diary-signed-in');
  const logoutButton = document.getElementById('diary-logout-btn');
  const changePasswordToggle = document.getElementById('diary-change-password-toggle');
  const changePasswordForm = document.getElementById('diary-change-password-form');
  const changePasswordCancel = document.getElementById('diary-change-password-cancel');
  const currentPassword = document.getElementById('diary-current-password');
  const newPassword = document.getElementById('diary-new-password');
  const confirmPassword = document.getElementById('diary-confirm-password');
  const authMessage = document.getElementById('diary-auth-message');
  const idInput = document.getElementById('diary-entry-id');
  const dateInput = document.getElementById('diary-date');
  const emojiInput = document.getElementById('diary-emoji');
  const titleInput = document.getElementById('diary-title');
  const bodyInput = document.getElementById('diary-body');
  const formTitle = document.getElementById('diary-form-title');
  const saveButton = document.getElementById('diary-save-btn');
  const cancelButton = document.getElementById('diary-cancel-btn');
  const message = document.getElementById('diary-message');
  const list = document.getElementById('diary-list');
  const emptyState = document.getElementById('diary-empty');

  let entries = [];
  let isAuthorized = false;
  resetForm();

  if (!database || !accountEmail) {
    showMessage('Kunne ikke koble til databasen. Last inn siden på nytt.', true);
    setFormDisabled(true);
    return;
  }

  initialize();

  loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    setAuthFormDisabled(loginForm, true);
    showAuthMessage('Logger inn …');

    const { error } = await database.auth.signInWithPassword({
      email: accountEmail,
      password: loginPassword.value
    });

    loginPassword.value = '';
    setAuthFormDisabled(loginForm, false);

    if (error) {
      console.error('Supabase login error:', error);
      showAuthMessage('Feil passord. Prøv igjen.', true);
      return;
    }

    setAuthorized(true);
    showAuthMessage('Dagboken er låst opp.');
  });

  logoutButton.addEventListener('click', async () => {
    const { error } = await database.auth.signOut({ scope: 'local' });
    if (error) {
      console.error('Supabase logout error:', error);
      showAuthMessage('Kunne ikke låse dagboken. Prøv igjen.', true);
      return;
    }

    setAuthorized(false);
    showAuthMessage('Dagboken er låst.');
  });

  changePasswordToggle.addEventListener('click', () => {
    changePasswordForm.hidden = !changePasswordForm.hidden;
    if (!changePasswordForm.hidden) currentPassword.focus();
  });

  changePasswordCancel.addEventListener('click', closeChangePasswordForm);

  changePasswordForm.addEventListener('submit', async event => {
    event.preventDefault();

    if (newPassword.value !== confirmPassword.value) {
      showAuthMessage('De nye passordene er ikke like.', true);
      return;
    }

    if (currentPassword.value === newPassword.value) {
      showAuthMessage('Det nye passordet må være forskjellig fra det nåværende.', true);
      return;
    }

    setAuthFormDisabled(changePasswordForm, true);
    showAuthMessage('Kontrollerer nåværende passord …');

    const { error: verificationError } = await database.auth.signInWithPassword({
      email: accountEmail,
      password: currentPassword.value
    });

    if (verificationError) {
      console.error('Supabase password verification error:', verificationError);
      showAuthMessage('Nåværende passord er feil.', true);
      setAuthFormDisabled(changePasswordForm, false);
      return;
    }

    const { error: updateError } = await database.auth.updateUser({
      password: newPassword.value
    });

    if (updateError) {
      console.error('Supabase password update error:', updateError);
      showAuthMessage(`Passordet kunne ikke endres: ${updateError.message}`, true);
      setAuthFormDisabled(changePasswordForm, false);
      return;
    }

    closeChangePasswordForm();
    await database.auth.signOut({ scope: 'global' });
    setAuthorized(false);
    showAuthMessage('Passordet er endret. Logg inn med det nye passordet.');
  });

  database.auth.onAuthStateChange((_event, session) => {
    setAuthorized(Boolean(session));
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!isAuthorized) {
      showAuthMessage('Lås opp dagboken før du lagrer et innlegg.', true);
      return;
    }

    const entry = {
      entry_date: dateInput.value,
      emoji: emojiInput.value.trim() || '📝',
      title: titleInput.value.trim(),
      body: bodyInput.value.trim(),
      updated_at: new Date().toISOString()
    };

    if (!entry.entry_date || !entry.title || !entry.body) return;

    const entryId = idInput.value;
    setFormDisabled(true);
    showMessage(entryId ? 'Oppdaterer innlegget …' : 'Lagrer innlegget …');

    const query = entryId
      ? database.from('diary_entries').update(entry).eq('id', entryId)
      : database.from('diary_entries').insert(entry);

    const { error } = await query;
    if (error) {
      console.error('Supabase save error:', error);
      showMessage('Innlegget kunne ikke lagres. Prøv igjen.', true);
      setFormDisabled(false);
      return;
    }

    resetForm();
    const refreshed = await loadEntries();
    if (refreshed) {
      showMessage(entryId ? 'Innlegget ble oppdatert.' : 'Innlegget ble lagret.');
    }
    setFormDisabled(false);
  });

  cancelButton.addEventListener('click', () => {
    resetForm();
    showMessage('Redigeringen ble avbrutt.');
  });

  list.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const entry = entries.find(item => item.id === button.dataset.id);
    if (!entry) return;

    if (button.dataset.action === 'edit') {
      startEditing(entry);
    }

    if (button.dataset.action === 'delete') {
      deleteEntry(entry);
    }
  });

  async function loadEntries() {
    emptyState.hidden = true;
    showMessage('Henter dagbokinnlegg …');

    const { data, error } = await database
      .from('diary_entries')
      .select('id, entry_date, emoji, title, body, created_at, updated_at')
      .order('entry_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase load error:', error);
      showMessage('Dagbokinnleggene kunne ikke hentes. Kontroller Supabase-oppsettet.', true);
      return false;
    }

    entries = data.map(row => ({
      id: row.id,
      date: row.entry_date,
      emoji: row.emoji,
      title: row.title,
      body: row.body,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    renderEntries();
    showMessage('');
    return true;
  }

  function renderEntries() {
    list.replaceChildren();
    entries.forEach(entry => list.append(createEntryElement(entry)));
    emptyState.hidden = entries.length > 0;
  }

  function createEntryElement(entry) {
    const article = document.createElement('article');
    article.className = 'diary-entry';

    const header = document.createElement('div');
    header.className = 'diary-entry__header';

    const emoji = document.createElement('span');
    emoji.className = 'diary-entry__emoji';
    emoji.textContent = entry.emoji;

    const date = document.createElement('time');
    date.className = 'diary-entry__date';
    date.dateTime = entry.date;
    date.textContent = formatDate(entry.date);

    const title = document.createElement('h3');
    title.className = 'diary-entry__title';
    title.textContent = entry.title;

    const body = document.createElement('p');
    body.className = 'diary-entry__body';
    body.textContent = entry.body;

    header.append(emoji, date);
    if (isAuthorized) {
      const actions = document.createElement('div');
      actions.className = 'diary-entry__actions';
      actions.append(
        createActionButton('Rediger', 'edit', entry.id),
        createActionButton('Slett', 'delete', entry.id)
      );
      header.append(actions);
    }
    article.append(header, title, body);
    return article;
  }

  function createActionButton(label, action, id) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `diary-entry__action diary-entry__action--${action}`;
    button.dataset.action = action;
    button.dataset.id = id;
    button.textContent = label;
    button.setAttribute('aria-label', `${label} dagbokinnlegg`);
    return button;
  }

  function startEditing(entry) {
    if (!isAuthorized) return;
    idInput.value = entry.id;
    dateInput.value = entry.date;
    emojiInput.value = entry.emoji;
    titleInput.value = entry.title;
    bodyInput.value = entry.body;
    formTitle.textContent = 'Rediger dagbokinnlegg';
    saveButton.textContent = 'Oppdater innlegg';
    cancelButton.hidden = false;
    message.textContent = '';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    titleInput.focus({ preventScroll: true });
  }

  async function deleteEntry(entry) {
    if (!isAuthorized) return;
    if (!window.confirm(`Vil du slette «${entry.title}»?`)) return;

    showMessage('Sletter innlegget …');
    const { error } = await database
      .from('diary_entries')
      .delete()
      .eq('id', entry.id);

    if (error) {
      console.error('Supabase delete error:', error);
      showMessage('Innlegget kunne ikke slettes. Prøv igjen.', true);
      return;
    }

    if (idInput.value === entry.id) resetForm();
    const refreshed = await loadEntries();
    if (refreshed) showMessage('Innlegget ble slettet.');
  }

  function resetForm() {
    form.reset();
    idInput.value = '';
    dateInput.value = getToday();
    emojiInput.value = '📝';
    formTitle.textContent = 'Nytt dagbokinnlegg';
    saveButton.textContent = 'Lagre innlegg';
    cancelButton.hidden = true;
  }

  function showMessage(text, isError = false) {
    message.textContent = text;
    message.classList.toggle('diary-message--error', isError);
  }

  function setFormDisabled(disabled) {
    Array.from(form.elements).forEach(element => {
      element.disabled = disabled;
    });
  }

  async function initialize() {
    const { data, error } = await database.auth.getSession();
    if (error) console.error('Supabase session error:', error);
    setAuthorized(Boolean(data.session));
    await loadEntries();
  }

  function setAuthorized(authorized) {
    isAuthorized = authorized;
    signedOutPanel.hidden = authorized;
    signedInPanel.hidden = !authorized;
    form.hidden = !authorized;

    if (!authorized) {
      resetForm();
      closeChangePasswordForm();
    }

    renderEntries();
  }

  function closeChangePasswordForm() {
    changePasswordForm.reset();
    changePasswordForm.hidden = true;
    setAuthFormDisabled(changePasswordForm, false);
  }

  function showAuthMessage(text, isError = false) {
    authMessage.textContent = text;
    authMessage.classList.toggle('diary-message--error', isError);
  }

  function setAuthFormDisabled(authForm, disabled) {
    Array.from(authForm.elements).forEach(element => {
      element.disabled = disabled;
    });
  }

  function formatDate(dateString) {
    const date = new Date(`${dateString}T00:00:00`);
    return new Intl.DateTimeFormat('nb-NO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }

  function getToday() {
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 10);
  }

})();
