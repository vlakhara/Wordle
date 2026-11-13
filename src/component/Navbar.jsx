import React from "react";
import { IconButton } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import style from "./Navbar.module.css";

const Navbar = ({ title, onHelp, onSettings }) => {
  const press = (action) => (e) => {
    e.currentTarget.blur(); // so Enter still submits a guess afterwards
    action();
  };

  return (
    <div className={style.navbar}>
      <h1 className={style.title}>{title}</h1>
      <div className={style.actions}>
        <IconButton
          className={style.icon}
          onClick={press(onHelp)}
          aria-label="How to play"
        >
          <HelpOutlineIcon />
        </IconButton>
        <IconButton
          className={style.icon}
          onClick={press(onSettings)}
          aria-label="Settings"
        >
          <SettingsIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Navbar;
