import React from "react";
import "@styles/selection.css";
import FilterOperator from "./FilterOperator";
import { OperatorFilter } from "@/types/operator";

type Props = {
  data: OperatorFilter[];
  setSidePicked: Function;
  handleClick: Function;
};

const Selection = (props: Props) => {
  const setSidePicked = props.setSidePicked;
  return (
    <div className="flex flex-row justify-center items-center">
      <div className="selection font-ScoutCond-BoldItalic">
        <h1 className={"text-4xl"}>RANKED</h1>
        <h2 className={"text-4xl"}>Select the side your are starting on:</h2>
        <div className="button-wrapper">
          <button
            className="attack-button"
            onClick={() => {
              setSidePicked("attacking");
            }}
          >
            ATTACKERS
          </button>
          <button
            className="defense-button"
            onClick={() => {
              setSidePicked("defending");
            }}
          >
            DEFENDERS
          </button>
        </div>
      </div>
      <FilterOperator handleClick={props.handleClick} data={props.data} />
    </div>
  );
};

export default Selection;
