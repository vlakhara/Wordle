import React from "react";
import style from "./Keyboard.module.css";

const ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

const Keyboard = ({ statuses, onLetter, onEnter, onBackspace, disabled }) => {
  // Keep focus on the page so the physical keyboard keeps working after a click.
  const keepFocus = (e) => e.preventDefault();

  return (
    <div className={style.keyboard}>
      {ROWS.map((row, i) => (
        <div className={style.row} key={row}>
          {i === 2 && (
            <button
              className={`${style.key} ${style.wide}`}
              onMouseDown={keepFocus}
              onClick={onEnter}
              disabled={disabled}
            >
              Enter
            </button>
          )}
          {row.split("").map((letter) => (
            <button
              key={letter}
              className={`${style.key} ${statuses[letter] ? style[statuses[letter]] : ""}`}
              onMouseDown={keepFocus}
              onClick={() => onLetter(letter)}
              disabled={disabled}
            >
              {letter}
            </button>
          ))}
          {i === 2 && (
            <button
              className={`${style.key} ${style.wide}`}
              onMouseDown={keepFocus}
              onClick={onBackspace}
              disabled={disabled}
              aria-label="Backspace"
            >
              ⌫
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
