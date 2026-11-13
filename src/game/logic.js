import {
  DAILY_START,
  EXTRA_TRIES,
  MAX_LENGTH,
  MIN_LENGTH,
  SECONDS_PER_TRY,
} from "./config";
import { ANSWERS, VALID_GUESSES } from "./words";

export const CORRECT = "correct"; // right letter, right place
export const PRESENT = "present"; // right letter, wrong place
export const ABSENT = "absent"; // letter not in the word (or already used up)

export function clampLength(length) {
  const n = Number(length);
  if (!Number.isInteger(n)) return null;
  return n >= MIN_LENGTH && n <= MAX_LENGTH ? n : null;
}

export function triesForLength(length) {
  return length + EXTRA_TRIES;
}

export function timeLimitSeconds(length) {
  return triesForLength(length) * SECONDS_PER_TRY;
}

/**
 * Colours a guess against the answer.
 * Repeated letters are handled like the original game: a letter is only marked
 * as many times as it actually appears in the answer.
 */
export function evaluateGuess(guess, answer) {
  const result = new Array(answer.length).fill(ABSENT);
  const remaining = {};

  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === answer[i]) {
      result[i] = CORRECT;
    } else {
      remaining[answer[i]] = (remaining[answer[i]] || 0) + 1;
    }
  }
  for (let i = 0; i < answer.length; i++) {
    if (result[i] === CORRECT) continue;
    if (remaining[guess[i]] > 0) {
      result[i] = PRESENT;
      remaining[guess[i]] -= 1;
    }
  }
  return result;
}

const RANK = { [ABSENT]: 1, [PRESENT]: 2, [CORRECT]: 3 };

/** Best known status for each letter, for colouring the on-screen keyboard. */
export function keyStatuses(guesses, answer) {
  const statuses = {};
  for (const guess of guesses) {
    const result = evaluateGuess(guess, answer);
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      if (!statuses[letter] || RANK[result[i]] > RANK[statuses[letter]]) {
        statuses[letter] = result[i];
      }
    }
  }
  return statuses;
}

export function isValidGuess(word, length) {
  if (word.length !== length || !/^[A-Z]+$/.test(word)) return false;
  const dictionary = VALID_GUESSES[length];
  if (!dictionary || dictionary.length === 0) return true;
  return dictionary.includes(word) || ANSWERS[length].includes(word);
}

function localDayNumber(date) {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000
  );
}

export function dayIndex(date = new Date()) {
  const start = Date.UTC(
    DAILY_START.year,
    DAILY_START.month - 1,
    DAILY_START.day
  );
  return localDayNumber(date) - Math.floor(start / 86400000);
}

/** YYYY-MM-DD in the player's local time; used to key saved daily games. */
export function dateKey(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
}

/** Same word for everyone on the same day (and length). */
export function getDailyWord(length, date = new Date()) {
  const list = ANSWERS[length];
  const index = ((dayIndex(date) % list.length) + list.length) % list.length;
  return list[index];
}

export function getRandomWord(length, exclude) {
  const list = ANSWERS[length];
  let word = list[Math.floor(Math.random() * list.length)];
  if (exclude && list.length > 1) {
    while (word === exclude) {
      word = list[Math.floor(Math.random() * list.length)];
    }
  }
  return word;
}

/**
 * Picks a letter position to reveal: one the player hasn't already found
 * (no green tile there yet) and hasn't already been hinted. Returns null if none.
 */
export function pickHintPosition(answer, guesses, hinted, random = Math.random) {
  const found = new Set(hinted);
  for (const guess of guesses) {
    const result = evaluateGuess(guess, answer);
    result.forEach((status, i) => {
      if (status === CORRECT) found.add(i);
    });
  }
  const options = [];
  for (let i = 0; i < answer.length; i++) {
    if (!found.has(i)) options.push(i);
  }
  if (options.length === 0) return null;
  return options[Math.floor(random() * options.length)];
}
