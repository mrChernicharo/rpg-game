import { DUNGEON_MAPS } from "./data";
import { ctx, canvas } from "./dom";

let frameID;

const keyMap: { [k: string]: boolean } = {
  w: false,
  ArrowUp: false,
  a: false,
  ArrowLeft: false,
  s: false,
  ArrowDown: false,
  d: false,
  ArrowRight: false,
};

const wallCollision: { [k: string]: boolean } = {
  top: false,
  right: false,
  bottom: false,
  left: false,
};

const CELL_SIZE = 100;
const map = DUNGEON_MAPS[0].map;
const [cols, rows] = [map[0].length, map.length];
// ctx.save();

let px = 0;
let py = 0;
let speed = 2;

console.log(rows, cols);

const MID_W = canvas.width / 2;
const MID_H = canvas.height / 2;
const FUL_W = canvas.width;
const FUL_H = canvas.height;

window.onkeydown = (e: KeyboardEvent) => {
  keyMap[e.key] = true;
};

window.onkeyup = (e: KeyboardEvent) => {
  keyMap[e.key] = false;
};

function handlePlayerMovement() {
  if (keyMap.w || keyMap.ArrowUp) {
    py -= speed;
  }
  if (keyMap.s || keyMap.ArrowDown) {
    py += speed;
  }
  if (keyMap.a || keyMap.ArrowLeft) {
    px -= speed;
  }
  if (keyMap.d || keyMap.ArrowRight) {
    px += speed;
  }
}

const CELL_COLORS = ["orange", "brown"];
const pCircle = { cx: MID_W, cy: MID_H, r: 40 };

function drawDungeon() {
  handlePlayerMovement();
  ctx.clearRect(0, 0, 1000, 1000);

  //   const lineVert = { ax: MID_W - px, ay: 0 - py, bx: MID_W - px, by: FUL_H - py };
  //   const lineHoriz = { ax: 0 - px, ay: MID_H - py, bx: FUL_W - px, by: MID_H - py };
  //   let collision = false;
  //   let neighbors = [];

  // let closestX, closestY
  let smallestDist = Infinity;
  let currentCell = { x: 0, y: 0 };
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = map[row][col];

      const [x, y, w, h] = [col * CELL_SIZE - px, row * CELL_SIZE - py, CELL_SIZE, CELL_SIZE];
      const [cellCenterX, cellCenterY] = [x + CELL_SIZE / 2, y + CELL_SIZE / 2];

      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.fillStyle = CELL_COLORS[cell];
      ctx.fill();
      ctx.closePath();

      //   console.log(row, col, getDistance(cellCenterX, cellCenterY, pCircle.cx, pCircle.cy));

      const distToPlayer = getDistance(cellCenterX, cellCenterY, pCircle.cx, pCircle.cy);
      if (distToPlayer <= smallestDist) {
        smallestDist = distToPlayer;
        currentCell = { x: col * CELL_SIZE, y: row * CELL_SIZE };
      }
    }
  }

  for (let col = 0; col < cols + 1; col++) {
    ctx.beginPath();
    ctx.moveTo(col * CELL_SIZE - px, 0 - py);
    ctx.lineTo(col * CELL_SIZE - px, rows * CELL_SIZE - py);
    ctx.stroke();
    ctx.closePath();
  }

  for (let row = 0; row < rows + 1; row++) {
    ctx.beginPath();
    ctx.moveTo(0 - px, row * CELL_SIZE - py);
    ctx.lineTo(cols * CELL_SIZE - px, row * CELL_SIZE - py);
    ctx.stroke();
    ctx.closePath();
  }
  //   console.log(neighbors);

  //   console.log("smallest distance", smallestDist, currentCell);

  const topLine = {
    ax: currentCell.x - px,
    ay: currentCell.y - py,
    bx: currentCell.x + CELL_SIZE - px,
    by: currentCell.y - py,
  };
  ctx.beginPath();
  ctx.moveTo(topLine.ax, topLine.ay);
  ctx.lineTo(topLine.bx, topLine.by);
  ctx.strokeStyle = "red";
  ctx.stroke();
  ctx.closePath();

  const bottomLine = {
    ax: currentCell.x - px,
    ay: currentCell.y + CELL_SIZE - py,
    bx: currentCell.x + CELL_SIZE - px,
    by: currentCell.y + CELL_SIZE - py,
  };
  ctx.beginPath();
  ctx.moveTo(bottomLine.ax, bottomLine.ay);
  ctx.lineTo(bottomLine.bx, bottomLine.by);
  ctx.strokeStyle = "lightgreen";
  ctx.stroke();
  ctx.closePath();

  const leftLine = {
    ax: currentCell.x - px,
    ay: currentCell.y - py,
    bx: currentCell.x - px,
    by: currentCell.y + CELL_SIZE - py,
  };
  ctx.beginPath();
  ctx.moveTo(leftLine.ax, leftLine.ay);
  ctx.lineTo(leftLine.bx, leftLine.by);
  ctx.strokeStyle = "lightblue";
  ctx.stroke();
  ctx.closePath();

  const rightLine = {
    ax: currentCell.x + CELL_SIZE - px,
    ay: currentCell.y - py,
    bx: currentCell.x + CELL_SIZE - px,
    by: currentCell.y + CELL_SIZE - py,
  };
  ctx.beginPath();
  ctx.moveTo(rightLine.ax, rightLine.ay);
  ctx.lineTo(rightLine.bx, rightLine.by);
  ctx.strokeStyle = "lightblue";
  ctx.stroke();
  ctx.closePath();

  ctx.strokeStyle = "black";

  // player
  ctx.beginPath();
  ctx.arc(pCircle.cx, pCircle.cy, 20, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();

  // player outline
  ctx.beginPath();
  ctx.arc(pCircle.cx, pCircle.cy, pCircle.r, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.stroke();
  ctx.closePath();

  //   console.log(
  //     "horiz:",
  //     checkLineIntersectsCircle(lineHoriz, circle),
  //     "vert:",
  //     checkLineIntersectsCircle(lineVert, circle)
  //   );

  requestAnimationFrame(drawDungeon);
}

function checkLineIntersectsCircle(
  line: { ax: number; ay: number; bx: number; by: number },
  circle: { cx: number; cy: number; r: number }
) {
  let { ax, ay, bx, by } = line;
  let { cx, cy, r } = circle;

  ax -= cx;
  ay -= cy;
  bx -= cx;
  by -= cy;
  const a = (bx - ax) ** 2 + (by - ay) ** 2;
  const b = 2 * (ax * (bx - ax) + ay * (by - ay));
  const c = ax ** 2 + ay ** 2 - r ** 2;
  const disc = b ** 2 - 4 * a * c;
  if (disc <= 0) return false;
  const sqrtdisc = Math.sqrt(disc);
  const t1 = (-b + sqrtdisc) / (2 * a);
  const t2 = (-b - sqrtdisc) / (2 * a);
  if ((0 < t1 && t1 < 1) || (0 < t2 && t2 < 1)) return true;
  return false;
}

// d=√((x2 – x1)² + (y2 – y1)²).
function getDistance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

drawDungeon();
