"use client";

import React, { useEffect, useState } from "react";
import {
  Operator,
  Weapon,
  OperatorResponse,
  WeaponResponse,
} from "@customTypes/operator";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import "@styles/operatordisplay.css";
import WeaponDisplay from "./WeaponDisplay";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  operatorName: string;
}

type Response = {
  operatorData: OperatorResponse;
  weaponData: WeaponResponse;
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
    const getOperatorData = async () => {
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
          const { operatorData, weaponData, gadget } = results as Response;
          setOperator(operatorData.operator);
          setPrimary(weaponData.primary);
          setSecondary(weaponData.secondary);
          setGadget(gadget);
          setPortrait(operatorData.portrait);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getOperatorData();
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
            <Card className="gadget-container">
              <CardTitle>
                <h2 className="font-ScoutCond-BoldItalic text-4xl">Gadget</h2>
              </CardTitle>
              <CardContent className="flex flex-col gap-5">
                <h3>{gadget[0]}</h3>
                <img
                  className="gadget"
                  src={gadget[1]}
                  alt={gadget[0] + "Icon"}
                />
              </CardContent>
            </Card>
          </div>
          <div className="loadout-container">
            <h1 className="font-ScoutCond-BoldItalic text-6xl">Loadout</h1>
            <Card>
              <CardContent>
                <WeaponDisplay weapon_details={primary} weapon_type="Primary" />
                <WeaponDisplay
                  weapon_details={secondary}
                  weapon_type="Secondary"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex flex-row space-x-10">
          <div className="space-y-4">
            <Skeleton className="h-[30rem] w-[20rem]" />
            <Skeleton className="h-[9rem] w-[20rem]" />
          </div>

          <Skeleton className="h-[40rem] w-[30rem]" />
        </div>
      )}
    </>
  );
};

export default OperatorInfo;
