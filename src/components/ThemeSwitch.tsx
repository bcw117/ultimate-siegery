"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  if (theme === "light") {
    return (
      <Icon
        onClick={() => setTheme("dark")}
        cursor="pointer"
        width="1.75em"
        height="1.75em"
        icon="ic:baseline-dark-mode"
      />
    );
  } else {
    return (
      <Icon
        onClick={() => setTheme("light")}
        cursor="pointer"
        width="1.75em"
        height="1.75em"
        icon="ic:baseline-dark-mode"
      />
    );
  }
};

export default ThemeSwitch;
