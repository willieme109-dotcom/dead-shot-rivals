const player = localStorage.getItem('dsr-current-player');
if (!player) location.href = 'index.html';

const welcome = document.querySelector('#welcome-player');
const actions = document.querySelector('#lobby-actions');
const roomView = document.querySelector('#room-view');
const codeLabel = document.querySelector('#active-room-code');
const hostPlayer = document.querySelector('#host-player');
const roomStatus = document.querySelector('#room-status');

welcome.textContent = `Welcome, ${player}. Choose a room to begin.`;
hostPlayer.textContent = player;

function makeRoomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function showRoom(code, isJoining) {
  actions.classList.add('hidden');
  roomView.classList.remove('hidden');
  codeLabel.textContent = code;
  roomStatus.textContent = isJoining ? 'Joining room...' : 'Waiting for another player...';
}

document.querySelector('#create-room').addEventListener('click', () => showRoom(makeRoomCode(), false));
document.querySelector('#join-room-form').addEventListener('submit', (event) => {
  event.preventDefault();
  showRoom(document.querySelector('#room-code').value.trim().toUpperCase(), true);
});
document.querySelector('#leave-room').addEventListener('click', () => {
  roomView.classList.add('hidden');
  actions.classList.remove('hidden');
});
