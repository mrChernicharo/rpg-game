export function idMaker(length = 12) {
  const ID_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
  return Array(length)
    .fill(0)
    .map((_) => ID_CHARS.split("")[Math.round(Math.random() * ID_CHARS.length)])
    .join("");
}
/**

1 sec == 4 ticks | 1 tick == 0.25sec

speed: 100 -> 10 ticks ->
|----------| 2.5s

speed: 50 -> 20 ticks -> 
|----------|----------| 5s

speed: 25 -> 40 ticks -> 
|----------|----------|----------|----------| 10s

*/
export function getTurnDuration(speed: number) {
  return 1000 / speed;
}

export function calculateNextTurnTime(turn: any) {
  return turn.nextTurnAt + turn.turnDuration;
}

/** wait for x milliseconds */
export const wait = async (timeInMilliseconds: number): Promise<void> => {
  console.log(`wait ${timeInMilliseconds}ms ................................`);
  return new Promise((resolve) => setTimeout(resolve, timeInMilliseconds));
};
