import React, { useEffect, useState } from "react";
import operatorJson from "@/app/operators.json";
import { OperatorFilter } from "@/types/operator";

type Props = {
  attackers: OperatorFilter[];
  defenders: OperatorFilter[];
};

const operatorList = operatorJson as OperatorFilter[];

const BanDisplay = (props: Props) => {
  const { attackers, defenders } = props;
  const [bannedAttacker, setBannedAttacker] = useState<OperatorFilter>();
  const [bannedDefender, setBannedDefender] = useState<OperatorFilter>();
  const availableOperators = operatorList.filter((operator) => {
    return (
      !containsOperator(operator, attackers) &&
      !containsOperator(operator, defenders)
    );
  });

  function containsOperator(obj: OperatorFilter, list: OperatorFilter[]) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i].name == obj.name) {
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    const setBans = () => {
      let attackingOperators = availableOperators.filter((operator) => {
        return operator.side === "A";
      });
      let defendingOperators = availableOperators.filter((operator) => {
        return operator.side === "D";
      });

      setBannedAttacker(
        attackingOperators[
          Math.floor(Math.random() * attackingOperators.length)
        ]
      );
      setBannedDefender(
        defendingOperators[
          Math.floor(Math.random() * defendingOperators.length)
        ]
      );
    };

    if (!bannedAttacker && !bannedDefender) {
      setBans();
    }
  }, [bannedAttacker, bannedDefender, availableOperators]);

  return (
    <div className="text-center font-ScoutCond-BoldItalic mt-5 mb-10">
      <h1 className="text-6xl">Bans</h1>
      {bannedAttacker && bannedDefender ? (
        <div className="flex flex-row justify-evenly items-center min-w-[50vw]">
          <div className="flex flex-col items-center max-w-[10rem]">
            <img
              className="min-w-[100px] min-h-[100px] h-auto w-auto"
              src={`/icons/${bannedAttacker.name}.svg`}
              alt={bannedAttacker.name + "Icon"}
            />
            <h2 className="text-4xl">
              {bannedAttacker.name.charAt(0).toUpperCase() +
                bannedAttacker.name.slice(1)}
            </h2>
          </div>
          <div className="flex flex-col items-center max-w-[10rem]">
            <img
              className="min-w-[100px] min-h-[100px] h-auto w-auto"
              src={`/icons/${bannedDefender.name}.svg`}
              alt={bannedDefender.name + "Icon"}
            />
            <h2 className="text-4xl">
              {bannedDefender.name.charAt(0).toUpperCase() +
                bannedDefender.name.slice(1)}
            </h2>
          </div>
        </div>
      ) : (
        <>
          <h1>Loading</h1>
        </>
      )}
    </div>
  );
};

export default BanDisplay;
