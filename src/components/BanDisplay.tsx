import React, { useEffect, useState } from "react";
import { OperatorFilter } from "@/types/operator";

type Props = {
  attackers: OperatorFilter[];
  defenders: OperatorFilter[];
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
