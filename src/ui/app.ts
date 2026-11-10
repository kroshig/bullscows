import { countPossibleSecrets } from '../core/combinatorics.js';
import {
  BaseOption,
  createInitialState,
  GameState,
  startRound,
  submitGuess,
  updateSettings,
} from '../core/gameState.js';
import { LeaderboardEntry, loadLeaderboard, saveRecord } from '../core/leaderboard.js';
import { createDigitValidator } from '../core/validator.js';
import { createElement } from './dom.js';

const LENGTH_OPTIONS = [2, 3, 4, 5, 6] as const;
const BASE_OPTIONS: readonly { label: string; value: BaseOption }[] = [
  { label: 'BIN (2)', value: 2 },
  { label: 'OCT (8)', value: 8 },
  { label: 'DEC (10)', value: 10 },
  { label: 'HEX (16)', value: 16 },
];

export const mountApp = (root: HTMLElement): void => {
  let state: GameState = createInitialState();
  let leaderboard: readonly LeaderboardEntry[] = loadLeaderboard();

  const setState = (nextState: GameState): void => {
    state = nextState;
    render();
  };

  const renderSettingsPanel = (): HTMLElement => {
    const isLocked = state.status !== 'settings';

    const baseButtons = BASE_OPTIONS.map((opt) => {
      const btn = createElement('button', {
        className: `btn-option ${state.settings.base === opt.value ? 'active' : ''}`,
        textContent: opt.label,
      });
      btn.disabled = isLocked;
      btn.addEventListener('click', () => {
        setState(updateSettings(state, { base: opt.value }));
      });
      return btn;
    });

    const lengthButtons = LENGTH_OPTIONS.map((len) => {
      const isUnavailable = len > state.settings.base;
      const btn = createElement('button', {
        className: `btn-option ${state.settings.length === len ? 'active' : ''}`,
        textContent: String(len),
      });
      btn.disabled = isLocked || isUnavailable;
      btn.addEventListener('click', () => {
        setState(updateSettings(state, { length: len }));
      });
      return btn;
    });

    const combinations = countPossibleSecrets(state.settings.length, state.settings.base);
    const infoText = createElement('p', {
      className: 'combinations-info',
      textContent: `Возможных секретных комбинаций: ${combinations}`,
    });

    const actionBtn = createElement('button', {
      className: 'btn-primary',
      textContent: state.status === 'settings' ? 'Начать игру' : 'Новая игра',
    });

    actionBtn.addEventListener('click', () => {
      if (state.status === 'settings') {
        setState(startRound(state, Date.now()));
      } else {
        setState(createInitialState(state.settings));
      }
    });

    return createElement('section', {
      className: 'panel',
      children: [
        createElement('h2', { textContent: 'Настройки раунда' }),
        createElement('div', {
          className: 'setting-group',
          children: [
            createElement('span', { textContent: 'Система счисления:' }),
            createElement('div', { className: 'button-row', children: baseButtons }),
          ],
        }),
        createElement('div', {
          className: 'setting-group',
          children: [
            createElement('span', { textContent: 'Длина числа (2–6):' }),
            createElement('div', { className: 'button-row', children: lengthButtons }),
          ],
        }),
        infoText,
        actionBtn,
      ],
    });
  };

  const renderGameArea = (): HTMLElement => {
    if (state.status === 'settings') {
      return createElement('section', {
        className: 'panel',
        children: [
          createElement('p', {
            textContent: 'Выберите настройки и нажмите «Начать игру».',
          }),
        ],
      });
    }

    const children: HTMLElement[] = [
      createElement('h2', {
        textContent:
          state.status === 'won'
            ? `Победа! Число ${state.secret.toUpperCase()} угадано за ${state.history.length} попыток (${state.elapsedSeconds} сек.)`
            : 'Угадайте секретное число',
      }),
    ];

    if (state.status === 'playing') {
      const isAllowedDigit = createDigitValidator(state.settings.base);
      const input = createElement('input', {
        className: 'guess-input',
        attributes: {
          type: 'text',
          maxLength: String(state.settings.length),
          placeholder: `Введите ${state.settings.length} уникальных символа`,
        },
      });

      input.addEventListener('input', () => {
        const filtered = [...input.value].filter(isAllowedDigit).join('');
        if (input.value !== filtered) {
          input.value = filtered;
        }
      });

      const submitBtn = createElement('button', {
        className: 'btn-primary',
        textContent: 'Проверить',
      });

      const handleGuess = (): void => {
        const prevStatus = state.status;
        const nextState = submitGuess(state, input.value, Date.now());
        if (prevStatus === 'playing' && nextState.status === 'won') {
          leaderboard = saveRecord({
            attempts: nextState.history.length,
            timeSeconds: nextState.elapsedSeconds,
            length: nextState.settings.length,
            base: nextState.settings.base,
            date: new Date().toLocaleDateString(),
          });
        }
        setState(nextState);
      };

      submitBtn.addEventListener('click', handleGuess);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleGuess();
      });

      children.push(
        createElement('div', {
          className: 'input-row',
          children: [input, submitBtn],
        }),
      );
    }

    if (state.errorMessage) {
      children.push(
        createElement('p', {
          className: 'error-msg',
          textContent: state.errorMessage,
        }),
      );
    }

    const historyItems = state.history.map((entry) =>
      createElement('li', {
        className: 'history-item',
        textContent: `#${entry.attemptNumber}: ${entry.guess.toUpperCase()} — Bulls: ${entry.result.bulls}, Cows: ${entry.result.cows}`,
      }),
    );

    children.push(
      createElement('h3', { textContent: 'История попыток' }),
      createElement('ul', { className: 'history-list', children: historyItems }),
    );

    return createElement('section', { className: 'panel', children });
  };

  const renderLeaderboard = (): HTMLElement => {
    const rows =
      leaderboard.length === 0
        ? [createElement('li', { textContent: 'Рекордов пока нет' })]
        : leaderboard.map((rec, idx) =>
            createElement('li', {
              className: 'leaderboard-item',
              textContent: `${idx + 1}. Попыток: ${rec.attempts} | Время: ${rec.timeSeconds}с | [Длина: ${rec.length}, Осн: ${rec.base}] (${rec.date})`,
            }),
          );

    return createElement('section', {
      className: 'panel',
      children: [
        createElement('h2', { textContent: 'Таблица рекордов' }),
        createElement('ul', { className: 'leaderboard-list', children: rows }),
      ],
    });
  };

  const render = (): void => {
    root.replaceChildren(
      createElement('header', {
        children: [createElement('h1', { textContent: 'Bulls and Cows' })],
      }),
      createElement('main', {
        className: 'app-grid',
        children: [renderSettingsPanel(), renderGameArea(), renderLeaderboard()],
      }),
    );
  };

  render();
};
