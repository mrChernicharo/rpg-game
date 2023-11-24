export function idMaker(length = 12) {
  const ID_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
  return Array(length)
    .fill(0)
    .map((_) => ID_CHARS.split("")[Math.round(Math.random() * ID_CHARS.length)])
    .join("");
}

export function getTurnDuration(speed: number) {
  return 1000 / speed;
}

export function calculateNextTurnTime(turn: any) {
  return turn.nextTurnAt + turn.turnDuration;
}
