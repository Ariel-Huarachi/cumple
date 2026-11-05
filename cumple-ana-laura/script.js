/* =========================================================
   Feliz Cumpleaños Ana Laura 💖  —  animaciones
   ========================================================= */

/* ---------- Mensajes (puedes editarlos aquí) ---------- */
const MENSAJE_1 =
  "Hoy celebramos el día en que llegó al mundo una de las personas más bonitas que conozco. " +
  "Gracias por tu risa que contagia, por tu corazón enorme y por cada momento que hemos compartido.\n\n" +
  "Que este nuevo año de vida te llene de salud, de abrazos sinceros y de muchísima felicidad. " +
  "¡Te quiero muchísimo! 💖";

const MENSAJE_2 =
  "Quiero que sepas que este nuevo año es tuyo. Sigue adelante con esa fuerza que te caracteriza, " +
  "incluso cuando el camino se ponga difícil.\n\n" +
  "Cumple cada uno de tus sueños, porque tienes todo para lograrlo. " +
  "Y sobre todo, nunca dejes de creer en ti: eres más valiente, más capaz y más especial de lo que imaginas.\n\n" +
  "Yo siempre voy a estar aquí, aplaudiéndote en cada paso. 🌟";

const $ = (s) => document.querySelector(s);
const DPR = Math.min(window.devicePixelRatio || 1, 2);

/* =========================================================
   1. Fondo: estrellas + corazones flotando
   ========================================================= */
const bg = $('#bg');
const bctx = bg.getContext('2d');
let stars = [], floaters = [];

function resizeBg() {
  bg.width = innerWidth * DPR;
  bg.height = innerHeight * DPR;
  bctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const n = Math.floor((innerWidth * innerHeight) / 5000);
  stars = Array.from({ length: n }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.4 + 0.3,
    p: Math.random() * Math.PI * 2,
    s: Math.random() * 0.03 + 0.01,
  }));
}

function newFloater(startBottom = true) {
  return {
    x: Math.random() * innerWidth,
    y: startBottom ? innerHeight + 30 : Math.random() * innerHeight,
    size: Math.random() * 14 + 8,
    speed: Math.random() * 0.6 + 0.3,
    drift: Math.random() * 2 * Math.PI,
    hue: 330 + Math.random() * 30,
    alpha: Math.random() * 0.4 + 0.25,
  };
}

function drawHeartShape(ctx, x, y, size) {
  const s = size / 16;
  ctx.beginPath();
  ctx.moveTo(x, y + 4 * s);
  ctx.bezierCurveTo(x, y, x - 8 * s, y - 2 * s, x - 8 * s, y + 4 * s);
  ctx.bezierCurveTo(x - 8 * s, y + 9 * s, x - 2 * s, y + 12 * s, x, y + 15 * s);
  ctx.bezierCurveTo(x + 2 * s, y + 12 * s, x + 8 * s, y + 9 * s, x + 8 * s, y + 4 * s);
  ctx.bezierCurveTo(x + 8 * s, y - 2 * s, x, y, x, y + 4 * s);
  ctx.fill();
}

function animateBg(t) {
  bctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const s of stars) {
    s.p += s.s;
    bctx.globalAlpha = 0.35 + Math.sin(s.p) * 0.35;
    bctx.fillStyle = '#fff';
    bctx.beginPath();
    bctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    bctx.fill();
  }
  for (const f of floaters) {
    f.y -= f.speed;
    f.drift += 0.01;
    const x = f.x + Math.sin(f.drift) * 20;
    bctx.globalAlpha = f.alpha;
    bctx.fillStyle = `hsl(${f.hue}, 90%, 65%)`;
    drawHeartShape(bctx, x, f.y, f.size);
    if (f.y < -40) Object.assign(f, newFloater());
  }
  bctx.globalAlpha = 1;
  requestAnimationFrame(animateBg);
}

resizeBg();
floaters = Array.from({ length: innerWidth < 640 ? 14 : 26 }, () => newFloater(false));
addEventListener('resize', resizeBg);
requestAnimationFrame(animateBg);

/* =========================================================
   2. Corazón 3D de partículas (gira y late)
   ========================================================= */
const hc = $('#heart3d');
const hctx = hc.getContext('2d');
let hw = 0, hh = 0;
const points = [];
const NUM = innerWidth < 640 ? 1800 : 3000;

for (let i = 0; i < NUM; i++) {
  const t = Math.random() * Math.PI * 2;
  const z = Math.random() * 2 - 1;               // profundidad
  const surface = Math.random() < 0.8;           // 80% en la superficie
  const k = Math.sqrt(1 - z * z) * (surface ? 1 : Math.random());
  points.push({
    x: 16 * Math.pow(Math.sin(t), 3) * k,
    y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * k,
    z: z * 7,
    tw: Math.random() * Math.PI * 2,
  });
}

function resizeHeart() {
  const r = hc.getBoundingClientRect();
  hw = r.width; hh = r.height;
  hc.width = hw * DPR; hc.height = hh * DPR;
  hctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
resizeHeart();
addEventListener('resize', resizeHeart);

let rotY = 0, tiltX = 0, targetTilt = 0, extraSpin = 0, spinOffset = 0;
addEventListener('pointermove', (e) => {
  targetTilt = (e.clientY / innerHeight - 0.5) * 0.6;
});

function animateHeart(time) {
  const t = time / 1000;
  hctx.clearRect(0, 0, hw, hh);
  hctx.globalCompositeOperation = 'lighter';

  // se balancea suave; al tocarlo da una vuelta completa y vuelve
  extraSpin *= 0.95;
  spinOffset += extraSpin;
  if (extraSpin < 0.01) {
    const target = Math.round(spinOffset / (Math.PI * 2)) * Math.PI * 2;
    spinOffset += (target - spinOffset) * 0.04;
  }
  rotY = Math.sin(t * 0.7) * 0.75 + spinOffset;
  tiltX += (targetTilt - tiltX) * 0.05;

  // latido doble: pum-pum
  const ph = (t * 1.1) % 1;
  const beat = 1 + 0.09 * Math.exp(-Math.pow((ph - 0.1) * 14, 2)) + 0.06 * Math.exp(-Math.pow((ph - 0.32) * 14, 2));
  const scale = (Math.min(hw, hh) / 40) * beat;

  const cy = Math.cos(rotY), sy = Math.sin(rotY);
  const cx = Math.cos(tiltX), sx = Math.sin(tiltX);
  const fov = 60;

  for (const p of points) {
    let x = p.x * cy - p.z * sy;
    let z = p.x * sy + p.z * cy;
    let y = p.y * cx - z * sx;
    z = p.y * sx + z * cx;

    const persp = fov / (fov + z);
    const px = hw / 2 + x * scale * persp;
    const py = hh / 2 + (y + 1.5) * scale * persp;
    const depth = (z + 16) / 32;                  // 0 cerca, 1 lejos
    const twinkle = 0.6 + 0.4 * Math.sin(t * 3 + p.tw);
    const size = (1.9 - depth) * persp * 1.3;

    hctx.fillStyle = `hsla(${335 + depth * 25}, 95%, ${62 - depth * 18}%, ${(0.85 - depth * 0.5) * twinkle})`;
    hctx.fillRect(px, py, size, size);
  }

  // brillo central
  hctx.globalCompositeOperation = 'source-over';
  const g = hctx.createRadialGradient(hw / 2, hh / 2, 0, hw / 2, hh / 2, hw * 0.45);
  g.addColorStop(0, `rgba(255, 92, 147, ${0.18 * beat})`);
  g.addColorStop(1, 'rgba(255, 92, 147, 0)');
  hctx.fillStyle = g;
  hctx.fillRect(0, 0, hw, hh);

  requestAnimationFrame(animateHeart);
}
requestAnimationFrame(animateHeart);

// tocar el corazón (funciona con mouse y con el dedo en el celular)
document.querySelector('.heart-wrap').addEventListener('pointerdown', (e) => {
  extraSpin = 0.32;
  burst(e.clientX, e.clientY, 22);
  if (navigator.vibrate) navigator.vibrate(30);
});

// botón "Ver mi mensaje para ti"
$('#goMsg').addEventListener('click', () => {
  $('#mensaje').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* =========================================================
   3. Explosión de corazones (DOM)
   ========================================================= */
const EMOJIS = ['💖', '💕', '💗', '💓', '🌸', '✨', '💝'];
function burst(x = innerWidth / 2, y = innerHeight / 2, n = 30) {
  for (let i = 0; i < n; i++) {
    const el = document.createElement('span');
    el.className = 'pop-heart';
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const ang = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 220;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.fontSize = 14 + Math.random() * 22 + 'px';
    el.style.setProperty('--x', Math.cos(ang) * dist + 'px');
    el.style.setProperty('--y', Math.sin(ang) * dist - 60 + 'px');
    el.style.setProperty('--r', (Math.random() * 120 - 60) + 'deg');
    el.style.setProperty('--d', 1.2 + Math.random() * 1 + 's');
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2400);
  }
}

$('#hugBtn').addEventListener('click', (e) => {
  burst(e.clientX, e.clientY, 40);
  for (let i = 0; i < 5; i++) {
    setTimeout(() => burst(Math.random() * innerWidth, Math.random() * innerHeight * 0.8, 14), 200 + i * 250);
  }
});

/* =========================================================
   4. Texto que se escribe solo
   ========================================================= */
function typeWriter(el, text, speed = 38) {
  return new Promise((resolve) => {
    const chars = Array.from(text);              // respeta emojis
    let i = 0;
    el.textContent = '';
    (function step() {
      if (i < chars.length) {
        el.textContent += chars[i];
        const c = chars[i++];
        setTimeout(step, c === '.' || c === ',' ? speed * 6 : c === '\n' ? speed * 8 : speed);
      } else {
        el.classList.add('done');
        resolve();
      }
    })();
  });
}

/* =========================================================
   5. Animar al aparecer en pantalla (flor, mensajes, deseos)
   ========================================================= */
document.querySelectorAll('.card, .wish, .section-title, .final').forEach((el) => el.classList.add('reveal'));

const started = new WeakSet();
const io = new IntersectionObserver((entries) => {
  for (const en of entries) {
    if (!en.isIntersecting || !document.body.classList.contains('started')) continue;
    const el = en.target;
    el.classList.add('visible');
    if (started.has(el)) continue;
    started.add(el);

    if (el.id === 'flower') el.classList.add('grow');
    const typed = el.querySelector && el.querySelector('.typed');
    if (typed) {
      const text = typed.id === 'typed' ? MENSAJE_1 : MENSAJE_2;
      setTimeout(() => typeWriter(typed, text).then(() => el.querySelector('.signature').classList.add('show')), 500);
    }
  }
}, { threshold: 0.35 });

function observeAll() {
  io.observe($('#flower'));
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
}

/* =========================================================
   6. Música de fondo
   - Si existe "musica.mp3" en la carpeta, suena esa canción.
   - Si no, suena una cajita musical de "Feliz Cumpleaños".
   ========================================================= */
const audio = $('#music');
const musicBtn = $('#musicBtn');
let usingMp3 = true;
let playing = false;

audio.addEventListener('error', () => { usingMp3 = false; });

// --- Cajita musical (Web Audio) ---
let actx = null, boxTimer = null;
const N = { G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 };
const MELODY = [
  ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
  ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
  ['G4', .75], ['G4', .25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 2],
  ['F5', .75], ['F5', .25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 3],
];
const BEAT = 0.42;

function bell(freq, when, dur) {
  [1, 2, 3].forEach((h, idx) => {
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.type = 'sine';
    o.frequency.value = freq * h;
    const vol = [0.16, 0.05, 0.02][idx];
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(vol, when + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur * 1.8 + 0.4);
    o.connect(g).connect(actx.destination);
    o.start(when);
    o.stop(when + dur * 1.8 + 0.5);
  });
}

function playMusicBox() {
  actx = actx || new (window.AudioContext || window.webkitAudioContext)();
  actx.resume();
  let when = actx.currentTime + 0.1;
  let total = 0;
  for (const [n, b] of MELODY) {
    bell(N[n], when, b * BEAT);
    when += b * BEAT;
    total += b * BEAT;
  }
  boxTimer = setTimeout(playMusicBox, (total + 1.5) * 1000);   // repetir
}

function stopMusicBox() {
  clearTimeout(boxTimer);
  if (actx) actx.suspend();
}

async function startMusic() {
  if (usingMp3) {
    try {
      audio.volume = 0.6;
      await audio.play();
    } catch {
      usingMp3 = false;
    }
  }
  if (!usingMp3) {
    if (actx && actx.state === 'suspended' && boxTimer) actx.resume();
    else playMusicBox();
  }
  playing = true;
  musicBtn.classList.add('playing');
}

function stopMusic() {
  if (usingMp3) audio.pause(); else stopMusicBox();
  playing = false;
  musicBtn.classList.remove('playing');
}

musicBtn.addEventListener('click', () => (playing ? stopMusic() : startMusic()));

/* =========================================================
   7. Abrir el sobre
   ========================================================= */
const env = $('#openBtn');
function openSurprise() {
  if (env.classList.contains('open')) return;
  env.classList.add('open');
  startMusic();
  setTimeout(() => {
    $('#intro').classList.add('hide');
    document.body.classList.add('started');
    burst(innerWidth / 2, innerHeight / 2, 45);
    observeAll();
  }, 1400);
}
env.addEventListener('click', openSurprise);
env.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') openSurprise(); });
