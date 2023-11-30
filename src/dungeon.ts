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

// ctx.save();

let px = 100;
let py = -100;
let speed = 2;

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

function drawDungeon() {
  handlePlayerMovement();
  //   console.log("draw");
  ctx.clearRect(0, 0, 1000, 1000);

  const lineVert = { ax: MID_W - px, ay: 0 - py, bx: MID_W - px, by: FUL_H - py };
  const lineHoriz = { ax: 0 - px, ay: MID_H - py, bx: FUL_W - px, by: MID_H - py };
  const circle = { cx: MID_W, cy: MID_H, r: 40 };

  // player
  ctx.beginPath();
  ctx.arc(circle.cx, circle.cy, 20, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();

  // player outline
  ctx.beginPath();
  ctx.arc(circle.cx, circle.cy, circle.r, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.stroke();
  ctx.closePath();

  // lines
  ctx.beginPath();
  ctx.moveTo(lineVert.ax, lineVert.ay);
  ctx.lineTo(lineVert.bx, lineVert.by);
  ctx.moveTo(lineHoriz.ax, lineHoriz.ay);
  ctx.lineTo(lineHoriz.bx, lineHoriz.by);
  ctx.stroke();
  ctx.closePath();

  console.log(
    "horiz:",
    checkLineIntersectsCircle(lineHoriz, circle),
    "vert:",
    checkLineIntersectsCircle(lineVert, circle)
  );

  //   console.log(ctx.isPointInStroke(MID_W, MID_H));
  //   console.log(ctx.getTransform().toJSON());
  //   console.log(ctx.getContextAttributes());
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

drawDungeon();
