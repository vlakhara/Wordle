import React from "react";
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
        <p> &gt; Guess the hidden word before you run out of tries.</p>
        <p>
          &gt; Every guess must have the same number of letters as the hidden
          word. Type it and press Enter.
        </p>
        <p>
          &gt; Pick a length from 4 to 8 letters in settings. Longer words get
          more tries: the number of tries is the length plus one.
        </p>
        <p>
          &gt; Daily mode gives one word per day for each length, the same for
          everyone. Practice mode gives random words, as many games as you
          like.
        </p>
        <p>
          &gt; Timer (optional): you get 30 seconds per try. The clock starts
          at your first letter, and if it runs out you lose.
        </p>
        <p>
          &gt; Hints: use up to 2 per game. Each hint reveals one letter in its
          place, and uses up one of your tries.
        </p>
        <p>
          &gt; If you use a letter more times than it appears in the word, the
          extra copies show as not in the word.
        </p>
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
            <p>R is in the word and is in the correct place.</p>
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
            <p>H is in the word but the position is wrong.</p>
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
