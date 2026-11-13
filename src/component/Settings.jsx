import React from "react";
import {
  FormControlLabel,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import style from "./Settings.module.css";
import { MAX_LENGTH, MIN_LENGTH, SECONDS_PER_TRY } from "../game/config";
import { timeLimitSeconds, triesForLength } from "../game/logic";

const LENGTHS = Array.from(
  { length: MAX_LENGTH - MIN_LENGTH + 1 },
  (_, i) => MIN_LENGTH + i
);

const Settings = ({ settings, onChange, onClose }) => {
  const minutes = Math.floor(timeLimitSeconds(settings.length) / 60);
  const seconds = timeLimitSeconds(settings.length) % 60;

  return (
    <div className={style.settings}>
      <div className={style.header}>
        <p className={style.title}>Settings</p>
        <CloseIcon className={style.close} onClick={onClose} />
      </div>

      <div className={style.section}>
        <p className={style.label}>Mode</p>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={settings.mode}
          onChange={(e, value) => value && onChange({ mode: value })}
        >
          <ToggleButton value="daily">Daily word</ToggleButton>
          <ToggleButton value="practice">Practice</ToggleButton>
        </ToggleButtonGroup>
        <p className={style.hint}>
          Daily: one word per day for each length, the same for everyone.
          Practice: random words, as many games as you like.
        </p>
      </div>

      <div className={style.section}>
        <p className={style.label}>Word length</p>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={settings.length}
          onChange={(e, value) => value && onChange({ length: value })}
        >
          {LENGTHS.map((n) => (
            <ToggleButton key={n} value={n}>
              {n}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <p className={style.hint}>
          {settings.length} letters, {triesForLength(settings.length)} tries.
          Longer words get more tries.
        </p>
      </div>

      <div className={style.section}>
        <p className={style.label}>Timer</p>
        <FormControlLabel
          control={
            <Switch
              checked={settings.timer}
              onChange={(e) => onChange({ timer: e.target.checked })}
            />
          }
          label={settings.timer ? "On" : "Off"}
        />
        <p className={style.hint}>
          {SECONDS_PER_TRY} seconds per try ({minutes}:
          {String(seconds).padStart(2, "0")} for {settings.length} letters). The
          clock starts when you type your first letter; if it runs out, you
          lose. Applies to new games: a daily game you already started keeps the
          timer setting it began with.
        </p>
      </div>
    </div>
  );
};

export default Settings;
