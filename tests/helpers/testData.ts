import { randomUserName } from './randomizer';
import { Timeouts } from '../../src/constants/timeouts';

export interface UserProfileData {
  name: string;
  renamed: string;
}

export interface TestUsers {
  primary: UserProfileData;
  unknown: string;
}

export interface GameConfig {
  maxTerminalAttempts: number;
  maxMovesPerAttempt: number;
  terminalTestTimeoutMs: number;
}

export const users: TestUsers = {
  primary: {
    name: randomUserName('p0-user'),
    renamed: randomUserName('p0-user-updated'),
  },
  unknown: randomUserName('no-such-user'),
};

export const gameConfig: GameConfig = {
  maxTerminalAttempts: 15,
  maxMovesPerAttempt: 30,
  terminalTestTimeoutMs: Timeouts.terminalTimeout,
};
