"use client";

import React, { useEffect, useState } from "react";
import operator_data from "@/data/operators.json";
import weapon_data from "@/data/weapons.json";
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
};

const OperatorDisplay = (props: Props) => {
  const side = props.side;
  const [opInfo, setOpInfo] = useState<Response | undefined>(undefined);

  const getData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/operators?side=${side}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        const results = await response.json();
        const test = results as Response;
        setOpInfo(test);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!opInfo) {
      getData();
    }
  }, [opInfo]);

  return (
    <>
      {opInfo ? (
        <>
          <div>{opInfo.operator_data.operator.name}</div>
        </>
      ) : (
        <>
          <div>Loading</div>
        </>
      )}
    </>

    // <div className="operator-container">
    //   {opInfo ? (
    //     <>
    //       <div className="operator-image-container">
    //         <h1 className={ScoutItalic.className}>{opInfo.operator}</h1>
    //         <img
    //           className="operator-portrait"
    //           src={`/portrait/${operator.name.toUpperCase()}.png`}
    //           alt={operator.name}
    //         />
    //         <img
    //           className="operator-icon"
    //           src={`/icons/${operator.name.toLowerCase()}.svg`}
    //           alt={operator.name + "Icon"}
    //         />
    //       </div>
    //       <div className="loadout-container">
    //         <h1 className={ScoutItalic.className}>Loadout</h1>
    //         <WeaponDisplay
    //           weapon_type="Primary"
    //           loadout={loadout}
    //           attachments={primaryWeapon}
    //         />
    //         <WeaponDisplay
    //           weapon_type="Secondary"
    //           loadout={loadout}
    //           attachments={secondaryWeapon}
    //         />
    //         <div>
    //           <h2 className={ScoutItalic.className}>Gadget</h2>
    //           <h3>{loadout?.gadget}</h3>
    //           <img
    //             className="gadget"
    //             src={`/gadgets/${loadout?.gadget}.png`}
    //             alt={loadout?.gadget + "Icon"}
    //           />
    //         </div>
    //       </div>
    //     </>
    //   ) : (
    //     <div className="">Loading..</div>
    //   )}
    // </div>
  );
};

export default OperatorDisplay;
