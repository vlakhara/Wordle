import { useEffect, useState } from "react";
import "./App.css";
import Board from "./component/Board";
import HowToPlay from "./component/HowToPlay";
import Keyboard from "./component/Keyboard";
import Navbar from "./component/Navbar";
import Settings from "./component/Settings";
import { GAME_NAME } from "./game/config";
import { keyStatuses } from "./game/logic";
import useGame from "./game/useGame";

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function App() {
  const [panel, setPanel] = useState(null); // null | "help" | "settings"
  const {
    settings,
    changeSettings,
    game,
    current,
    message,
    length,
    maxTries,
    remaining,
    hintsLeft,
    typeLetter,
    backspace,
    submit,
    revealHint,
    newPracticeGame,
  } = useGame();

  const playing = game.status === "playing";
  const triesLeft = maxTries - game.guesses.length - game.hints.length;

  useEffect(() => {
    const onKeyDown = (e) => {
      if (panel || e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      if (e.key === "Enter") {
        if (tag === "BUTTON") return; // let the focused button handle it
        submit();
      } else if (e.key === "Backspace") {
        backspace();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        typeLetter(e.key.toUpperCase());
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [panel, submit, backspace, typeLetter]);

  const hintSlots = game.answer
    .split("")
    .map((letter, i) => (game.hints.includes(i) ? letter : "_"));

  return (
    <div className="prevent-select app">
      <Navbar
        title={GAME_NAME}
        onHelp={() => setPanel(panel === "help" ? null : "help")}
        onSettings={() => setPanel(panel === "settings" ? null : "settings")}
      />

      <div className="statusBar">
        <span>{settings.mode === "daily" ? "Daily word" : "Practice"}</span>
        <span>{length} letters</span>
        <span>{triesLeft} {triesLeft === 1 ? "try" : "tries"} left</span>
        {remaining !== null && (
          <span className={remaining <= 10 && game.startedAt ? "timeLow" : ""}>
            ⏱ {formatTime(remaining)}
          </span>
        )}
      </div>

      <div className="toastSpace">
        {message && <div className="toast">{message}</div>}
      </div>

      {game.hints.length > 0 && (
        <div className="hintSlots" aria-label="Hinted letters">
          {hintSlots.map((slot, i) => (
            <span key={i} className={slot === "_" ? "slot" : "slot slotRevealed"}>
              {slot}
            </span>
          ))}
        </div>
      )}

      <Board
        length={length}
        maxTries={maxTries}
        guesses={game.guesses}
        current={current}
        answer={game.answer}
        hints={game.hints}
        status={game.status}
      />

      {playing ? (
        <button
          className="actionButton"
          onMouseDown={(e) => e.preventDefault()}
          onClick={revealHint}
          disabled={hintsLeft === 0}
        >
          Hint ({hintsLeft} left)
        </button>
      ) : (
        <div className="result">
          <p className="resultTitle">
            {game.status === "won"
              ? `You got it in ${game.guesses.length} ${
                  game.guesses.length === 1 ? "try" : "tries"
                }!`
              : game.reason === "time"
              ? "Time's up!"
              : "Out of tries!"}
          </p>
          {game.status === "lost" && (
            <p>
              The word was <strong>{game.answer}</strong>.
            </p>
          )}
          {settings.mode === "daily" && (
            <p>Come back tomorrow for a new word, or keep playing in practice mode.</p>
          )}
          <button className="actionButton" onClick={newPracticeGame}>
            {settings.mode === "daily" ? "Play practice" : "Play again"}
          </button>
        </div>
      )}

      <Keyboard
        statuses={keyStatuses(game.guesses, game.answer)}
        onLetter={typeLetter}
        onEnter={submit}
        onBackspace={backspace}
        disabled={!playing}
      />

      {panel === "help" && <HowToPlay onClick={() => setPanel(null)} />}
      {panel === "settings" && (
        <Settings
          settings={settings}
          onChange={changeSettings}
          onClose={() => setPanel(null)}
        />
      )}
    </div>
  );
}

export default App;
