import { DUNGEON_MAPS } from "./data/static";
import { ctx, canvas, playPauseBtn, getModalOverlay } from "./dom";

let frameID = -1;
let isPaused = true;

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
  tl: false,
  tr: false,
  bl: false,
  br: false,
};

const CELL_SIZE = 100;
const map = DUNGEON_MAPS[0].map;
const [cols, rows] = [map[0].length, map.length];
// ctx.save();

let px = 0;
let py = 0;
let speed = 3;

console.log({ rows, cols });

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

playPauseBtn.onclick = () => {
  if (isPaused) {
    isPaused = false;
    playPauseBtn.textContent = "Pause";
    playLoop();
  } else {
    isPaused = true;
    playPauseBtn.textContent = "Play";

    cancelAnimationFrame(frameID);
  }
};

function handlePlayerMovement() {
  if (!wallCollision.top && (keyMap.w || keyMap.ArrowUp)) {
    py -= speed;
  }
  if (!wallCollision.bottom && (keyMap.s || keyMap.ArrowDown)) {
    py += speed;
  }
  if (!wallCollision.left && (keyMap.a || keyMap.ArrowLeft)) {
    px -= speed;
  }
  if (!wallCollision.right && (keyMap.d || keyMap.ArrowRight)) {
    px += speed;
  }

  if (wallCollision.tr && (keyMap.w || keyMap.ArrowUp || keyMap.d || keyMap.ArrowRight)) {
    px -= speed;
    py += speed;
  }

  if (wallCollision.tl && (keyMap.w || keyMap.ArrowUp || keyMap.a || keyMap.ArrowLeft)) {
    px += speed;
    py += speed;
  }

  if (wallCollision.br && (keyMap.s || keyMap.ArrowDown || keyMap.d || keyMap.ArrowRight)) {
    px -= speed;
    py -= speed;
  }

  if (wallCollision.bl && (keyMap.s || keyMap.ArrowDown || keyMap.a || keyMap.ArrowLeft)) {
    px += speed;
    py -= speed;
  }
}

function playLoop() {
  drawDungeon();
  frameID = requestAnimationFrame(playLoop);
}

const CELL_COLORS = ["orange", "brown"];
const pCircle = { cx: MID_W, cy: MID_H, r: 20 };
const pOuterCircle = { cx: MID_W, cy: MID_H, r: 40 };

function drawDungeon() {
  handlePlayerMovement();
  ctx.clearRect(0, 0, 1000, 1000);

  // let closestX, closestY
  let smallestDist = Infinity;
  let currentCell = { row: 0, col: 0, x: 0, y: 0 };
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
        currentCell = { row, col, x: col * CELL_SIZE, y: row * CELL_SIZE };
      }
    }
  }

  // draw vertical lines
  for (let col = 0; col < cols + 1; col++) {
    ctx.beginPath();
    ctx.moveTo(col * CELL_SIZE - px, 0 - py);
    ctx.lineTo(col * CELL_SIZE - px, rows * CELL_SIZE - py);
    ctx.stroke();
    ctx.closePath();
  }
  // draw horizontal lines
  for (let row = 0; row < rows + 1; row++) {
    ctx.beginPath();
    ctx.moveTo(0 - px, row * CELL_SIZE - py);
    ctx.lineTo(cols * CELL_SIZE - px, row * CELL_SIZE - py);
    ctx.stroke();
    ctx.closePath();
  }

  const topLine = {
    ax: currentCell.x - CELL_SIZE - px,
    ay: currentCell.y - py,
    bx: currentCell.x + CELL_SIZE + CELL_SIZE - px,
    by: currentCell.y - py,
  };

  const bottomLine = {
    ax: currentCell.x - CELL_SIZE - px,
    ay: currentCell.y + CELL_SIZE - py,
    bx: currentCell.x + CELL_SIZE + CELL_SIZE - px,
    by: currentCell.y + CELL_SIZE - py,
  };

  const leftLine = {
    ax: currentCell.x - px,
    ay: currentCell.y - CELL_SIZE - py,
    bx: currentCell.x - px,
    by: currentCell.y + CELL_SIZE + CELL_SIZE - py,
  };

  const rightLine = {
    ax: currentCell.x + CELL_SIZE - px,
    ay: currentCell.y - CELL_SIZE - py,
    bx: currentCell.x + CELL_SIZE - px,
    by: currentCell.y + CELL_SIZE + CELL_SIZE - py,
  };

  ctx.beginPath();
  ctx.moveTo(topLine.ax, topLine.ay);
  ctx.lineTo(topLine.bx, topLine.by);
  ctx.strokeStyle = "red";
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(bottomLine.ax, bottomLine.ay);
  ctx.lineTo(bottomLine.bx, bottomLine.by);
  ctx.strokeStyle = "lightgreen";
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(leftLine.ax, leftLine.ay);
  ctx.lineTo(leftLine.bx, leftLine.by);
  ctx.strokeStyle = "lightblue";
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(rightLine.ax, rightLine.ay);
  ctx.lineTo(rightLine.bx, rightLine.by);
  ctx.strokeStyle = "orange";
  ctx.stroke();
  ctx.closePath();

  ctx.strokeStyle = "black";

  // player
  ctx.beginPath();
  ctx.arc(pCircle.cx, pCircle.cy, pCircle.r, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();

  //   player outline
  ctx.beginPath();
  ctx.arc(pCircle.cx, pCircle.cy, pCircle.r * 2, 0, Math.PI * 2);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.closePath();

  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";

  const hasTopNeighbor = currentCell.row > 0;
  if (hasTopNeighbor) {
    const topNeighbor = map[currentCell.row - 1][currentCell.col];
    const topNeighborIsWall = topNeighbor === 1;

    if (checkLineIntersectsCircle(topLine, pOuterCircle)) {
      if (topNeighborIsWall) {
        // console.log("wall collision");
        if (!wallCollision.top) wallCollision.top = true;
      } else {
        // console.log("intersection, but no collision");
        if (wallCollision.top) wallCollision.top = false;
      }
    } else {
      //   console.log("no top intersection");
      if (wallCollision.top) wallCollision.top = false;
    }
  }

  const hasBottomNeighbor = currentCell.row < rows - 1;
  if (hasBottomNeighbor) {
    const bottomNeighbor = map[currentCell.row + 1][currentCell.col];
    const bottomNeighborIsWall = bottomNeighbor === 1;

    if (checkLineIntersectsCircle(bottomLine, pOuterCircle)) {
      if (bottomNeighborIsWall) {
        if (!wallCollision.bottom) wallCollision.bottom = true;
      } else {
        if (wallCollision.bottom) wallCollision.bottom = false;
      }
    } else {
      if (wallCollision.bottom) wallCollision.bottom = false;
    }
  }

  const hasLeftNeighbor = currentCell.col > 0;
  if (hasLeftNeighbor) {
    const leftNeighbor = map[currentCell.row][currentCell.col - 1];
    const leftNeighborIsWall = leftNeighbor === 1;

    if (checkLineIntersectsCircle(leftLine, pOuterCircle)) {
      if (leftNeighborIsWall) {
        if (!wallCollision.left) wallCollision.left = true;
      } else {
        if (wallCollision.left) wallCollision.left = false;
      }
    } else {
      if (wallCollision.left) wallCollision.left = false;
    }
  }

  const hasRightNeighbor = currentCell.col < cols - 1;
  if (hasRightNeighbor) {
    const rightNeighbor = map[currentCell.row][currentCell.col + 1];
    const rightNeighborIsWall = rightNeighbor === 1;

    if (checkLineIntersectsCircle(rightLine, pOuterCircle)) {
      if (rightNeighborIsWall) {
        if (!wallCollision.right) wallCollision.right = true;
      } else {
        if (wallCollision.right) wallCollision.right = false;
      }
    } else {
      if (wallCollision.right) wallCollision.right = false;
    }
  }

  /* TL, TR, BL, BR */

  const hasTLNeighbor = hasTopNeighbor && hasLeftNeighbor;
  if (hasTLNeighbor) {
    const [nRow, nCol] = [currentCell.row - 1, currentCell.col - 1];
    const TLNeighbor = map[nRow][nCol];

    const isTLNeighborWall = TLNeighbor === 1;
    const isInPath = ctx.isPointInPath(nCol * CELL_SIZE + CELL_SIZE - px, nRow * CELL_SIZE + CELL_SIZE - py);

    if (isInPath) {
      if (isTLNeighborWall) {
        if (!wallCollision.tl) wallCollision.tl = true;
      } else {
        if (wallCollision.tl) wallCollision.tl = false;
      }
    } else {
      if (wallCollision.tl) wallCollision.tl = false;
    }
  }

  const hasTRNeighbor = hasTopNeighbor && hasRightNeighbor;
  if (hasTRNeighbor) {
    const [nRow, nCol] = [currentCell.row - 1, currentCell.col + 1];
    const TRNeighbor = map[nRow][nCol];

    const isTRNeighborWall = TRNeighbor === 1;
    const isInPath = ctx.isPointInPath(nCol * CELL_SIZE - px, nRow * CELL_SIZE + CELL_SIZE - py);

    if (isInPath) {
      if (isTRNeighborWall) {
        if (!wallCollision.tr) wallCollision.tr = true;
      } else {
        if (wallCollision.tr) wallCollision.tr = false;
      }
    } else {
      if (wallCollision.tr) wallCollision.tr = false;
    }
  }

  const hasBLNeighbor = hasBottomNeighbor && hasLeftNeighbor;
  if (hasBLNeighbor) {
    const [nRow, nCol] = [currentCell.row + 1, currentCell.col - 1];
    const BLNeighbor = map[nRow][nCol];

    const isBLNeighborWall = BLNeighbor === 1;
    const isInPath = ctx.isPointInPath(nCol * CELL_SIZE + CELL_SIZE - px, nRow * CELL_SIZE - py);

    if (isInPath) {
      if (isBLNeighborWall) {
        if (!wallCollision.bl) wallCollision.bl = true;
      } else {
        if (wallCollision.bl) wallCollision.bl = false;
      }
    } else {
      if (wallCollision.bl) wallCollision.bl = false;
    }
  }

  const hasBRNeighbor = hasBottomNeighbor && hasRightNeighbor;
  if (hasBRNeighbor) {
    const [nRow, nCol] = [currentCell.row + 1, currentCell.col + 1];
    const BRNeighbor = map[nRow][nCol];

    const isNeighborWall = BRNeighbor === 1;
    const isInPath = ctx.isPointInPath(nCol * CELL_SIZE - px, nRow * CELL_SIZE - py);

    if (isInPath) {
      if (isNeighborWall) {
        if (!wallCollision.br) wallCollision.br = true;
      } else {
        if (wallCollision.br) wallCollision.br = false;
      }
    } else {
      if (wallCollision.br) wallCollision.br = false;
    }
  }

  // const { top, right, bottom, left, ...rest } = wallCollision;
  // console.log({ top, right, bottom, left });
  // console.log(rest);
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
