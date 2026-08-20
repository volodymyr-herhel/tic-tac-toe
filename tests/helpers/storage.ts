import type { Page } from '@playwright/test';
import { Difficulty, GameResult } from '../../src/constants/enums';

export type HistoryResult = GameResult;
export type DifficultyLevel = Difficulty;

export async function appendHistoryEntry(
  page: Page,
  userName: string,
  difficulty: DifficultyLevel,
  result: HistoryResult,
): Promise<void> {
  await page.evaluate(
    ({ name, level, outcome }) => {
      const raw = localStorage.getItem('ttt:users') ?? '{}';
      const users = JSON.parse(raw) as Record<string, {
        name: string;
        createdAt: number;
        difficulty: string;
        history: Array<{ finishedAt: number; difficulty: string; result: string }>;
      }>;

      const key = Object.keys(users).find((k) => k.toLowerCase() === name.toLowerCase()) ?? name.toLowerCase();
      const current = users[key] ?? {
        name,
        createdAt: Date.now(),
        difficulty: Difficulty.Easy,
        history: [],
      };

      current.history.push({
        finishedAt: Date.now(),
        difficulty: level,
        result: outcome,
      });

      users[key] = current;
      localStorage.setItem('ttt:users', JSON.stringify(users));
    },
    { name: userName, level: difficulty, outcome: result },
  );
}
