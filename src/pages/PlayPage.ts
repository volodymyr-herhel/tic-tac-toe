import { expect } from '@playwright/test';
import { Difficulty } from '../constants/enums';
import { Timeouts } from '../constants/timeouts';
import { BasePage } from './BasePage';

export class PlayPage extends BasePage {
  async expectReady(): Promise<void> {
    await this.expectVisible('view-play');
    await this.expectVisible('board');
    await this.expectVisible('status');
  }

  cell(index: number) {
    return this.byTestId(`cell-${index}`);
  }

  async clickCell(index: number): Promise<void> {
    const targetCell = this.cell(index);
    await expect(targetCell).toBeVisible();
    await expect(targetCell).toBeEnabled();
    await targetCell.click();
  }

  async cellState(index: number): Promise<string | null> {
    return this.cell(index).getAttribute('data-state');
  }

  async boardState(): Promise<Array<string | null>> {
    const states: Array<string | null> = [];
    for (let i = 0; i < 9; i += 1) {
      states.push(await this.cellState(i));
    }
    return states;
  }

  async countState(mark: 'x' | 'o'): Promise<number> {
    const state = await this.boardState();
    return state.filter((value) => value === mark).length;
  }

  async setDifficulty(value: Difficulty): Promise<void> {
    await this.byTestId('select-difficulty').selectOption(value);
  }

  async selectedDifficulty(): Promise<string> {
    return this.byTestId('select-difficulty').inputValue();
  }

  async clickReset(): Promise<void> {
    await this.byTestId('btn-reset').click();
  }

  async clickHint(): Promise<void> {
    await this.byTestId('btn-hint').click();
  }

  async expectHintDisabled(): Promise<void> {
    await expect(this.byTestId('btn-hint')).toBeDisabled();
  }

  async expectHintEnabled(): Promise<void> {
    await expect(this.byTestId('btn-hint')).toBeEnabled();
  }

  async waitForAiMove(previousOCount: number): Promise<void> {
    await expect
      .poll(async () => this.countState('o'), {
        message: 'Expected AI to place exactly one O',
        timeout: Timeouts.longTimeout,
      })
      .toBeGreaterThan(previousOCount);
  }

  async waitForAiMoveOrTerminal(previousOCount: number): Promise<void> {
    await expect
      .poll(async () => {
        const terminal = await this.isTerminal();
        const oCount = await this.countState('o');
        return terminal || oCount > previousOCount;
      }, {
        message: 'Expected AI move or terminal game state after user move',
        timeout: Timeouts.longTimeout,
      })
      .toBe(true);
  }

  async waitForPlayableTurnOrTerminal(): Promise<void> {
    await expect
      .poll(async () => {
        const status = await this.byTestId('status').getAttribute('data-status');
        return status === 'user' || status === 'win' || status === 'lose' || status === 'draw';
      }, {
        message: 'Expected user turn or terminal game state before next action',
        timeout: Timeouts.longTimeout,
      })
      .toBe(true);
  }

  async enabledEmptyCellIndices(): Promise<number[]> {
    return this.page.evaluate(() => {
      const cells = Array.from(document.querySelectorAll('[data-testid^="cell-"]')) as HTMLButtonElement[];
      return cells
        .filter((cell) => !cell.disabled && (cell.dataset.state === 'empty' || !cell.dataset.state))
        .map((cell) => Number(cell.dataset.index));
    });
  }

  async expectUserMovedAt(index: number): Promise<void> {
    await expect(this.cell(index)).toHaveAttribute('data-state', 'x');
  }

  async expectCellDisabled(index: number): Promise<void> {
    await expect(this.cell(index)).toBeDisabled();
  }

  async playUntilTerminal(maxMoves = 9): Promise<void> {
    let attempts = 0;
    while (attempts < maxMoves && !(await this.isTerminal())) {
      await expect
        .poll(async () => {
          if (await this.isTerminal()) {
            return true;
          }
          const enabled = await this.enabledEmptyCellIndices();
          return enabled.length > 0;
        }, {
          message: 'Expected terminal state or an enabled empty cell',
          timeout: Timeouts.longTimeout,
        })
        .toBe(true);

      if (await this.isTerminal()) {
        break;
      }

      const enabled = await this.enabledEmptyCellIndices();
      if (enabled.length === 0) {
        break;
      }

      await this.clickCell(enabled[0]);
      attempts += 1;
    }
  }

  async isTerminal(): Promise<boolean> {
    const status = await this.byTestId('status').getAttribute('data-status');
    return status === 'win' || status === 'lose' || status === 'draw';
  }

  async expectTerminal(): Promise<void> {
    await expect
      .poll(async () => this.isTerminal(), {
        message: 'Expected game to reach terminal state',
        timeout: Timeouts.longTimeout,
      })
      .toBe(true);
  }

  async tryPlayToTerminal(maxMoves = 12): Promise<boolean> {
    let moves = 0;

    while (moves < maxMoves) {
      if (await this.isTerminal()) {
        return true;
      }

      let enabled = await this.enabledEmptyCellIndices();
      if (enabled.length === 0) {
        const progressed = await expect
          .poll(async () => {
            if (await this.isTerminal()) {
              return true;
            }
            const playable = await this.enabledEmptyCellIndices();
            return playable.length > 0;
          }, {
            message: 'Expected board to become playable or terminal',
            timeout: Timeouts.shortTimeout,
          })
          .toBe(true)
          .then(() => true)
          .catch(() => false);

        if (!progressed) {
          return false;
        }

        if (await this.isTerminal()) {
          return true;
        }
        enabled = await this.enabledEmptyCellIndices();
        if (enabled.length === 0) {
          return false;
        }
      }

      const choice = enabled[Math.floor(Math.random() * enabled.length)];
      const oBefore = await this.countState('o');
      await this.clickCell(choice);

      const advanced = await expect
        .poll(async () => {
          if (await this.isTerminal()) {
            return true;
          }
          const oNow = await this.countState('o');
          const playable = await this.enabledEmptyCellIndices();
          return oNow > oBefore || playable.length > 0;
        }, {
          message: 'Expected AI response or playable board after user move',
          timeout: Timeouts.shortTimeout,
        })
        .toBe(true)
        .then(() => true)
        .catch(() => false);

      if (!advanced) {
        return false;
      }

      moves += 1;
    }

    return this.isTerminal();
  }

  async newGame(): Promise<void> {
    await expect(this.byTestId('btn-new')).toBeVisible();
    await this.byTestId('btn-new').click();
  }
}
