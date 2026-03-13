// ═══════════════════════════════════════════════════════════
//  TEMPLE RUN  ·  OBI ENTERPRISES  ·  FOUNDER: ANMOL THAKUR
//  3rd-person · Demon chaser · Bright jungle temple
// ═══════════════════════════════════════════════════════════
'use strict';

// ── Canvas & DOM ──────────────────────────────────────────
const gc   = document.getElementById('gameCanvas');
const gctx = gc.getContext('2d');
const sc   = document.getElementById('splashCanvas');
const sctx = sc.getContext('2d');

const splash       = document.getElementById('splash');
const hud          = document.getElementById('hud');
const gameOverEl   = document.getElementById('gameOverScreen');
const playBtn      = document.getElementById('playBtn');
const restartBtn   = document.getElementById('restartBtn');
const scoreValEl   = document.getElementById('scoreVal');
const coinValEl    = document.getElementById('coinVal');
const distValEl    = document.getElementById('distVal');
const spdValEl     = document.getElementById('spdVal');
const goScoreEl    = document.getElementById('goScore');
const goCoinsEl    = document.getElementById('goCoins');
const goDistEl     = document.getElementById('goDist');
const goBestEl     = document.getElementById('goBest');

// ── World constants ───────────────────────────────────────
let W, H;
const LANES       = 3;
let   laneW, laneXs = [];

// ── Game state ────────────────────────────────────────────
let running = false, dead = false, animId, frameN = 0;
let score = 0, coins = 0, meter = 0, bestScore = 0;
let speed = 5;            // px/frame base
let splashAnimId;

// ── Camera / 3rd-person perspective ─────────────────────
// Vanishing point at top-center, player drawn near bottom-center
// Road stretches from VP down, obstacles slide from VP toward player

const VP = { x: 0, y: 0 };      // vanishing point (set on resize)
const PLAYER_Y_FRAC = 0.72;      // player sits at 72% screen height
const ROAD_BOTTOM   = 1.0;       // road ends at screen bottom
const FAR_SCALE     = 0.18;      // objects at horizon are 18% their size
const NEAR_SCALE    = 1.0;
const ROAD_FAR_W    = 0.28;      // road width fraction at horizon

// ── Player ────────────────────────────────────────────────
const player = {
  lane: 1, lx: 0,        // current & lerp-x
  y: 0, vy: 0,
  onGround: true,
  sliding: false, slideT: 0,
  invincible: false, invT: 0,
  runFrame: 0, runTimer: 0,
  hitFlash: 0,
  // hit-box at player pos
  hw: 38, hh: 56,
};

// ── Demon chaser ──────────────────────────────────────────
const demon = {
  lane: 1,
  dist: 260,    // distance behind player in "road units"
  // dist shrinks when player slows (hits), grows when running well
  runFrame: 0, runTimer: 0,
  roarTimer: 0,
  scale: 1,
};

// ── Obstacles & pickups ───────────────────────────────────
let obstacles  = [];   // { t, lane, roadZ, w, h, type, passed }
let pickups    = [];   // { lane, roadZ, type, collected, spin }
let particles  = [];

// Road Z system:
//   roadZ = 0 → at player feet (nearest)
//   roadZ = 1 → at horizon (farthest)
// Objects spawn at roadZ = 0.98 (far away, tiny) and move toward 0

const SPAWN_Z     = 0.97;   // spawn far away
const DESPAWN_Z   = -0.05;  // despawn behind camera
const OB_SPEED_Z  = 0.012;  // how fast roadZ decreases per frame (scales with speed)

// ── Parallax background ───────────────────────────────────
let bgPillars = [], bgTrees = [], bgClouds = [];

// ── Resize ────────────────────────────────────────────────
function resize() {
  W = gc.width  = sc.width  = window.innerWidth;
  H = gc.height = sc.height = window.innerHeight;
  VP.x = W / 2;
  VP.y = H * 0.28;
  laneW = W / LANES;
  laneXs = [laneW * 0.5, laneW * 1.5, laneW * 2.5];
  player.y = H * PLAYER_Y_FRAC;
  player.lx = laneXs[player.lane];
  rebuildBg();
}

function rebuildBg() {
  bgPillars = [];
  bgTrees   = [];
  bgClouds  = [];

  for (let i = 0; i < 16; i++) {
    bgPillars.push({
      x: Math.random() * W,
      baseY: VP.y + (H - VP.y) * (0.05 + Math.random() * 0.25),
      w: 16 + Math.random() * 24,
      h: 80 + Math.random() * 140,
      spd: 0.3 + Math.random() * 0.5,
      torch: Math.random() > 0.45,
      alpha: 0.5 + Math.random() * 0.4,
    });
  }
  for (let i = 0; i < 22; i++) {
    bgTrees.push({
      x: Math.random() * W,
      y: VP.y + (H - VP.y) * (0.0 + Math.random() * 0.35),
      r: 18 + Math.random() * 40,
      spd: 0.2 + Math.random() * 0.6,
      alpha: 0.35 + Math.random() * 0.4,
      hue: 100 + Math.random() * 40,
    });
  }
  for (let i = 0; i < 8; i++) {
    bgClouds.push({
      x: Math.random() * W,
      y: VP.y * (0.1 + Math.random() * 0.6),
      w: 80 + Math.random() * 160,
      h: 20 + Math.random() * 30,
      spd: 0.1 + Math.random() * 0.2,
      alpha: 0.08 + Math.random() * 0.12,
    });
  }
}

// ── Road Z → screen XY projection ────────────────────────
// Given a lane (0-2) and roadZ (0=near, 1=far), returns screen {x,y,s}
function project(lane, roadZ) {
  const t   = Math.max(0, Math.min(1, roadZ));
  const sy  = VP.y + (H * ROAD_BOTTOM - VP.y) * (1 - t);

  // Road width at this depth
  const roadWFar  = W * ROAD_FAR_W;
  const roadWNear = W;
  const roadW = roadWFar + (roadWNear - roadWFar) * (1 - t);

  const laneCount = LANES;
  const slotW = roadW / laneCount;
  const roadLeft = VP.x - roadW / 2;
  const sx = roadLeft + slotW * lane + slotW * 0.5;

  const scale = FAR_SCALE + (NEAR_SCALE - FAR_SCALE) * (1 - t);
  return { x: sx, y: sy, s: scale };
}

// ── Init ──────────────────────────────────────────────────
function initGame() {
  frameN = 0; score = 0; coins = 0; meter = 0; speed = 5; dead = false;
  player.lane = 1; player.lx = laneXs[1];
  player.y = H * PLAYER_Y_FRAC; player.vy = 0;
  player.onGround = true; player.sliding = false; player.slideT = 0;
  player.invincible = false; player.invT = 0;
  player.runFrame = 0; player.hitFlash = 0;
  demon.lane = 1; demon.dist = 260; demon.roarTimer = 0;
  obstacles = []; pickups = []; particles = [];
}

// ── Input ─────────────────────────────────────────────────
window.addEventListener('keydown', e => {
  if (!running) return;
  switch (e.key) {
    case 'ArrowLeft':  case 'a': case 'A': doLeft();  break;
    case 'ArrowRight': case 'd': case 'D': doRight(); break;
    case 'ArrowUp':    case 'w': case 'W': doJump();  break;
    case 'ArrowDown':  case 's': case 'S': doSlide(); break;
  }
  e.preventDefault();
});

// Touch swipe
let tx0 = 0, ty0 = 0, tMoved = false;
gc.addEventListener('touchstart', e => {
  tx0 = e.touches[0].clientX;
  ty0 = e.touches[0].clientY;
  tMoved = false;
}, { passive: true });

gc.addEventListener('touchmove', e => {
  if (tMoved || !running) return;
  const dx = e.touches[0].clientX - tx0;
  const dy = e.touches[0].clientY - ty0;
  const adx = Math.abs(dx), ady = Math.abs(dy);
  if (adx < 12 && ady < 12) return;
  tMoved = true;
  if (adx > ady) {
    if (dx < 0) doLeft(); else doRight();
  } else {
    if (dy < 0) doJump(); else doSlide();
  }
}, { passive: true });

// Zone buttons (large invisible tap areas)
document.getElementById('swipeLeft') .addEventListener('touchstart', e => { if(running) { doLeft();  e.preventDefault(); } }, { passive: false });
document.getElementById('swipeRight').addEventListener('touchstart', e => { if(running) { doRight(); e.preventDefault(); } }, { passive: false });
document.getElementById('swipeUp')   .addEventListener('touchstart', e => { if(running) { doJump();  e.preventDefault(); } }, { passive: false });
document.getElementById('swipeDown') .addEventListener('touchstart', e => { if(running) { doSlide(); e.preventDefault(); } }, { passive: false });

document.getElementById('swipeLeft') .addEventListener('click', () => { if(running) doLeft(); });
document.getElementById('swipeRight').addEventListener('click', () => { if(running) doRight(); });
document.getElementById('swipeUp')   .addEventListener('click', () => { if(running) doJump(); });
document.getElementById('swipeDown') .addEventListener('click', () => { if(running) doSlide(); });

function doLeft()  { const nl = player.lane - 1; if (nl >= 0)         { player.lane = nl; burst(player.lx, player.y + 20, '#ff8c00', 6); } }
function doRight() { const nl = player.lane + 1; if (nl < LANES)      { player.lane = nl; burst(player.lx, player.y + 20, '#ff8c00', 6); } }
function doJump()  { if (player.onGround && !player.sliding) { player.vy = -16; player.onGround = false; burst(player.lx, player.y + player.hh * 0.5, '#e8831a', 10); } }
function doSlide() { if (!player.sliding) { player.sliding = true; player.slideT = 42; burst(player.lx, player.y + player.hh * 0.5, '#c8922a', 6); } }

// ── Spawn ─────────────────────────────────────────────────
const OB_TYPES = ['rock','fire','gate_low','crate','spike','pit'];
const PICKUP_TYPES = ['coin','gem','shield'];

function spawnObstacle() {
  const type = OB_TYPES[Math.floor(Math.random() * OB_TYPES.length)];
  const lane = Math.floor(Math.random() * LANES);
  obstacles.push({ type, lane, roadZ: SPAWN_Z, passed: false });
}

function spawnPickups() {
  // Spawn a row of 3 coins or a gem
  const type = Math.random() > 0.85 ? 'gem' : 'coin';
  const laneStart = Math.floor(Math.random() * LANES);
  const count = type === 'gem' ? 1 : (1 + Math.floor(Math.random() * 2));
  for (let i = 0; i < count; i++) {
    const ln = (laneStart + i) % LANES;
    pickups.push({
      lane: ln, roadZ: SPAWN_Z - i * 0.03,
      type, collected: false, spin: Math.random() * Math.PI * 2
    });
  }
}

// ── Update ────────────────────────────────────────────────
function update() {
  frameN++;
  const spd = speed / 60;

  // Ramp speed
  if (frameN % 420 === 0) speed = Math.min(speed + 0.4, 16);

  score += Math.ceil(speed * 0.12);
  meter = Math.floor(frameN * speed / 60);

  // ── Player horizontal ──
  player.lx += (laneXs[player.lane] - player.lx) * 0.2;

  // ── Player jump physics ──
  if (!player.onGround) {
    player.vy += 0.75;
    player.y  += player.vy;
    if (player.y >= H * PLAYER_Y_FRAC) {
      player.y = H * PLAYER_Y_FRAC;
      player.vy = 0;
      player.onGround = true;
    }
  }

  // ── Slide timer ──
  if (player.sliding) { player.slideT--; if (player.slideT <= 0) player.sliding = false; }

  // ── Invincibility ──
  if (player.invincible) { player.invT--; if (player.invT <= 0) player.invincible = false; }
  if (player.hitFlash > 0) player.hitFlash--;

  // ── Run animation ──
  player.runTimer++;
  if (player.runTimer % 7 === 0) player.runFrame = (player.runFrame + 1) % 6;
  demon.runTimer++;
  if (demon.runTimer % 5 === 0) demon.runFrame = (demon.runFrame + 1) % 6;

  // ── Demon logic ──
  demon.roarTimer++;
  // Demon catches up when player is slowed, backs off over time
  const catchRate = 0.3 - (speed - 5) * 0.04;
  demon.dist = Math.max(80, Math.min(400, demon.dist + catchRate));
  if (demon.dist < 120 && demon.roarTimer % 80 === 0) {
    // screen shake
    shake(4, 8);
  }
  // Demon chases player lane slowly
  if (frameN % 60 === 0) {
    if (demon.lane < player.lane) demon.lane++;
    else if (demon.lane > player.lane) demon.lane--;
  }

  // ── Obstacles move ──
  const dz = (speed / 5) * 0.013;
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const ob = obstacles[i];
    ob.roadZ -= dz;

    if (!ob.passed && ob.roadZ < 0.03) {
      ob.passed = true; score += 15;
    }

    // Collision check when obstacle reaches player zone
    if (!player.invincible && ob.roadZ >= -0.02 && ob.roadZ < 0.06 && ob.lane === player.lane) {
      const hit = checkHit(ob);
      if (hit) { doHit(); break; }
    }

    if (ob.roadZ < DESPAWN_Z) obstacles.splice(i, 1);
  }

  // ── Pickups move ──
  for (let i = pickups.length - 1; i >= 0; i--) {
    const pk = pickups[i];
    pk.roadZ -= dz;
    pk.spin  += 0.1;

    if (!pk.collected && pk.roadZ >= -0.02 && pk.roadZ < 0.09 && pk.lane === player.lane) {
      pk.collected = true;
      if (pk.type === 'coin') { coins++; score += 50; }
      if (pk.type === 'gem')  { coins += 5; score += 250; }
      if (pk.type === 'shield') { player.invincible = true; player.invT = 300; }
      burst(player.lx, player.y, pk.type === 'gem' ? '#88f' : '#ffc820', 10);
    }

    if (pk.roadZ < DESPAWN_Z) pickups.splice(i, 1);
  }

  // ── Spawn ──
  const spawnRate = Math.max(55, 115 - speed * 5);
  if (frameN % Math.floor(spawnRate) === 0) spawnObstacle();
  if (frameN % 50 === 0) spawnPickups();

  // ── Particles ──
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy; p.vy += 0.18;
    p.life -= p.decay;
    if (p.life <= 0) particles.splice(i, 1);
  }

  // ── Scroll bg ──
  const bspd = speed * 0.4;
  bgPillars.forEach(p => { p.x -= p.spd * bspd * 0.15; if (p.x < -60) p.x = W + 60; });
  bgTrees.forEach  (t => { t.x -= t.spd * bspd * 0.12; if (t.x < -80) t.x = W + 80; });
  bgClouds.forEach (c => { c.x -= c.spd;               if (c.x < -200) c.x = W + 200; });

  // ── HUD ──
  scoreValEl.textContent = score;
  coinValEl .textContent = coins;
  distValEl .textContent = meter + 'm';
  spdValEl  .textContent = speed.toFixed(1) + '×';
}

function checkHit(ob) {
  if (ob.type === 'gate_low' && player.sliding) return false;
  if ((ob.type === 'fire' || ob.type === 'spike') && !player.onGround) return false;
  if (ob.type === 'pit' && !player.onGround) return false;
  return true;
}

let shakeX = 0, shakeY = 0, shakeLeft = 0;
function shake(amt, dur) { shakeX = amt; shakeY = amt * 0.5; shakeLeft = dur; }

function doHit() {
  if (player.invincible) return;
  player.hitFlash = 30;
  demon.dist = Math.max(80, demon.dist - 60);
  speed = Math.max(4, speed - 1);
  player.invincible = true; player.invT = 90;
  shake(8, 14);
  burst(player.lx, player.y, '#ff2200', 16);

  // If demon very close, die
  if (demon.dist < 100) killPlayer();
}

function killPlayer() {
  if (dead) return;
  dead = true; running = false;
  burst(player.lx, player.y, '#ff4500', 25);
  setTimeout(showGameOver, 700);
}

// ── Particles ─────────────────────────────────────────────
function burst(x, y, color, n) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = 1.5 + Math.random() * 5;
    particles.push({
      x, y, color,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - 3,
      life: 1, decay: 0.03 + Math.random() * 0.04,
      r: 2 + Math.random() * 5,
    });
  }
}

// ── DRAW ──────────────────────────────────────────────────
function draw() {
  gctx.clearRect(0, 0, W, H);

  // Screen shake
  let sx = 0, sy = 0;
  if (shakeLeft > 0) {
    sx = (Math.random() - 0.5) * shakeX;
    sy = (Math.random() - 0.5) * shakeY;
    shakeLeft--;
    gctx.save();
    gctx.translate(sx, sy);
  }

  drawSky();
  drawBgTrees();
  drawBgClouds();
  drawBgPillars();
  drawRoad();
  drawPickups();
  drawObstacles();
  drawDemon();
  drawPlayer();
  drawParticles();
  drawScreenEffects();

  if (shakeLeft >= 0 && sx !== 0) gctx.restore();
}

// ── Sky – bright lush jungle day ─────────────────────────
function drawSky() {
  const sky = gctx.createLinearGradient(0, 0, 0, VP.y * 1.4);
  sky.addColorStop(0,   '#4ab8e8');
  sky.addColorStop(0.4, '#6fd4f0');
  sky.addColorStop(0.75,'#ffe8a0');
  sky.addColorStop(1,   '#ffcc60');
  gctx.fillStyle = sky;
  gctx.fillRect(0, 0, W, H);

  // Sun
  const sunX = W * 0.75, sunY = H * 0.1;
  const sunG = gctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 80);
  sunG.addColorStop(0,   'rgba(255,255,220,1)');
  sunG.addColorStop(0.2, 'rgba(255,240,120,0.9)');
  sunG.addColorStop(0.5, 'rgba(255,200,50,0.4)');
  sunG.addColorStop(1,   'transparent');
  gctx.fillStyle = sunG;
  gctx.beginPath(); gctx.arc(sunX, sunY, 80, 0, Math.PI * 2); gctx.fill();

  // Sun rays
  gctx.save();
  gctx.globalAlpha = 0.15;
  gctx.strokeStyle = '#ffe080';
  gctx.lineWidth = 20;
  for (let r = 0; r < 8; r++) {
    const angle = (r / 8) * Math.PI * 2 + frameN * 0.002;
    gctx.beginPath();
    gctx.moveTo(sunX + Math.cos(angle) * 40, sunY + Math.sin(angle) * 40);
    gctx.lineTo(sunX + Math.cos(angle) * 200, sunY + Math.sin(angle) * 200);
    gctx.stroke();
  }
  gctx.restore();

  // Horizon glow
  const hg = gctx.createLinearGradient(0, VP.y - 40, 0, VP.y + 60);
  hg.addColorStop(0, 'transparent');
  hg.addColorStop(0.5, 'rgba(255,230,120,0.35)');
  hg.addColorStop(1, 'transparent');
  gctx.fillStyle = hg;
  gctx.fillRect(0, VP.y - 40, W, 100);
}

function drawBgClouds() {
  bgClouds.forEach(c => {
    gctx.save();
    gctx.globalAlpha = c.alpha;
    gctx.fillStyle = '#fff';
    gctx.beginPath();
    gctx.ellipse(c.x, c.y, c.w * 0.5, c.h * 0.5, 0, 0, Math.PI * 2);
    gctx.fill();
    gctx.restore();
  });
}

function drawBgTrees() {
  bgTrees.forEach(t => {
    gctx.save();
    gctx.globalAlpha = t.alpha;
    // Trunk
    gctx.fillStyle = '#5a3010';
    gctx.fillRect(t.x - 4, t.y, 8, t.r * 0.6);
    // Canopy layers
    for (let l = 0; l < 3; l++) {
      const ly = t.y - l * t.r * 0.5;
      const lr = t.r * (1 - l * 0.25);
      const cg = gctx.createRadialGradient(t.x, ly, 0, t.x, ly, lr);
      cg.addColorStop(0, `hsla(${t.hue + 10},70%,55%,1)`);
      cg.addColorStop(1, `hsla(${t.hue},65%,35%,0.7)`);
      gctx.fillStyle = cg;
      gctx.beginPath(); gctx.arc(t.x, ly, lr, 0, Math.PI * 2); gctx.fill();
    }
    gctx.restore();
  });
}

function drawBgPillars() {
  bgPillars.forEach(p => {
    gctx.save();
    gctx.globalAlpha = p.alpha * 0.7;
    // Pillar
    const pg = gctx.createLinearGradient(p.x, 0, p.x + p.w, 0);
    pg.addColorStop(0, '#9a7040');
    pg.addColorStop(0.4, '#c8a060');
    pg.addColorStop(1, '#7a5020');
    gctx.fillStyle = pg;
    gctx.fillRect(p.x, p.baseY, p.w, p.h);
    // Capital
    gctx.fillStyle = '#a88050';
    gctx.fillRect(p.x - 5, p.baseY, p.w + 10, 12);
    // Vines
    gctx.strokeStyle = '#3a6020';
    gctx.lineWidth = 2; gctx.globalAlpha = p.alpha * 0.4;
    gctx.beginPath();
    for (let vy = p.baseY; vy < p.baseY + p.h; vy += 12) {
      const vx = p.x + p.w * 0.7 + Math.sin(vy * 0.08 + frameN * 0.01) * 5;
      if (vy === p.baseY) gctx.moveTo(vx, vy); else gctx.lineTo(vx, vy);
    }
    gctx.stroke();
    // Torch
    if (p.torch) {
      gctx.globalAlpha = p.alpha;
      drawMiniFlame(p.x + p.w * 0.5, p.baseY - 8, 6, 14);
    }
    gctx.restore();
  });
}

// ── Road (perspective) ────────────────────────────────────
function drawRoad() {
  const roadNearW = W;
  const roadFarW  = W * ROAD_FAR_W;
  const roadFarX  = VP.x - roadFarW / 2;
  const roadNearX = 0;
  const roadTop   = VP.y;
  const roadBot   = H;

  // Road fill – warm stone
  const rg = gctx.createLinearGradient(0, roadTop, 0, roadBot);
  rg.addColorStop(0,   '#c8a060');
  rg.addColorStop(0.3, '#b08040');
  rg.addColorStop(0.7, '#906030');
  rg.addColorStop(1,   '#6a4020');
  gctx.fillStyle = rg;
  gctx.beginPath();
  gctx.moveTo(roadFarX, roadTop);
  gctx.lineTo(roadFarX + roadFarW, roadTop);
  gctx.lineTo(roadNearX + roadNearW, roadBot);
  gctx.lineTo(roadNearX, roadBot);
  gctx.closePath();
  gctx.fill();

  // Road side walls / edges
  gctx.strokeStyle = '#e0b870';
  gctx.lineWidth = 3;
  gctx.beginPath();
  gctx.moveTo(roadFarX, roadTop);
  gctx.lineTo(roadNearX, roadBot);
  gctx.stroke();
  gctx.beginPath();
  gctx.moveTo(roadFarX + roadFarW, roadTop);
  gctx.lineTo(roadNearX + roadNearW, roadBot);
  gctx.stroke();

  // Lane dividers
  for (let l = 1; l < LANES; l++) {
    const farLX  = roadFarX  + (roadFarW  / LANES) * l;
    const nearLX = roadNearX + (roadNearW / LANES) * l;
    gctx.strokeStyle = 'rgba(180,130,60,0.5)';
    gctx.lineWidth = 2;
    gctx.setLineDash([20, 20]);
    gctx.beginPath();
    gctx.moveTo(farLX, roadTop);
    gctx.lineTo(nearLX, roadBot);
    gctx.stroke();
    gctx.setLineDash([]);
  }

  // Scrolling stone tile lines
  const tileZ = (frameN * (speed / 60) * 0.013) % 0.08;
  for (let tz = tileZ; tz < 0.95; tz += 0.08) {
    const p0 = project(0, tz), p2 = project(2, tz);
    gctx.strokeStyle = 'rgba(100,70,30,0.35)';
    gctx.lineWidth = 1;
    gctx.beginPath();
    gctx.moveTo(p0.x - (roadNearW / LANES) * 0.5 * p0.s, p0.y);
    gctx.lineTo(p2.x + (roadNearW / LANES) * 0.5 * p2.s, p2.y);
    gctx.stroke();
  }

  // Road edge decorations (torches on sides)
  for (let tz = 0.1; tz < 0.9; tz += 0.18) {
    const scrollOffset = (frameN * speed * 0.013 / 60) % 0.18;
    const zt = (tz - scrollOffset + 1) % 1;
    if (zt < 0.08 || zt > 0.95) continue;
    const farPt = project(0, zt);
    const edgeX = farPt.x - (W / LANES) * farPt.s * 0.8;
    drawMiniFlame(edgeX, farPt.y - 18 * farPt.s, 5 * farPt.s, 12 * farPt.s);
    const farPtR = project(2, zt);
    const edgeXR = farPtR.x + (W / LANES) * farPtR.s * 0.8;
    drawMiniFlame(edgeXR, farPtR.y - 18 * farPtR.s, 5 * farPtR.s, 12 * farPtR.s);
  }

  // Temple arch at horizon
  drawTempleArch();
}

function drawTempleArch() {
  const ax = VP.x, ay = VP.y;
  const aw = 180, ah = 90;
  gctx.save();
  gctx.globalAlpha = 0.6;

  // Arch structure
  const ag = gctx.createLinearGradient(ax - aw, ay - ah, ax + aw, ay);
  ag.addColorStop(0, '#5a3510'); ag.addColorStop(0.5, '#8a5830'); ag.addColorStop(1, '#5a3510');
  gctx.fillStyle = ag;

  // Left pillar
  gctx.fillRect(ax - aw * 0.5 - 18, ay - ah, 22, ah + 20);
  // Right pillar
  gctx.fillRect(ax + aw * 0.5 - 4, ay - ah, 22, ah + 20);
  // Arch top
  gctx.beginPath();
  gctx.moveTo(ax - aw * 0.5 - 18, ay - ah + 10);
  gctx.quadraticCurveTo(ax, ay - ah - 50, ax + aw * 0.5 + 22, ay - ah + 10);
  gctx.lineWidth = 18; gctx.strokeStyle = ag; gctx.stroke();

  // Rune decorations
  gctx.fillStyle = '#c8a050';
  gctx.font = `${12}px serif`;
  gctx.textAlign = 'center'; gctx.textBaseline = 'middle';
  ['𓂀','𓃭','𓅓'].forEach((r, i) => {
    gctx.fillText(r, ax + (i - 1) * 28, ay - ah + 5);
  });

  gctx.restore();
}

// ── Draw pickups (3D projected) ───────────────────────────
function drawPickups() {
  const sorted = [...pickups].filter(p => !p.collected).sort((a, b) => a.roadZ - b.roadZ);
  sorted.forEach(pk => {
    const { x, y, s } = project(pk.lane, pk.roadZ);
    const r = 10 * s;
    gctx.save();
    gctx.translate(x, y - r * 0.5);
    gctx.scale(Math.abs(Math.cos(pk.spin)), 1);

    if (pk.type === 'coin') {
      // Glow
      const glow = gctx.createRadialGradient(0, 0, 0, 0, 0, r * 2.5);
      glow.addColorStop(0, 'rgba(255,200,30,0.5)');
      glow.addColorStop(1, 'transparent');
      gctx.fillStyle = glow;
      gctx.beginPath(); gctx.arc(0, 0, r * 2.5, 0, Math.PI * 2); gctx.fill();

      const cg = gctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
      cg.addColorStop(0, '#fff5aa');
      cg.addColorStop(0.4, '#ffd040');
      cg.addColorStop(1, '#cc8800');
      gctx.fillStyle = cg;
      gctx.beginPath(); gctx.arc(0, 0, r, 0, Math.PI * 2); gctx.fill();
      gctx.strokeStyle = '#aa7000'; gctx.lineWidth = r * 0.15; gctx.stroke();
      gctx.fillStyle = '#aa7000';
      gctx.font = `bold ${r * 0.9}px serif`;
      gctx.textAlign = 'center'; gctx.textBaseline = 'middle';
      gctx.fillText('$', 0, 1);

    } else if (pk.type === 'gem') {
      const gg = gctx.createRadialGradient(0, -r * 0.2, 0, 0, 0, r);
      gg.addColorStop(0, '#ccaaff');
      gg.addColorStop(0.5, '#8844dd');
      gg.addColorStop(1, '#440088');
      gctx.fillStyle = gg;
      gctx.beginPath();
      gctx.moveTo(0, -r); gctx.lineTo(r, -r * 0.2); gctx.lineTo(r * 0.6, r);
      gctx.lineTo(-r * 0.6, r); gctx.lineTo(-r, -r * 0.2);
      gctx.closePath(); gctx.fill();
      gctx.strokeStyle = '#cc88ff'; gctx.lineWidth = 1; gctx.stroke();
      // sparkle
      gctx.fillStyle = 'rgba(255,255,255,0.8)';
      gctx.beginPath(); gctx.arc(-r * 0.25, -r * 0.4, r * 0.18, 0, Math.PI * 2); gctx.fill();
    }

    gctx.restore();
  });
}

// ── Draw obstacles (3D projected) ────────────────────────
function drawObstacles() {
  const sorted = [...obstacles].sort((a, b) => a.roadZ - b.roadZ);
  sorted.forEach(ob => {
    const { x, y, s } = project(ob.lane, ob.roadZ);
    gctx.save();
    gctx.translate(x, y);
    const sc = s;

    switch (ob.type) {
      case 'rock':    drawRock3D(sc);    break;
      case 'fire':    drawFire3D(sc);    break;
      case 'gate_low':drawGate3D(sc);   break;
      case 'crate':   drawCrate3D(sc);  break;
      case 'spike':   drawSpike3D(sc);  break;
      case 'pit':     drawPit3D(ob, sc, x, y); break;
    }
    gctx.restore();
  });
}

function drawRock3D(s) {
  const w = 48 * s, h = 44 * s;
  const rg = gctx.createLinearGradient(-w / 2, -h, w / 2, 0);
  rg.addColorStop(0, '#c8a060'); rg.addColorStop(0.5, '#806030'); rg.addColorStop(1, '#3a2010');
  gctx.fillStyle = rg;
  gctx.beginPath();
  gctx.moveTo(-w * 0.5, 0);
  gctx.bezierCurveTo(-w * 0.6, -h * 0.5, -w * 0.3, -h, 0, -h * 1.05);
  gctx.bezierCurveTo(w * 0.3, -h, w * 0.6, -h * 0.5, w * 0.5, 0);
  gctx.closePath(); gctx.fill();
  gctx.strokeStyle = '#e0c080'; gctx.lineWidth = 2 * s; gctx.stroke();
  // moss
  gctx.fillStyle = 'rgba(40,120,20,0.4)';
  gctx.beginPath(); gctx.ellipse(0, -h * 0.8, w * 0.25, h * 0.15, 0, 0, Math.PI * 2); gctx.fill();
}

function drawFire3D(s) {
  const w = 36 * s, h = 60 * s;
  // base stone
  gctx.fillStyle = '#8a6030';
  gctx.fillRect(-w * 0.4, -8 * s, w * 0.8, 8 * s);
  // flame
  for (let f = 0; f < 3; f++) {
    const fw = (w * 0.5 - f * 4 * s);
    const fh = (h * 0.7 - f * 10 * s);
    const flick = Math.sin(frameN * 0.3 + f * 2) * 3 * s;
    const fg = gctx.createRadialGradient(flick, -h * 0.3, 0, flick, 0, fw);
    fg.addColorStop(0, f === 0 ? '#fff5aa' : '#ffcc00');
    fg.addColorStop(0.4, '#ff8800');
    fg.addColorStop(0.8, '#ff3300');
    fg.addColorStop(1, 'transparent');
    gctx.fillStyle = fg;
    gctx.beginPath();
    gctx.moveTo(-fw * 0.6, 0);
    gctx.bezierCurveTo(-fw + flick, -fh * 0.5, -fw * 0.4 + flick, -fh, flick, -fh * 1.1);
    gctx.bezierCurveTo(fw * 0.4 + flick, -fh, fw - flick, -fh * 0.5, fw * 0.6, 0);
    gctx.closePath(); gctx.fill();
  }
  // glow
  const gl = gctx.createRadialGradient(0, -h * 0.3, 0, 0, -h * 0.3, w * 1.8);
  gl.addColorStop(0, 'rgba(255,150,0,0.3)'); gl.addColorStop(1, 'transparent');
  gctx.fillStyle = gl;
  gctx.beginPath(); gctx.arc(0, -h * 0.3, w * 1.8, 0, Math.PI * 2); gctx.fill();
}

function drawGate3D(s) {
  const w = 70 * s, h = 30 * s;
  const y0 = -h - 4 * s;
  gctx.fillStyle = '#7a4a18';
  gctx.fillRect(-w / 2, y0, w, h);
  // Spikes on top
  gctx.fillStyle = '#5a3010';
  for (let i = -3; i <= 3; i++) {
    gctx.beginPath();
    gctx.moveTo(i * 10 * s, y0);
    gctx.lineTo(i * 10 * s - 4 * s, y0 - 12 * s);
    gctx.lineTo(i * 10 * s + 4 * s, y0 - 12 * s);
    gctx.fill();
  }
  // Glowing runes
  gctx.fillStyle = `rgba(255,150,0,${0.4 + Math.sin(frameN * 0.1) * 0.3})`;
  gctx.font = `${10 * s}px serif`;
  gctx.textAlign = 'center'; gctx.textBaseline = 'middle';
  gctx.fillText('𓂀', 0, y0 + h * 0.5);
  gctx.strokeStyle = '#e0a050'; gctx.lineWidth = 1.5 * s;
  gctx.strokeRect(-w / 2, y0, w, h);
}

function drawCrate3D(s) {
  const w = 44 * s, h = 44 * s;
  gctx.save();
  // Top face
  gctx.fillStyle = '#c8a060';
  gctx.fillRect(-w / 2, -h, w, h * 0.2);
  // Front face
  const cg = gctx.createLinearGradient(-w / 2, -h, w / 2, 0);
  cg.addColorStop(0, '#a07840'); cg.addColorStop(0.5, '#c89850'); cg.addColorStop(1, '#806030');
  gctx.fillStyle = cg;
  gctx.fillRect(-w / 2, -h + h * 0.2, w, h * 0.8);
  // Planks
  gctx.strokeStyle = '#6a4820'; gctx.lineWidth = 1.5 * s;
  gctx.strokeRect(-w / 2, -h, w, h);
  gctx.beginPath(); gctx.moveTo(-w / 2, -h * 0.5); gctx.lineTo(w / 2, -h * 0.5); gctx.stroke();
  gctx.beginPath(); gctx.moveTo(0, -h); gctx.lineTo(0, 0); gctx.stroke();
  // Metal straps
  gctx.strokeStyle = '#888060'; gctx.lineWidth = 3 * s;
  gctx.strokeRect(-w / 2 + 4 * s, -h + 2 * s, w - 8 * s, h - 4 * s);
  gctx.restore();
}

function drawSpike3D(s) {
  const count = 4, sw = 44 * s / count;
  for (let i = 0; i < count; i++) {
    const sx = -22 * s + i * sw + sw / 2;
    const sg = gctx.createLinearGradient(sx, -40 * s, sx, 0);
    sg.addColorStop(0, '#e0e0f0'); sg.addColorStop(0.5, '#a0a0c0'); sg.addColorStop(1, '#404058');
    gctx.fillStyle = sg;
    gctx.beginPath();
    gctx.moveTo(sx - sw * 0.35, 0); gctx.lineTo(sx + sw * 0.35, 0); gctx.lineTo(sx, -40 * s);
    gctx.closePath(); gctx.fill();
    gctx.strokeStyle = '#c0c0d8'; gctx.lineWidth = 1 * s; gctx.stroke();
    // Glint
    gctx.fillStyle = 'rgba(255,255,255,0.8)';
    gctx.beginPath(); gctx.arc(sx - sw * 0.05, -35 * s, 2 * s, 0, Math.PI * 2); gctx.fill();
  }
}

function drawPit3D(ob, s, screenX, screenY) {
  gctx.restore(); // pop the translate
  const { x: x0, y: y0 } = project(ob.lane - 0.5, ob.roadZ + 0.06);
  const { x: x1, y: y1 } = project(ob.lane + 0.5, ob.roadZ - 0.02);
  const pw = Math.abs(x1 - x0) * 1.1;
  const ph = Math.abs(y1 - y0) * 1.6;
  const px = (x0 + x1) / 2 - pw / 2;
  const py = y0;
  // Dark void
  const vg = gctx.createLinearGradient(px, py, px, py + ph);
  vg.addColorStop(0, '#000');
  vg.addColorStop(0.6, '#0a0200');
  vg.addColorStop(1, '#ff2200cc');
  gctx.fillStyle = vg;
  gctx.fillRect(px, py, pw, ph);
  // Lava glow at bottom
  const lg = gctx.createLinearGradient(px, py + ph * 0.7, px, py + ph);
  lg.addColorStop(0, 'transparent'); lg.addColorStop(1, 'rgba(255,60,0,0.5)');
  gctx.fillStyle = lg; gctx.fillRect(px, py + ph * 0.7, pw, ph * 0.3);
  gctx.save(); // re-push for later restore
  gctx.translate(screenX, screenY);
}

// ── Draw Demon ────────────────────────────────────────────
function drawDemon() {
  // Demon is behind player – project it as a virtual roadZ
  // demonZ: how far behind player (demon.dist) → roadZ slightly > 0 (below player)
  const demonZOffset = 0.04 + demon.dist * 0.00035;
  const demonRoadZ   = demonZOffset;
  const { x, y, s }  = project(demon.lane, demonRoadZ);

  const ds = s * 1.3;
  const dw = 58 * ds, dh = 80 * ds;

  gctx.save();
  gctx.translate(x, y);

  // Red glow aura
  const aura = gctx.createRadialGradient(0, -dh * 0.5, 0, 0, -dh * 0.5, dw * 1.5);
  aura.addColorStop(0, `rgba(255,0,0,${0.15 + Math.sin(frameN * 0.08) * 0.08})`);
  aura.addColorStop(1, 'transparent');
  gctx.fillStyle = aura;
  gctx.beginPath(); gctx.arc(0, -dh * 0.5, dw * 1.5, 0, Math.PI * 2); gctx.fill();

  // Shadow
  gctx.fillStyle = 'rgba(0,0,0,0.4)';
  gctx.beginPath(); gctx.ellipse(0, 2, dw * 0.45, 8 * ds, 0, 0, Math.PI * 2); gctx.fill();

  // Body – dark demon
  const bodyG = gctx.createLinearGradient(-dw * 0.4, -dh, dw * 0.4, 0);
  bodyG.addColorStop(0, '#4a0a0a'); bodyG.addColorStop(0.5, '#2a0505'); bodyG.addColorStop(1, '#1a0303');
  gctx.fillStyle = bodyG;
  gctx.beginPath();
  gctx.moveTo(-dw * 0.35, 0);
  gctx.lineTo(-dw * 0.4, -dh * 0.55);
  gctx.lineTo(0, -dh * 0.95);
  gctx.lineTo(dw * 0.4, -dh * 0.55);
  gctx.lineTo(dw * 0.35, 0);
  gctx.closePath(); gctx.fill();

  // Wings
  const runBob = Math.sin(demon.runFrame * Math.PI / 3) * 4 * ds;
  gctx.fillStyle = '#3a0808';
  // Left wing
  gctx.beginPath();
  gctx.moveTo(-dw * 0.4, -dh * 0.6);
  gctx.bezierCurveTo(-dw * 1.2, -dh * 0.9 + runBob, -dw * 0.9, -dh * 0.3, -dw * 0.4, -dh * 0.3);
  gctx.closePath(); gctx.fill();
  // Right wing
  gctx.beginPath();
  gctx.moveTo(dw * 0.4, -dh * 0.6);
  gctx.bezierCurveTo(dw * 1.2, -dh * 0.9 - runBob, dw * 0.9, -dh * 0.3, dw * 0.4, -dh * 0.3);
  gctx.closePath(); gctx.fill();

  // Legs running
  const legSwing = Math.sin(demon.runFrame * Math.PI / 3) * 15 * ds;
  gctx.strokeStyle = '#3a0808'; gctx.lineWidth = 10 * ds; gctx.lineCap = 'round';
  gctx.beginPath(); gctx.moveTo(-12 * ds, -dh * 0.05); gctx.lineTo(-12 * ds + legSwing, dh * 0.35); gctx.stroke();
  gctx.beginPath(); gctx.moveTo(12 * ds, -dh * 0.05);  gctx.lineTo(12 * ds - legSwing, dh * 0.35); gctx.stroke();

  // Arms
  gctx.strokeStyle = '#4a0a0a'; gctx.lineWidth = 8 * ds;
  gctx.beginPath(); gctx.moveTo(-dw * 0.35, -dh * 0.5); gctx.lineTo(-dw * 0.6 + legSwing * 0.5, -dh * 0.2); gctx.stroke();
  gctx.beginPath(); gctx.moveTo(dw * 0.35, -dh * 0.5);  gctx.lineTo(dw * 0.6 - legSwing * 0.5, -dh * 0.2); gctx.stroke();

  // Head
  const headG = gctx.createRadialGradient(-3 * ds, -dh * 0.9, 0, 0, -dh * 0.82, 18 * ds);
  headG.addColorStop(0, '#8a1010'); headG.addColorStop(1, '#300808');
  gctx.fillStyle = headG;
  gctx.beginPath(); gctx.arc(0, -dh * 0.82, 18 * ds, 0, Math.PI * 2); gctx.fill();

  // Horns
  gctx.fillStyle = '#cc2200';
  gctx.beginPath(); gctx.moveTo(-10 * ds, -dh * 0.95); gctx.lineTo(-16 * ds, -dh * 1.12); gctx.lineTo(-4 * ds, -dh * 0.98); gctx.fill();
  gctx.beginPath(); gctx.moveTo(10 * ds, -dh * 0.95);  gctx.lineTo(16 * ds, -dh * 1.12);  gctx.lineTo(4 * ds, -dh * 0.98);  gctx.fill();

  // Glowing eyes
  const eyePulse = 0.6 + Math.sin(frameN * 0.15) * 0.4;
  gctx.fillStyle = `rgba(255,50,0,${eyePulse})`;
  gctx.beginPath(); gctx.arc(-6 * ds, -dh * 0.84, 5 * ds, 0, Math.PI * 2); gctx.fill();
  gctx.beginPath(); gctx.arc(6 * ds,  -dh * 0.84, 5 * ds, 0, Math.PI * 2); gctx.fill();
  gctx.fillStyle = '#ff0000';
  gctx.beginPath(); gctx.arc(-6 * ds, -dh * 0.84, 2.5 * ds, 0, Math.PI * 2); gctx.fill();
  gctx.beginPath(); gctx.arc(6 * ds,  -dh * 0.84, 2.5 * ds, 0, Math.PI * 2); gctx.fill();

  // Distance warning
  if (demon.dist < 160) {
    gctx.save();
    gctx.globalAlpha = (160 - demon.dist) / 160 * 0.7;
    gctx.fillStyle = '#ff0000';
    gctx.font = `bold ${14 * ds}px Cinzel, serif`;
    gctx.textAlign = 'center'; gctx.textBaseline = 'bottom';
    gctx.fillText('⚠', 0, -dh * 1.15);
    gctx.restore();
  }

  gctx.restore();
}

// ── Draw Player (3rd person, behind-camera view) ──────────
function drawPlayer() {
  const px = player.lx;
  const py = player.y;
  const ph = player.sliding ? player.hh * 0.5 : player.hh;
  const pw = player.hw;

  // Flash on hit
  if (player.hitFlash > 0 && Math.floor(player.hitFlash / 3) % 2 === 1) return;

  gctx.save();
  gctx.translate(px, py);

  // Ground shadow
  gctx.fillStyle = 'rgba(0,0,0,0.35)';
  gctx.beginPath();
  gctx.ellipse(0, player.y - py + 4, pw * 0.7 * (player.sliding ? 1.4 : 1), 7, 0, 0, Math.PI * 2);
  gctx.fill();

  const runBob = player.onGround ? Math.sin(player.runFrame * Math.PI / 3) * 3 : 0;
  gctx.translate(0, runBob);

  if (player.sliding) {
    // Sliding pose
    gctx.save();
    gctx.rotate(-0.4);
    const sg = gctx.createLinearGradient(-pw * 0.8, -ph, pw * 0.8, 0);
    sg.addColorStop(0, '#f0c080'); sg.addColorStop(0.5, '#e8831a'); sg.addColorStop(1, '#8b3a10');
    gctx.fillStyle = sg;
    gctx.beginPath();
    gctx.ellipse(0, -ph * 0.5, pw * 1.0, ph * 0.55, 0, 0, Math.PI * 2);
    gctx.fill();
    // Head
    gctx.fillStyle = '#f0c080';
    gctx.beginPath(); gctx.arc(pw * 0.5, -ph * 0.5, 13, 0, Math.PI * 2); gctx.fill();
    gctx.restore();

  } else {
    // ── Legs ──
    const legSwing = Math.sin(player.runFrame * Math.PI / 3) * 14;
    gctx.strokeStyle = '#7a3010'; gctx.lineWidth = 9; gctx.lineCap = 'round';
    // Back leg
    gctx.beginPath();
    gctx.moveTo(0, -ph * 0.08);
    gctx.lineTo(-10 - legSwing, ph * 0.42);
    gctx.stroke();
    // Front leg
    gctx.beginPath();
    gctx.moveTo(0, -ph * 0.08);
    gctx.lineTo(10 + legSwing, ph * 0.42);
    gctx.stroke();
    // Shoes
    gctx.fillStyle = '#4a2008';
    gctx.beginPath(); gctx.ellipse(-10 - legSwing, ph * 0.42, 8, 5, 0.3, 0, Math.PI * 2); gctx.fill();
    gctx.beginPath(); gctx.ellipse(10 + legSwing, ph * 0.42, 8, 5, -0.3, 0, Math.PI * 2); gctx.fill();

    // ── Torso ──
    const tg = gctx.createLinearGradient(-pw * 0.5, -ph, pw * 0.5, -ph * 0.1);
    tg.addColorStop(0, '#f0c080');
    tg.addColorStop(0.3, '#e8831a');
    tg.addColorStop(1, '#8b3a10');
    gctx.fillStyle = tg;
    gctx.beginPath();
    gctx.roundRect(-pw * 0.42, -ph * 0.7, pw * 0.84, ph * 0.6, 8);
    gctx.fill();
    // Shirt detail
    gctx.strokeStyle = 'rgba(0,0,0,0.2)'; gctx.lineWidth = 1.5;
    gctx.beginPath(); gctx.moveTo(0, -ph * 0.65); gctx.lineTo(0, -ph * 0.12); gctx.stroke();

    // ── Arms ──
    gctx.strokeStyle = '#e8831a'; gctx.lineWidth = 8; gctx.lineCap = 'round';
    gctx.beginPath(); gctx.moveTo(-pw * 0.4, -ph * 0.55); gctx.lineTo(-pw * 0.65 - legSwing * 0.4, -ph * 0.2); gctx.stroke();
    gctx.beginPath(); gctx.moveTo(pw * 0.4, -ph * 0.55);  gctx.lineTo(pw * 0.65 + legSwing * 0.4, -ph * 0.2);  gctx.stroke();
    // Hands
    gctx.fillStyle = '#f0c080';
    gctx.beginPath(); gctx.arc(-pw * 0.65 - legSwing * 0.4, -ph * 0.2, 5, 0, Math.PI * 2); gctx.fill();
    gctx.beginPath(); gctx.arc(pw * 0.65 + legSwing * 0.4, -ph * 0.2, 5, 0, Math.PI * 2);  gctx.fill();

    // ── Head ──
    const hg = gctx.createRadialGradient(-4, -ph * 0.86, 2, 0, -ph * 0.8, 16);
    hg.addColorStop(0, '#ffd090'); hg.addColorStop(1, '#cc7730');
    gctx.fillStyle = hg;
    gctx.beginPath(); gctx.arc(0, -ph * 0.8, 16, 0, Math.PI * 2); gctx.fill();

    // Hat (Indiana Jones style)
    gctx.fillStyle = '#6a3a10';
    gctx.beginPath();
    gctx.ellipse(0, -ph * 0.9, 20, 7, 0, 0, Math.PI * 2);
    gctx.fill();
    gctx.fillStyle = '#8b4a18';
    gctx.beginPath();
    gctx.ellipse(0, -ph * 0.93, 14, 8, 0, 0, Math.PI);
    gctx.fill();

    // Eyes
    gctx.fillStyle = '#fff';
    gctx.beginPath(); gctx.arc(-5, -ph * 0.8, 3.5, 0, Math.PI * 2); gctx.fill();
    gctx.beginPath(); gctx.arc(5, -ph * 0.8, 3.5, 0, Math.PI * 2);  gctx.fill();
    gctx.fillStyle = '#333';
    gctx.beginPath(); gctx.arc(-4.5, -ph * 0.8, 2, 0, Math.PI * 2); gctx.fill();
    gctx.beginPath(); gctx.arc(5.5, -ph * 0.8, 2, 0, Math.PI * 2);  gctx.fill();

    // Held torch (right hand)
    gctx.strokeStyle = '#8b5020'; gctx.lineWidth = 4; gctx.lineCap = 'round';
    const tx = pw * 0.7 + legSwing * 0.4, ty = -ph * 0.25;
    gctx.beginPath(); gctx.moveTo(tx, ty); gctx.lineTo(tx + 4, ty - 20); gctx.stroke();
    drawMiniFlame(tx + 4, ty - 26, 6 * 0.7, 14 * 0.7);
  }

  // Invincible shield effect
  if (player.invincible && !player.hitFlash) {
    gctx.globalAlpha = 0.3 + Math.sin(frameN * 0.3) * 0.2;
    gctx.strokeStyle = '#88f0ff'; gctx.lineWidth = 3;
    gctx.beginPath(); gctx.arc(0, -ph * 0.5, pw * 0.8, 0, Math.PI * 2); gctx.stroke();
    gctx.globalAlpha = 1;
  }

  gctx.restore();
}

function drawMiniFlame(fx, fy, rw, rh) {
  const flick = Math.sin(frameN * 0.35) * 1.5;
  const fg = gctx.createRadialGradient(flick, fy + rh * 0.1, 0, flick, fy, rh);
  fg.addColorStop(0, '#fff5aa');
  fg.addColorStop(0.3, '#ffcc00');
  fg.addColorStop(0.6, '#ff6a00');
  fg.addColorStop(1, 'transparent');
  gctx.fillStyle = fg;
  gctx.beginPath();
  gctx.moveTo(fx - rw * 0.6, fy + rh);
  gctx.bezierCurveTo(fx - rw + flick, fy + rh * 0.5, fx - rw * 0.3 + flick, fy - rh * 0.2, fx + flick, fy - rh * 0.5);
  gctx.bezierCurveTo(fx + rw * 0.3 + flick, fy - rh * 0.2, fx + rw - flick, fy + rh * 0.5, fx + rw * 0.6, fy + rh);
  gctx.closePath(); gctx.fill();
}

function drawParticles() {
  particles.forEach(p => {
    gctx.save();
    gctx.globalAlpha = p.life * 0.9;
    gctx.fillStyle = p.color;
    gctx.beginPath(); gctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2); gctx.fill();
    gctx.restore();
  });
}

function drawScreenEffects() {
  // Vignette
  const vig = gctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.85);
  vig.addColorStop(0, 'transparent');
  vig.addColorStop(1, 'rgba(0,0,0,0.55)');
  gctx.fillStyle = vig; gctx.fillRect(0, 0, W, H);

  // Speed lines
  if (speed > 8) {
    gctx.save();
    gctx.globalAlpha = (speed - 8) / 16;
    for (let i = 0; i < 10; i++) {
      const lx = (i * W / 10 + frameN * speed * 0.8) % (W + 60) - 30;
      gctx.strokeStyle = 'rgba(255,200,80,0.15)';
      gctx.lineWidth = 2;
      gctx.beginPath(); gctx.moveTo(lx, 0); gctx.lineTo(lx - 40, H); gctx.stroke();
    }
    gctx.restore();
  }

  // Danger vignette when demon is close
  if (demon.dist < 150) {
    const dangerAlpha = (150 - demon.dist) / 150 * 0.4;
    const dv = gctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.8);
    dv.addColorStop(0, 'transparent');
    dv.addColorStop(1, `rgba(220,0,0,${dangerAlpha})`);
    gctx.fillStyle = dv; gctx.fillRect(0, 0, W, H);
  }
}

// ═══════════════════════════════════════════════
//  SPLASH CANVAS ANIMATION
// ═══════════════════════════════════════════════
function drawSplashBg() {
  sctx.clearRect(0, 0, W, H);

  // Dark jungle sky
  const sky = sctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#060210');
  sky.addColorStop(0.5, '#0d0a02');
  sky.addColorStop(1, '#1a0c03');
  sctx.fillStyle = sky; sctx.fillRect(0, 0, W, H);

  // Stars
  for (let i = 0; i < 120; i++) {
    const sx = (i * 137.5) % W;
    const sy = (i * 73.1)  % (H * 0.55);
    const bright = 0.2 + 0.5 * Math.sin(Date.now() * 0.001 + i);
    sctx.fillStyle = `rgba(255,240,210,${bright})`;
    sctx.fillRect(sx, sy, 1.5, 1.5);
  }

  // Temple silhouette
  drawSplashTemple();

  // Animated trees silhouette
  drawSplashTrees();

  // Ground fog
  const fog = sctx.createLinearGradient(0, H * 0.75, 0, H);
  fog.addColorStop(0, 'transparent');
  fog.addColorStop(1, 'rgba(20,10,0,0.8)');
  sctx.fillStyle = fog; sctx.fillRect(0, H * 0.75, W, H * 0.25);

  // Fireflies
  for (let f = 0; f < 18; f++) {
    const ffx = ((f * 97 + Date.now() * 0.04 * (f % 3 + 0.5)) % W);
    const ffy = H * 0.5 + Math.sin(Date.now() * 0.001 + f) * H * 0.2;
    const fa  = 0.3 + 0.5 * Math.sin(Date.now() * 0.003 + f * 0.7);
    sctx.fillStyle = `rgba(150,255,100,${fa})`;
    sctx.beginPath(); sctx.arc(ffx, ffy, 2, 0, Math.PI * 2); sctx.fill();
    sctx.fillStyle = `rgba(150,255,100,${fa * 0.3})`;
    sctx.beginPath(); sctx.arc(ffx, ffy, 6, 0, Math.PI * 2); sctx.fill();
  }
}

function drawSplashTemple() {
  const cx = W * 0.5, by = H * 0.78;
  const tw = Math.min(W * 0.55, 320);

  sctx.save();
  sctx.fillStyle = '#0a0500';

  // Main temple body
  sctx.fillRect(cx - tw * 0.5, by - tw * 0.45, tw, tw * 0.45);

  // Tiered pyramid
  for (let tier = 0; tier < 5; tier++) {
    const tw2 = tw * (0.9 - tier * 0.16);
    const th2 = tw * 0.1;
    sctx.fillRect(cx - tw2 * 0.5, by - tw * 0.45 - tier * th2 - th2, tw2, th2);
  }

  // Doorway
  sctx.fillStyle = '#c85010';
  const doorW = tw * 0.15, doorH = tw * 0.22;
  sctx.fillRect(cx - doorW * 0.5, by - doorH, doorW, doorH);
  sctx.fillStyle = '#0a0500';
  sctx.beginPath();
  sctx.arc(cx, by - doorH, doorW * 0.5, Math.PI, 0);
  sctx.fill();

  // Glowing torches on sides
  const t = Date.now() * 0.001;
  sctx.save(); sctx.globalAlpha = 0.9;
  drawSplashFlame(cx - tw * 0.3, by - tw * 0.38, t);
  drawSplashFlame(cx + tw * 0.3, by - tw * 0.38, t);
  sctx.restore();

  sctx.restore();
}

function drawSplashFlame(fx, fy, t) {
  const flick = Math.sin(t * 7) * 3;
  const fg = sctx.createRadialGradient(fx + flick, fy, 0, fx, fy + 8, 18);
  fg.addColorStop(0, '#fff5aa');
  fg.addColorStop(0.3, '#ffcc00');
  fg.addColorStop(0.7, '#ff6a00');
  fg.addColorStop(1, 'transparent');
  sctx.fillStyle = fg;
  sctx.beginPath();
  sctx.moveTo(fx - 8, fy + 10);
  sctx.bezierCurveTo(fx - 12 + flick, fy, fx - 4 + flick, fy - 15, fx + flick, fy - 22);
  sctx.bezierCurveTo(fx + 4 + flick, fy - 15, fx + 12 - flick, fy, fx + 8, fy + 10);
  sctx.closePath(); sctx.fill();
}

function drawSplashTrees() {
  const t = Date.now() * 0.0005;
  const treeData = [
    { x: 0.05, h: 0.45 }, { x: 0.12, h: 0.38 }, { x: 0.18, h: 0.5 },
    { x: 0.82, h: 0.42 }, { x: 0.88, h: 0.52 }, { x: 0.95, h: 0.36 },
    { x: 0.25, h: 0.3  }, { x: 0.75, h: 0.32 },
  ];
  treeData.forEach((td, i) => {
    const tx = W * td.x;
    const ty = H * 0.78;
    const th = H * td.h;
    const sway = Math.sin(t + i * 0.8) * 4;
    sctx.save();
    sctx.fillStyle = '#0d1a05';
    // Trunk
    sctx.fillRect(tx - 5, ty - th * 0.3, 10, th * 0.3);
    // Canopy
    for (let l = 0; l < 4; l++) {
      const lr = (30 + l * 20) * (td.h + 0.2);
      const ly = ty - th * 0.3 - l * lr * 0.5;
      sctx.beginPath();
      sctx.arc(tx + sway, ly, lr, 0, Math.PI * 2);
      sctx.fill();
    }
    sctx.restore();
  });
}

function splashLoop() {
  drawSplashBg();
  splashAnimId = requestAnimationFrame(splashLoop);
}

// ═══════════════════════════════════════════════
//  GAME LOOP
// ═══════════════════════════════════════════════
function gameLoop() {
  if (!running) return;
  update();
  draw();
  animId = requestAnimationFrame(gameLoop);
}

// ═══════════════════════════════════════════════
//  SCREENS
// ═══════════════════════════════════════════════
function showGameOver() {
  if (score > bestScore) bestScore = score;
  goScoreEl.textContent = score;
  goCoinsEl.textContent = coins;
  goDistEl .textContent = meter + 'm';
  goBestEl .textContent = bestScore;
  gameOverEl.classList.remove('hidden');
}

function startGame() {
  cancelAnimationFrame(splashAnimId);
  splash.style.transition = 'opacity 0.5s, transform 0.5s';
  splash.style.opacity    = '0';
  splash.style.transform  = 'scale(1.05)';
  setTimeout(() => splash.classList.add('hidden'), 500);
  hud.classList.remove('hidden');
  gameOverEl.classList.add('hidden');
  initGame();
  running = true;
  gameLoop();
}

function restartGame() {
  gameOverEl.classList.add('hidden');
  initGame();
  running = true;
  gameLoop();
}

// ═══════════════════════════════════════════════
//  BOOT
// ═══════════════════════════════════════════════
window.addEventListener('resize', () => { resize(); });
playBtn.addEventListener('click', startGame);
playBtn.addEventListener('touchend', e => { e.preventDefault(); startGame(); });
restartBtn.addEventListener('click', restartGame);
restartBtn.addEventListener('touchend', e => { e.preventDefault(); restartGame(); });

resize();
splashLoop();
