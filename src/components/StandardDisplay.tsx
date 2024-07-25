"use client";
import React, { useState } from "react";
import OperatorDisplay from "@/components/OperatorDisplay";
import localFont from "next/font/local";
import "@styles/classic.css";
import BanDisplay from "./BanDisplay";

const ScoutItalic = localFont({ src: "../fonts/ScoutCond-BoldItalic.otf" });

const StandardDisplay = () => {
  const [sidePicked, setSidePicked] = useState("picking");

  return (
    <>
      {sidePicked !== "picking" ? (
        <>
          {sidePicked === "attacking" ? (
            <div className="wrapper">
              <OperatorDisplay side="A" />
            </div>
          ) : (
            <div className="wrapper">
              <OperatorDisplay side="D" />
            </div>
          )}
        </>
      ) : (
        <div className="wrapper">
          <h1 className={ScoutItalic.className + " text-4xl"}>
            Select the side your are starting on:
          </h1>
          <div className="button-wrapper">
            <button
              className={ScoutItalic.className + " attack-button"}
              onClick={() => {
                setSidePicked("attacking");
              }}
            >
              ATTACKERS
            </button>
            <button
              className={ScoutItalic.className + " defense-button"}
              onClick={() => {
                setSidePicked("defending");
              }}
            >
              DEFENDERS
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StandardDisplay;
