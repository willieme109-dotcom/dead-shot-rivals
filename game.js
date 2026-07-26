const scene = new THREE.Scene();
scene.background = new THREE.Color(0x77b6df);
scene.fog = new THREE.Fog(0x77b6df, 35, 120);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 200);
camera.position.set(0, 1.7, 10);
camera.rotation.order = 'YXZ';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xeaf8ff, 0x314a20, 2.2));
const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.position.set(15, 25, 10);
scene.add(sun);

// Step 1: the base plate (a 50 x 50 unit square arena floor).
const basePlate = new THREE.Mesh(
  new THREE.BoxGeometry(50, 0.5, 50),
  new THREE.MeshStandardMaterial({ color: 0x6e7f89, roughness: 0.85 })
);
basePlate.position.y = -0.25;
scene.add(basePlate);

const grid = new THREE.GridHelper(50, 50, 0x9bb1bd, 0x53636d);
grid.position.y = 0.01;
scene.add(grid);

const keys = {};
let locked = false;
let yaw = 0;
let pitch = 0;
let lastTime = performance.now();

addEventListener('keydown', (event) => { keys[event.code] = true; });
addEventListener('keyup', (event) => { keys[event.code] = false; });
addEventListener('mousemove', (event) => {
  if (!locked) return;
  yaw -= event.movementX * 0.0025;
  pitch = THREE.MathUtils.clamp(pitch - event.movementY * 0.0025, -1.45, 1.45);
});

const startScreen = document.querySelector('#start-screen');
const startButton = document.querySelector('#start-button');
const accountStatus = document.querySelector('#account-status');
const accountActions = document.querySelector('#account-actions');
const playerBar = document.querySelector('#player-bar');
const playerNameLabel = document.querySelector('#player-name');
let playerName = localStorage.getItem('dsr-current-player') || '';

function updateAccountDisplay() {
  accountStatus.textContent = 'Log in or create an account to play.';
  startButton.hidden = !playerName;
  startButton.textContent = `Enter Game as ${playerName}`;
  accountActions.classList.toggle('hidden', Boolean(playerName));
  accountStatus.classList.toggle('hidden', Boolean(playerName));
  playerBar.hidden = !playerName;
  playerNameLabel.textContent = playerName;
}

updateAccountDisplay();
startButton.addEventListener('click', () => { location.href = 'lobby.html'; });
document.querySelector('#logout-button').addEventListener('click', () => {
  localStorage.removeItem('dsr-current-player');
  location.reload();
});
document.addEventListener('pointerlockchange', () => {
  locked = document.pointerLockElement === renderer.domElement;
  startScreen.style.display = locked ? 'none' : 'grid';
});

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

function animate(now) {
  requestAnimationFrame(animate);
  const delta = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  camera.rotation.set(pitch, yaw, 0);
  if (locked) {
    const speed = 8 * delta;
    const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
    const right = new THREE.Vector3(forward.z, 0, -forward.x);
    if (keys.KeyW) camera.position.addScaledVector(forward, -speed);
    if (keys.KeyS) camera.position.addScaledVector(forward, speed);
    if (keys.KeyA) camera.position.addScaledVector(right, -speed);
    if (keys.KeyD) camera.position.addScaledVector(right, speed);
  }
  renderer.render(scene, camera);
}
animate(lastTime);
