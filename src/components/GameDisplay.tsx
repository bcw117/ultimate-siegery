import React, { useState } from "react";
import { OperatorFilter } from "@/types/operator";
import BanDisplay from "./BanDisplay";
import OperatorInfo from "./OperatorInfo";
import "@styles/classic.css";

type Props = {
  side: string;
  bans: boolean;
  maxRounds: number;
  maxOT: number;
  operators: { attackers: OperatorFilter[]; defenders: OperatorFilter[] };
};

function mix(first: OperatorFilter[], second: OperatorFilter[]) {
  let newList = [];
  for (let i = 0; i < first.length || i < second.length; i++) {
    if (i < first.length) {
      newList.push(first[i]);
    }
    if (i < second.length) {
      newList.push(second[i]);
    }
  }
  return newList;
}

const GameDisplay = (props: Props) => {
  const maxRounds = props.maxRounds;
  const maxOT = props.maxOT;
  const bans = props.bans;
  const side = props.side;
  const attackers = props.operators.attackers;
  const defenders = props.operators.defenders;
  const OTattackers = attackers.slice((maxRounds - maxOT) / 2);
  const OTdefenders = defenders.slice((maxRounds - maxOT) / 2);

  const [overtime, setOvertime] = useState("none");

  return (
    <div className="wrapper">
      {bans ? (
        <div>
          <BanDisplay attackers={attackers} defenders={defenders} />
        </div>
      ) : (
        <></>
      )}
      {side === "attacking" ? (
        <div className="flex flex-col gap-20">
          {attackers.slice(0, (maxRounds - maxOT) / 2).map((attacker, i) => {
            return <OperatorInfo key={i} operatorName={attacker.name} />;
          })}
          {defenders.slice(0, (maxRounds - maxOT) / 2).map((defender, i) => {
            return <OperatorInfo key={i} operatorName={defender.name} />;
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-20">
          {defenders.slice(0, (maxRounds - maxOT) / 2).map((defender, i) => {
            return <OperatorInfo key={i} operatorName={defender.name} />;
          })}
          {attackers.slice(0, (maxRounds - maxOT) / 2).map((attacker, i) => {
            return <OperatorInfo key={i} operatorName={attacker.name} />;
          })}
        </div>
      )}
      <p>Overtime</p>
      <div className="flex flex-col">
        {overtime === "none" ? (
          <>
            <button
              className="attack-button"
              onClick={() => {
                setOvertime("attack");
              }}
            >
              <p className="font-ScoutCond-BoldItalic">ATTACKERS</p>
            </button>
            <button
              className="defense-button"
              onClick={() => {
                setOvertime("defend");
              }}
            >
              <p className="font-ScoutCond-BoldItalic">DEFENDERS</p>
            </button>
          </>
        ) : (
          <>
            {overtime === "attack" ? (
              <>
                {mix(OTattackers, OTdefenders)
                  .slice(0, maxOT)
                  .map((operator, i) => {
                    return (
                      <OperatorInfo key={i} operatorName={operator.name} />
                    );
                  })}
              </>
            ) : (
              <>
                {mix(OTdefenders, OTattackers)
                  .slice(0, maxOT)
                  .map((operator, i) => {
                    return (
                      <OperatorInfo key={i} operatorName={operator.name} />
                    );
                  })}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GameDisplay;
