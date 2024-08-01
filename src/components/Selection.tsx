"use client";
import React, { useState } from "react";
import "@styles/selection.css";
import FilterOperator from "./FilterOperator";
import { OperatorFilter } from "@/types/operator";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Props = {
  gameMode: string;
  data: OperatorFilter[];
  setSidePicked: Function;
  handleClick: Function;
};

const Selection = (props: Props) => {
  const setSidePicked = props.setSidePicked;
  const [opened, setOpen] = useState(false);

  const checkFilter = () => {
    const operatorFiltering = props.data;
    const defenderExists = operatorFiltering.filter((operator) => {
      return operator.selected === false && operator.side === "D";
    });
    const attackerExists = operatorFiltering.filter((operator) => {
      return operator.selected === false && operator.side === "A";
    });

    if (defenderExists.length !== 0 && attackerExists.length !== 0) {
      return true;
    }

    return false;
  };
  return (
    <div className="flex flex-row justify-center items-center">
      <div className="selection font-ScoutCond-BoldItalic">
        <h1 className={"text-4xl"}>{props.gameMode.toUpperCase()}</h1>
        <h2 className={"text-4xl"}>Select the side your are starting on:</h2>
        <div className="button-wrapper">
          <AlertDialog open={opened}>
            <AlertDialogTrigger
              className="attack-button"
              onClick={() => {
                if (checkFilter()) {
                  setSidePicked("attacking");
                } else {
                  setOpen(true);
                }
              }}
            >
              ATTACKERS
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  You must select at least one defender and one attacker
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  <button
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    Ok
                  </button>
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={opened}>
            <AlertDialogTrigger
              className="defense-button"
              onClick={() => {
                if (checkFilter()) {
                  setSidePicked("attacking");
                } else {
                  setOpen(true);
                }
              }}
            >
              DEFENDERS
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  You must select at least one defender and one attacker
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  <button
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    Ok
                  </button>
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <FilterOperator handleClick={props.handleClick} data={props.data} />
    </div>
  );
};

export default Selection;
