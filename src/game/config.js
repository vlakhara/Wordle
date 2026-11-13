// Change these to rename or retune the game.
export const GAME_NAME = "Wordle";

export const MIN_LENGTH = 4;
export const MAX_LENGTH = 8;
export const DEFAULT_LENGTH = 5;

// Longer words get more tries: tries = length + EXTRA_TRIES (4 letters -> 5 tries ... 8 letters -> 9 tries).
export const EXTRA_TRIES = 1;

// Timer (optional): seconds allowed per try. A 5-letter game has 6 tries -> 180 seconds.
export const SECONDS_PER_TRY = 30;

// Hints: each hint reveals one letter in its position and uses up one try.
export const MAX_HINTS = 2;

// The daily word is chosen by counting days since this date (local time).
export const DAILY_START = { year: 2026, month: 1, day: 1 };
