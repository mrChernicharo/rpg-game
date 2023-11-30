import { DUNGEON_MAPS } from "./data";
import { ctx, canvas } from "./dom";

let frameID = -1;

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

  const hasTopNeighbor = currentCell.row > 0;
  if (hasTopNeighbor) {
    const topNeighbor = map[currentCell.row - 1][currentCell.col];
    const topNeighborIsWall = topNeighbor === 1;

    if (checkLineIntersectsCircle(topLine, pOuterCircle)) {
      if (topNeighborIsWall) {
        if (!wallCollision.top) {
          // console.log("wall collision");
          wallCollision.top = true;
        }
      } else {
        // console.log("intersection, but no collision");
        if (wallCollision.top) {
          wallCollision.top = false;
        }
      }
    } else {
      //   console.log("no top intersection");
      if (wallCollision.top) {
        wallCollision.top = false;
      }
    }
  }

  const hasBottomNeighbor = currentCell.row < rows - 1;
  if (hasBottomNeighbor) {
    const bottomNeighbor = map[currentCell.row + 1][currentCell.col];
    const bottomNeighborIsWall = bottomNeighbor === 1;

    if (checkLineIntersectsCircle(bottomLine, pOuterCircle)) {
      if (bottomNeighborIsWall) {
        if (!wallCollision.bottom) {
          //   console.log("bottom collision");
          wallCollision.bottom = true;
        }
      } else {
        //   console.log("intersection, but no collision");
        if (wallCollision.bottom) {
          wallCollision.bottom = false;
        }
      }
    } else {
      //   console.log("no bottom intersection");
      if (wallCollision.bottom) {
        wallCollision.bottom = false;
      }
    }
  }

  const hasLeftNeighbor = currentCell.col > 0;
  if (hasLeftNeighbor) {
    const leftNeighbor = map[currentCell.row][currentCell.col - 1];
    const leftNeighborIsWall = leftNeighbor === 1;

    if (checkLineIntersectsCircle(leftLine, pOuterCircle)) {
      if (leftNeighborIsWall) {
        if (!wallCollision.left) {
          //   console.log("left collision");
          wallCollision.left = true;
        }
      } else {
        //   console.log("intersection, but no collision");
        if (wallCollision.left) {
          wallCollision.left = false;
        }
      }
    } else {
      //   console.log("no left intersection");
      if (wallCollision.left) {
        wallCollision.left = false;
      }
    }
  }

  const hasRightNeighbor = currentCell.col < cols - 1;
  if (hasRightNeighbor) {
    const rightNeighbor = map[currentCell.row][currentCell.col + 1];
    const rightNeighborIsWall = rightNeighbor === 1;

    if (checkLineIntersectsCircle(rightLine, pOuterCircle)) {
      if (rightNeighborIsWall) {
        if (!wallCollision.right) {
          //   console.log("right collision");
          wallCollision.right = true;
        }
      } else {
        //   console.log("intersection, but no collision");
        if (wallCollision.right) {
          wallCollision.right = false;
        }
      }
    } else {
      //   console.log("no right intersection");
      if (wallCollision.right) {
        wallCollision.right = false;
      }
    }
  }

  //   player outline
  ctx.beginPath();
  ctx.arc(pCircle.cx, pCircle.cy, pCircle.r * 2, 0, Math.PI * 2);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.closePath();

  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";

  const hasBLNeighbor = hasBottomNeighbor && hasLeftNeighbor;
  if (hasBLNeighbor) {
    const [nRow, nCol] = [currentCell.row + 1, currentCell.col - 1];
    const BLNeighbor = map[nRow][nCol];

    if (BLNeighbor === 1 && ctx.isPointInPath(nCol * CELL_SIZE + CELL_SIZE - px, nRow * CELL_SIZE - py)) {
      console.log("this BottomLeftNeighbor is too damn close");

      if (!wallCollision.left) {
        wallCollision.left = true;
      }
      if (!wallCollision.bottom) {
        wallCollision.bottom = true;
      }
    }
  }

  const hasBRNeighbor = hasBottomNeighbor && hasRightNeighbor;
  if (hasBRNeighbor) {
    const [nRow, nCol] = [currentCell.row + 1, currentCell.col + 1];
    const BRNeighbor = map[nRow][nCol];

    if (BRNeighbor === 1 && ctx.isPointInPath(nCol * CELL_SIZE - px, nRow * CELL_SIZE - py)) {
      //   console.log("this BottomRightNeighbor is too damn close");

      if (!wallCollision.right) {
        wallCollision.right = true;
      }
      if (!wallCollision.bottom) {
        wallCollision.bottom = true;
      }
    }
  }

  const hasTLNeighbor = hasTopNeighbor && hasLeftNeighbor;
  if (hasTLNeighbor) {
    const [nRow, nCol] = [currentCell.row - 1, currentCell.col - 1];
    const TLNeighbor = map[nRow][nCol];

    if (TLNeighbor === 1 && ctx.isPointInPath(nCol * CELL_SIZE + CELL_SIZE - px, nRow * CELL_SIZE + CELL_SIZE - py)) {
      console.log("this TopLeftNeighbor is too close");

      if (!wallCollision.left) {
        wallCollision.left = true;
      }
      if (!wallCollision.top) {
        wallCollision.top = true;
      }
    }
  }

  const hasTRNeighbor = hasTopNeighbor && hasRightNeighbor;
  if (hasTRNeighbor) {
    const [nRow, nCol] = [currentCell.row - 1, currentCell.col + 1];
    const TRNeighbor = map[nRow][nCol];

    if (TRNeighbor === 1 && ctx.isPointInPath(nCol * CELL_SIZE - px, nRow * CELL_SIZE + CELL_SIZE - py)) {
      console.log("this TopRightNeighbor is too close");

      if (!wallCollision.right) {
        wallCollision.right = true;
      }
      if (!wallCollision.top) {
        wallCollision.top = true;
      }
    }
  }

  frameID = requestAnimationFrame(drawDungeon);
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
