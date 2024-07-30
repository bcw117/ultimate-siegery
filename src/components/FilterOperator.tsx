import React, { useState } from "react";
import { OperatorFilter } from "@/types/operator";
import "@styles/filter.css";

type Props = {
  data: OperatorFilter[];
  handleClick: Function;
};

const FilterOperator = (props: Props) => {
  const filterOperators = props.data;

  return (
    <div className="filter-container">
      {filterOperators.map((operator: OperatorFilter, i) => {
        return (
          <img
            className={
              "grid-icon " + (operator.selected ? "opacity-50" : "opacity-100")
            }
            src={`/icons/${operator.name}.svg`}
            alt={operator + "Icon"}
            onClick={() => props.handleClick(operator.name)}
            key={i}
          />
        );
      })}
    </div>
  );
};

export default FilterOperator;
