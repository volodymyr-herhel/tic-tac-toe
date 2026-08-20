import { gameConfig } from './testData';

export interface TerminalPlayable {
  tryPlayToTerminal: (maxMoves?: number) => Promise<boolean>;
  newGame: () => Promise<void>;
}

export async function completeTerminalGame(
  play: TerminalPlayable,
  reseedRandom: (seed: number) => Promise<void>,
): Promise<boolean> {
  let reachedTerminal = false;
  for (let attempt = 0; attempt < gameConfig.maxTerminalAttempts; attempt += 1) {
    await reseedRandom(Date.now() + attempt + 101);
    reachedTerminal = await play.tryPlayToTerminal(gameConfig.maxMovesPerAttempt);
    if (reachedTerminal) {
      return true;
    }
    await play.newGame();
  }
  return reachedTerminal;
}
