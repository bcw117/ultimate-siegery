"use client";

import React, { useState } from "react";
import OperatorDisplay from "@/components/OperatorDisplay";
import localFont from "next/font/local";
import "@styles/classic.css";

const ScoutItalic = localFont({ src: "../../fonts/ScoutCond-BoldItalic.otf" });

const page = () => {
  const [data, setData] = useState();
  const [sidePicked, setSidePicked] = useState("picking");

  return (
    <>
      {sidePicked !== "picking" ? (
        <>
          {sidePicked === "attacking" ? (
            <div className="wrapper">
              <OperatorDisplay side="A" />
              <OperatorDisplay side="A" />
              <OperatorDisplay side="A" />
              <OperatorDisplay side="D" />
              <OperatorDisplay side="D" />
              <OperatorDisplay side="D" />
            </div>
          ) : (
            <div className="wrapper">
              <OperatorDisplay side="D" />
              <OperatorDisplay side="D" />
              <OperatorDisplay side="D" />
              <OperatorDisplay side="A" />
              <OperatorDisplay side="A" />
              <OperatorDisplay side="A" />
            </div>
          )}
        </>
      ) : (
        <div className="wrapper">
          <button
            className={ScoutItalic.className + " attack-button"}
            onClick={() => {
              setSidePicked("attacking");
            }}
          >
            ATTACK
          </button>
          <button
            className={ScoutItalic.className + " defense-button"}
            onClick={() => {
              setSidePicked("defending");
            }}
          >
            DEFEND
          </button>
        </div>
      )}
    </>
  );
};

export default page;
