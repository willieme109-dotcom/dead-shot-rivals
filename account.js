const mode = document.body.dataset.mode;
const form = document.querySelector('#account-form');
const message = document.querySelector('#form-message');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = document.querySelector('#username').value.trim();
  const password = document.querySelector('#password').value;
  const accounts = JSON.parse(localStorage.getItem('dsr-accounts') || '{}');
  const banned = JSON.parse(localStorage.getItem('dsr-banned-accounts') || '[]');

  if (mode === 'signup') {
    if (accounts[username]) {
      message.textContent = 'That username is already taken.';
      return;
    }
    accounts[username] = password;
    localStorage.setItem('dsr-accounts', JSON.stringify(accounts));
  } else if (banned.includes(username)) {
    message.textContent = 'This account has been banned.';
    return;
  } else if (accounts[username] !== password) {
    message.textContent = 'Username or password is incorrect.';
    return;
  }

  localStorage.setItem('dsr-current-player', username);
  location.href = 'index.html';
});
