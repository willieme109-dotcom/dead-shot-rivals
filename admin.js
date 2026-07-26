// Change this before sharing the game with anyone.
const ADMIN_ACCESS_CODE = 'willie';
const loginScreen = document.querySelector('#admin-login');
const panel = document.querySelector('#admin-panel');
const playerList = document.querySelector('#player-list');
const adminMessage = document.querySelector('#admin-message');

function getAccounts() {
  return JSON.parse(localStorage.getItem('dsr-accounts') || '{}');
}

function getBanned() {
  return JSON.parse(localStorage.getItem('dsr-banned-accounts') || '[]');
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));
}

function renderPlayers() {
  const accounts = getAccounts();
  const banned = getBanned();
  const names = Object.keys(accounts).sort((a, b) => a.localeCompare(b));
  if (!names.length) {
    playerList.innerHTML = '<p>No player accounts have been created yet.</p>';
    return;
  }
  playerList.innerHTML = names.map((name) => {
    const safeName = escapeHtml(name);
    return `
    <div class="player-row">
      <p><strong>${safeName}</strong><br><small>${banned.includes(name) ? 'Banned' : 'Active'}</small></p>
      <div class="player-actions">
        <button data-action="ban" data-name="${safeName}">${banned.includes(name) ? 'Unban' : 'Ban'}</button>
        <button class="danger-button" data-action="delete" data-name="${safeName}">Delete</button>
      </div>
    </div>`;
  }).join('');
}

document.querySelector('#admin-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (document.querySelector('#admin-code').value !== ADMIN_ACCESS_CODE) {
    adminMessage.textContent = 'That access code is incorrect.';
    return;
  }
  loginScreen.classList.add('hidden');
  panel.classList.remove('hidden');
  renderPlayers();
});

playerList.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const name = button.dataset.name;
  if (button.dataset.action === 'ban') {
    const banned = getBanned();
    const updated = banned.includes(name) ? banned.filter((player) => player !== name) : [...banned, name];
    localStorage.setItem('dsr-banned-accounts', JSON.stringify(updated));
  } else if (confirm(`Delete ${name}'s account? This cannot be undone.`)) {
    const accounts = getAccounts();
    delete accounts[name];
    localStorage.setItem('dsr-accounts', JSON.stringify(accounts));
    localStorage.setItem('dsr-banned-accounts', JSON.stringify(getBanned().filter((player) => player !== name)));
    if (localStorage.getItem('dsr-current-player') === name) localStorage.removeItem('dsr-current-player');
  }
  renderPlayers();
});
