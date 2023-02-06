import React, { useState } from "react";
import style from "./HowToPlay.module.css";
import CloseIcon from "@mui/icons-material/Close";
const HowToPlay = ({ onClick }) => {
  return (
    <div className={style.howToPlay}>
      <div className={style.mainHeader}>
        <p className={style.text}>Let me help you</p>
        <CloseIcon className={style.close} onClick={onClick} />
      </div>
      <div className={style.body}>
        <p> &gt; You need to guess the wordle in given tries.</p>
        <p>
          &gt; Each guess will be a some characters long word which is the
          Wordle of the day ( The length of the wordle can be decided by the
          text fields ).
        </p>
        <p>
          &gt; You will get different number of chances for different length of
          wordle
        </p>
        <p>&gt; You can change the wordle length in settings.</p>
      </div>
      <div className={style.footer}>
        <p className={style.textExp}>Example:</p>
        <div className={style.examples}>
          <div className={style.example}>
            <span>
              <div className={style.correct}>
                <p>R</p>
              </div>
              <div>
                <p>I</p>
              </div>
              <div>
                <p>G</p>
              </div>
              <div>
                <p>H</p>
              </div>
              <div>
                <p>T</p>
              </div>
            </span>
            <p>A is in the word and is on the correct place.</p>
          </div>
          <div className={style.example}>
            <span>
              <div>
                <p>R</p>
              </div>
              <div>
                <p>I</p>
              </div>
              <div>
                <p>G</p>
              </div>
              <div className={style.available}>
                <p>H</p>
              </div>
              <div>
                <p>T</p>
              </div>
            </span>
            <p>L is in the word but the position is wrong.</p>
          </div>
          <div className={style.example}>
            <span>
              <div>
                <p>R</p>
              </div>
              <div className={style.wrong}>
                <p>I</p>
              </div>
              <div>
                <p>G</p>
              </div>
              <div>
                <p>H</p>
              </div>
              <div>
                <p>T</p>
              </div>
            </span>
            <p>I isn't in the word at any position.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToPlay;
