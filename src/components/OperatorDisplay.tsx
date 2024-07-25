"use client";

import React, { useEffect, useState } from "react";
import {
  Operator,
  Weapon,
  OperatorResponse,
  WeaponResponse,
} from "@customTypes/operator";
import localFont from "next/font/local";
import "@styles/operatordisplay.css";
import WeaponDisplay from "./WeaponDisplay";

const ScoutItalic = localFont({ src: "../fonts/ScoutCond-BoldItalic.otf" });

interface Props {
  side: String;
}

type Response = {
  operator_data: OperatorResponse;
  weapon_data: WeaponResponse;
  gadget: string;
};

const OperatorDisplay = (props: Props) => {
  const side = props.side;
  const [operator, setOperator] = useState<Operator | undefined>(undefined);
  const [primary, setPrimary] = useState<Weapon | undefined>(undefined);
  const [secondary, setSecondary] = useState<Weapon | undefined>(undefined);
  const [gadget, setGadget] = useState("");
  const [portrait, setPortrait] = useState("");

  const getData = async () => {
    try {
      const response = await fetch(
        `${window.location.origin}/api/operators?side=${side}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        const results = await response.json();
        const data = results as Response;
        setOperator(data.operator_data.operator);
        setPrimary(data.weapon_data.primary);
        setSecondary(data.weapon_data.secondary);
        setGadget(data.gadget);
        setPortrait(data.operator_data.portrait);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {operator && primary && secondary && portrait ? (
        <>
          <div className="operator-image-container">
            <h1 className={ScoutItalic.className + " text-6xl"}>
              {operator.name}
            </h1>
            {/* <img
              className="operator-portrait"
              src={portrait}
              alt={operator.name}
            />
            <img
              className="operator-icon"
              src={`/icons/${operator.name.toLowerCase()}.svg`}
              alt={operator.name + "Icon"}
            /> */}
          </div>
          <div className="loadout-container">
            <h1 className={ScoutItalic.className + " text-5xl"}>Loadout</h1>
            <WeaponDisplay weapon_details={primary} weapon_type="Primary" />
            <WeaponDisplay weapon_details={secondary} weapon_type="Secondary" />
            <div>
              <h2 className={ScoutItalic.className}>Gadget</h2>
              <h3>{gadget}</h3>
              {/* <img
                className="gadget"
                src={`/gadgets/${loadout?.gadget}.png`}
                alt={loadout?.gadget + "Icon"}
              /> */}
            </div>
          </div>
        </>
      ) : (
        <>
          <div>Loading</div>
        </>
      )}
    </>

    // <div className="operator-container">
    //   {opInfo ? (

    //   ) : (
    //     <div className="">Loading..</div>
    //   )}
    // </div>
  );
};

export default OperatorDisplay;
