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
  resetForm();

  if (!database) {
    showMessage('Kunne ikke koble til databasen. Last inn siden på nytt.', true);
    setFormDisabled(true);
    return;
  }

  loadEntries();

  form.addEventListener('submit', async event => {
    event.preventDefault();

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

    const actions = document.createElement('div');
    actions.className = 'diary-entry__actions';
    actions.append(
      createActionButton('Rediger', 'edit', entry.id),
      createActionButton('Slett', 'delete', entry.id)
    );

    const title = document.createElement('h3');
    title.className = 'diary-entry__title';
    title.textContent = entry.title;

    const body = document.createElement('p');
    body.className = 'diary-entry__body';
    body.textContent = entry.body;

    header.append(emoji, date, actions);
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
