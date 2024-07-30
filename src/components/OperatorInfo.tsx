"use client";

import React, { useEffect, useState } from "react";
import {
  Operator,
  Weapon,
  OperatorResponse,
  WeaponResponse,
} from "@customTypes/operator";
import "@styles/operatordisplay.css";
import WeaponDisplay from "./WeaponDisplay";

interface Props {
  operatorName: string;
}

type Response = {
  operator_data: OperatorResponse;
  weapon_data: WeaponResponse;
  gadget: string[];
};

const OperatorInfo = (props: Props) => {
  const name = props.operatorName;
  const [operator, setOperator] = useState<Operator | undefined>(undefined);
  const [primary, setPrimary] = useState<Weapon | undefined>(undefined);
  const [secondary, setSecondary] = useState<Weapon | undefined>(undefined);
  const [gadget, setGadget] = useState([""]);
  const [portrait, setPortrait] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `${window.location.origin}/api/operators?name=${
            name.charAt(0).toUpperCase() + name.slice(1)
          }`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response) {
          const results = await response.json();
          console.log(results);
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
    getData();
  }, [name]);

  return (
    <>
      {operator && primary && secondary && portrait ? (
        <div className="flex flex-row">
          <div className="flex flex-col">
            <div className="operator-image-container">
              <h1 className="text-6xl font-ScoutCond-BoldItalic">
                {operator.name}
              </h1>
              <img
                className="operator-portrait"
                src={portrait}
                alt={operator.name}
              />
              <img
                className="operator-icon"
                src={`/icons/${operator.name.toLowerCase()}.svg`}
                alt={operator.name + "Icon"}
              />
            </div>
            <div className="gadget-container">
              <h2 className="font-ScoutCond-BoldItalic text-4xl">Gadget</h2>
              <h3>{gadget[0]}</h3>
              <img
                className="gadget"
                src={gadget[1]}
                alt={gadget[0] + "Icon"}
              />
            </div>
          </div>
          <div className="loadout-container">
            <h1 className="font-ScoutCond-BoldItalic text-6xl">Loadout</h1>
            <WeaponDisplay weapon_details={primary} weapon_type="Primary" />
            <WeaponDisplay weapon_details={secondary} weapon_type="Secondary" />
          </div>
        </div>
      ) : (
        <div>
          <h1>Loading</h1>
        </div>
      )}
    </>
  );
};

export default OperatorInfo;
