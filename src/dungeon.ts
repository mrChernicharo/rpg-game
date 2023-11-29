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
let py = -20;
let speed = 5;

const MID_W = canvas.width / 2;
const MID_H = canvas.height / 2;

window.onkeydown = (e: KeyboardEvent) => {
  console.log(e);
  keyMap[e.key] = true;
};

window.onkeyup = (e: KeyboardEvent) => {
  keyMap[e.key] = false;
};

function drawDungeon() {
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
  //   console.log("draw");
  ctx.clearRect(0, 0, 1000, 1000);

  // player
  ctx.beginPath();
  ctx.arc(MID_W, MID_W, 20, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();

  // player outline
  ctx.beginPath();
  ctx.arc(MID_W, MID_W, 40, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.stroke();
  ctx.closePath();

  // lines
  ctx.beginPath();
  ctx.moveTo(MID_W - px, 0 - py);
  ctx.lineTo(MID_W - px, canvas.height - py);
  ctx.moveTo(0 - px, MID_H - py);
  ctx.lineTo(canvas.width - px, MID_H - py);
  ctx.stroke();
  ctx.closePath();

  //   console.log(ctx.getTransform().toJSON());
  //   console.log(ctx.getContextAttributes());
  requestAnimationFrame(drawDungeon);
}

drawDungeon();
