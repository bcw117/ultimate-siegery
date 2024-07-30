"use client";

import React, { useState } from "react";
import Selection from "./Selection";
import GameDisplay from "./GameDisplay";
import { OperatorFilter } from "@/types/operator";

type Props = {
  bans: boolean;
  maxRounds: number;
  maxOT: number;
};

const operatorList: OperatorFilter[] = [
  { name: "ace", side: "A", selected: false },
  { name: "alibi", side: "D", selected: false },
  { name: "amaru", side: "A", selected: false },
  { name: "aruni", side: "D", selected: false },
  { name: "ash", side: "A", selected: false },
  { name: "azami", side: "D", selected: false },
  { name: "bandit", side: "D", selected: false },
  { name: "blackbeard", side: "A", selected: false },
  { name: "blitz", side: "A", selected: false },
  { name: "brava", side: "A", selected: false },
  { name: "buck", side: "A", selected: false },
  { name: "capitao", side: "A", selected: false },
  { name: "castle", side: "D", selected: false },
  { name: "caveira", side: "D", selected: false },
  { name: "clash", side: "D", selected: false },
  { name: "deimos", side: "A", selected: false },
  { name: "doc", side: "D", selected: false },
  { name: "dokkaebi", side: "A", selected: false },
  { name: "echo", side: "D", selected: false },
  { name: "ela", side: "D", selected: false },
  { name: "fenrir", side: "D", selected: false },
  { name: "finka", side: "A", selected: false },
  { name: "flores", side: "A", selected: false },
  { name: "frost", side: "D", selected: false },
  { name: "fuze", side: "A", selected: false },
  { name: "glaz", side: "A", selected: false },
  { name: "goyo", side: "D", selected: false },
  { name: "gridlock", side: "A", selected: false },
  { name: "grim", side: "A", selected: false },
  { name: "hibana", side: "A", selected: false },
  { name: "iana", side: "A", selected: false },
  { name: "iq", side: "A", selected: false },
  { name: "jackal", side: "A", selected: false },
  { name: "jager", side: "D", selected: false },
  { name: "kaid", side: "D", selected: false },
  { name: "kali", side: "A", selected: false },
  { name: "kapkan", side: "D", selected: false },
  { name: "lesion", side: "D", selected: false },
  { name: "lion", side: "A", selected: false },
  { name: "maestro", side: "D", selected: false },
  { name: "maverick", side: "A", selected: false },
  { name: "melusi", side: "D", selected: false },
  { name: "mira", side: "D", selected: false },
  { name: "montagne", side: "A", selected: false },
  { name: "mozzie", side: "D", selected: false },
  { name: "mute", side: "D", selected: false },
  { name: "nokk", side: "A", selected: false },
  { name: "nomad", side: "A", selected: false },
  { name: "oryx", side: "D", selected: false },
  { name: "osa", side: "A", selected: false },
  { name: "pulse", side: "D", selected: false },
  { name: "ram", side: "A", selected: false },
  { name: "rook", side: "D", selected: false },
  { name: "sens", side: "A", selected: false },
  { name: "sentry", side: "D", selected: false },
  { name: "sledge", side: "A", selected: false },
  { name: "smoke", side: "A", selected: false },
  { name: "solis", side: "D", selected: false },
  { name: "striker", side: "A", selected: false },
  { name: "tachanka", side: "D", selected: false },
  { name: "thatcher", side: "A", selected: false },
  { name: "thermite", side: "A", selected: false },
  { name: "thorn", side: "D", selected: false },
  { name: "thunderbird", side: "D", selected: false },
  { name: "tubarao", side: "D", selected: false },
  { name: "twitch", side: "A", selected: false },
  { name: "valkyrie", side: "D", selected: false },
  { name: "vigil", side: "D", selected: false },
  { name: "wamai", side: "D", selected: false },
  { name: "warden", side: "D", selected: false },
  { name: "ying", side: "A", selected: false },
  { name: "zero", side: "A", selected: false },
  { name: "zofia", side: "A", selected: false },
];

const Classic = (props: Props) => {
  const [sidePicked, setSidePicked] = useState("picking");
  const [filterOperators, setFilterOperators] = useState(operatorList);

  const handleClick = (operatorName: string) => {
    const filteredOperators = filterOperators.map((operator) => {
      let isSelected = operator.selected;
      if (operatorName === operator.name) {
        return {
          ...operator,
          selected: !isSelected,
        };
      } else {
        return operator;
      }
    });
    setFilterOperators(filteredOperators);
  };

  const getOperators = (operators: Array<OperatorFilter>) => {
    let randomOperators = [];
    for (let i = 0; i < (props.maxRounds + 1) / 2; i++) {
      let index = Math.floor(Math.random() * operators.length);
      randomOperators.push(operators[index]);
      operators.filter((operator) => {
        return operator.name !== operators[index].name;
      });
    }

    return randomOperators;
  };

  const getRandomOperators = () => {
    let attackingOperators = filterOperators.filter((operator) => {
      return operator.selected === false && operator.side === "A";
    });

    let defendingOperators = filterOperators.filter((operator) => {
      return operator.selected === false && operator.side === "D";
    });

    const attackers = getOperators(attackingOperators);
    const defenders = getOperators(defendingOperators);

    return { attackers, defenders };
  };

  return (
    <>
      {sidePicked !== "picking" ? (
        <div className="wrapper gap-20 p-4">
          <GameDisplay
            side={sidePicked}
            bans={props.bans}
            maxRounds={props.maxRounds}
            maxOT={props.maxOT}
            operators={getRandomOperators()}
          />
        </div>
      ) : (
        <Selection
          data={filterOperators}
          setSidePicked={setSidePicked}
          handleClick={handleClick}
        />
      )}
    </>
  );
};

export default Classic;
