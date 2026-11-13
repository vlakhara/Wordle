import React from "react";
import style from "./Board.module.css";
import { evaluateGuess } from "../game/logic";

const Board = ({ length, maxTries, guesses, current, answer, hints, status }) => {
  // Each hint uses up one try; those rows sit at the bottom, locked.
  const playableRows = maxTries - hints.length;
  const rows = [];

  guesses.forEach((guess) => {
    const result = evaluateGuess(guess, answer);
    rows.push({ kind: "guess", letters: guess.split(""), result });
  });
  if (status === "playing" && guesses.length < playableRows) {
    rows.push({ kind: "current", letters: current.split(""), result: [] });
  }
  while (rows.length < playableRows) {
    rows.push({ kind: "empty", letters: [], result: [] });
  }
  hints.forEach(() => rows.push({ kind: "locked", letters: [], result: [] }));

  return (
    <div className={style.board} style={{ "--len": length }}>
      {rows.map((row, r) => (
        <div className={style.row} key={r}>
          {Array.from({ length }).map((_, c) => {
            const letter = row.letters[c] || "";
            let tileClass = style.tile;
            if (row.kind === "guess") tileClass += ` ${style[row.result[c]]}`;
            if (row.kind === "current" && letter) tileClass += ` ${style.filled}`;
            if (row.kind === "locked") tileClass += ` ${style.locked}`;
            return (
              <div
                className={tileClass}
                key={c}
                title={row.kind === "locked" ? "Used up by a hint" : undefined}
              >
                {letter}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Board;
