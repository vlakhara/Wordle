import { useCallback, useEffect, useState } from "react";
import { DEFAULT_LENGTH, MAX_HINTS } from "./config";
import {
  clampLength,
  dateKey,
  getDailyWord,
  getRandomWord,
  isValidGuess,
  pickHintPosition,
  timeLimitSeconds,
  triesForLength,
} from "./logic";

const SETTINGS_KEY = "game-settings";
const DEFAULT_SETTINGS = { length: DEFAULT_LENGTH, mode: "daily", timer: false };

function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Storage can be blocked (private mode, full); the game still works without it.
  }
}

function loadSettings() {
  const saved = readStorage(SETTINGS_KEY, {});
  return {
    length: clampLength(saved.length) || DEFAULT_SETTINGS.length,
    mode: saved.mode === "practice" ? "practice" : "daily",
    timer: Boolean(saved.timer),
  };
}

function dailyKey(length) {
  return `game-daily-${dateKey()}-${length}`;
}

function createGame(settings, previousAnswer) {
  const daily = settings.mode === "daily";
  return {
    answer: daily
      ? getDailyWord(settings.length)
      : getRandomWord(settings.length, previousAnswer),
    guesses: [],
    hints: [], // revealed letter positions
    status: "playing", // playing | won | lost
    reason: null, // why it was lost: "tries" | "time"
    startedAt: null, // set on the first typed letter (used by the timer)
    timed: settings.timer,
  };
}

function loadGame(settings) {
  if (settings.mode === "daily") {
    const saved = readStorage(dailyKey(settings.length), null);
    if (saved && saved.answer === getDailyWord(settings.length)) return saved;
  }
  return createGame(settings);
}

export default function useGame() {
  const [settings, setSettings] = useState(loadSettings);
  const [game, setGame] = useState(() => loadGame(settings));
  const [current, setCurrent] = useState("");
  const [message, setMessage] = useState("");
  const [now, setNow] = useState(() => Date.now());

  const length = game.answer.length;
  const maxTries = triesForLength(length);
  const playing = game.status === "playing";
  const rowsUsed = game.guesses.length + game.hints.length;

  const flash = useCallback((text) => {
    setMessage(text);
  }, []);

  useEffect(() => {
    if (!message) return undefined;
    const id = setTimeout(() => setMessage(""), 1800);
    return () => clearTimeout(id);
  }, [message]);

  // Keep today's daily game across refreshes.
  useEffect(() => {
    if (settings.mode === "daily") {
      writeStorage(dailyKey(game.answer.length), game);
    }
  }, [game, settings.mode]);

  // Timer.
  const limit = timeLimitSeconds(length);
  let remaining = null;
  if (game.timed) {
    remaining = game.startedAt
      ? Math.max(0, limit - Math.floor((now - game.startedAt) / 1000))
      : limit;
  }

  useEffect(() => {
    if (!game.timed || !game.startedAt || !playing) return undefined;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [game.timed, game.startedAt, playing]);

  useEffect(() => {
    if (game.timed && game.startedAt && playing && remaining === 0) {
      setGame((g) => ({ ...g, status: "lost", reason: "time" }));
    }
  }, [game.timed, game.startedAt, playing, remaining]);

  const applySettings = useCallback((next) => {
    const merged = { ...next, length: clampLength(next.length) || DEFAULT_LENGTH };
    setSettings(merged);
    writeStorage(SETTINGS_KEY, merged);
    setGame(loadGame(merged));
    setCurrent("");
    setMessage("");
    setNow(Date.now());
  }, []);

  const changeSettings = useCallback(
    (changes) => applySettings({ ...settings, ...changes }),
    [applySettings, settings]
  );

  const newPracticeGame = useCallback(() => {
    const next = { ...settings, mode: "practice" };
    setSettings(next);
    writeStorage(SETTINGS_KEY, next);
    setGame(createGame(next, game.answer));
    setCurrent("");
    setMessage("");
    setNow(Date.now());
  }, [settings, game.answer]);

  const typeLetter = useCallback(
    (letter) => {
      if (!playing || current.length >= length) return;
      if (game.timed && !game.startedAt) {
        const start = Date.now();
        setNow(start);
        setGame((g) => ({ ...g, startedAt: start }));
      }
      setCurrent((c) => (c.length < length ? c + letter : c));
    },
    [playing, current.length, length, game.timed, game.startedAt]
  );

  const backspace = useCallback(() => {
    if (!playing) return;
    setCurrent((c) => c.slice(0, -1));
  }, [playing]);

  const submit = useCallback(() => {
    if (!playing) return;
    if (current.length < length) {
      flash("Not enough letters");
      return;
    }
    if (!isValidGuess(current, length)) {
      flash("Not in the word list");
      return;
    }
    const guesses = [...game.guesses, current];
    const won = current === game.answer;
    const lost = !won && guesses.length + game.hints.length >= maxTries;
    setGame({
      ...game,
      guesses,
      status: won ? "won" : lost ? "lost" : "playing",
      reason: lost ? "tries" : null,
    });
    setCurrent("");
  }, [playing, current, length, game, maxTries, flash]);

  const revealHint = useCallback(() => {
    if (!playing) return;
    if (game.hints.length >= MAX_HINTS) {
      flash("No hints left");
      return;
    }
    if (maxTries - rowsUsed <= 1) {
      flash("Not enough tries left for a hint");
      return;
    }
    const position = pickHintPosition(game.answer, game.guesses, game.hints);
    if (position === null) {
      flash("You already know every letter");
      return;
    }
    setGame({ ...game, hints: [...game.hints, position] });
  }, [playing, game, maxTries, rowsUsed, flash]);

  return {
    settings,
    changeSettings,
    game,
    current,
    message,
    length,
    maxTries,
    remaining,
    hintsLeft: MAX_HINTS - game.hints.length,
    typeLetter,
    backspace,
    submit,
    revealHint,
    newPracticeGame,
  };
}
