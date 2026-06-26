const COLS = 20, ROWS = 20, CELL = 24;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = COLS * CELL;
canvas.height = ROWS * CELL;

const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');

let snake, dir, nextDir, food, running, interval, score;
let best = parseInt(localStorage.getItem('snakeBest') || '0');
bestEl.textContent = best;

function init() {
  snake = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];
  dir = {x: 1, y: 0};
  nextDir = {x: 1, y: 0};
  score = 0;
  scoreEl.textContent = 0;
  placeFood();
}

function placeFood() {
  do {
    food = {x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS)};
  } while (snake.some(s => s.x === food.x && s.y === food.y));
}

function drawGrid() {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#161616';
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= COLS; x++) {
    ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, canvas.height); ctx.stroke();
  }
  for (let y = 0; y <= ROWS; y++) {
    ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(canvas.width, y * CELL); ctx.stroke();
  }
}

function drawSnake() {
  snake.forEach((seg, i) => {
    ctx.fillStyle = i === 0 ? '#86efac' : (i % 2 === 0 ? '#4ade80' : '#22c55e');
    ctx.beginPath();
    ctx.roundRect(seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4, 5);
    ctx.fill();
  });
}

function drawFood() {
  const fx = food.x * CELL + CELL / 2, fy = food.y * CELL + CELL / 2, fr = CELL / 2 - 4;
  ctx.fillStyle = '#f87171';
  ctx.beginPath(); ctx.arc(fx, fy, fr, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fca5a5';
  ctx.beginPath(); ctx.arc(fx - fr * 0.25, fy - fr * 0.3, fr * 0.3, 0, Math.PI * 2); ctx.fill();
}

function drawGameOver() {
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#4ade80';
  ctx.font = 'bold 28px Courier New';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = '#888';
  ctx.font = '14px Courier New';
  ctx.fillText('press space to retry', canvas.width / 2, canvas.height / 2 + 20);
}

function draw() {
  drawGrid();
  drawSnake();
  drawFood();
}

function step() {
  dir = {...nextDir};
  const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
      snake.some(s => s.x === head.x && s.y === head.y)) {
    clearInterval(interval);
    running = false;
    draw();
    drawGameOver();
    return;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    if (score > best) {
      best = score;
      bestEl.textContent = best;
      localStorage.setItem('snakeBest', best);
    }
    placeFood();
  } else {
    snake.pop();
  }
  draw();
}

function start() {
  init();
  running = true;
  clearInterval(interval);
  interval = setInterval(step, 150);
  draw();
}

document.addEventListener('keydown', e => {
  const km = {
    'ArrowUp': {x:0,y:-1}, 'w': {x:0,y:-1},
    'ArrowDown': {x:0,y:1}, 's': {x:0,y:1},
    'ArrowLeft': {x:-1,y:0}, 'a': {x:-1,y:0},
    'ArrowRight': {x:1,y:0}, 'd': {x:1,y:0}
  };
  if (e.key in km) {
    e.preventDefault();
    const nd = km[e.key];
    if (nd.x !== -dir.x || nd.y !== -dir.y) nextDir = nd;
  }
  if (e.key === ' ') { e.preventDefault(); if (!running) start(); }
});

init();
draw();