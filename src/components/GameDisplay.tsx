import React from "react";
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

const GameDisplay = (props: Props) => {
  const maxRounds = props.maxRounds;
  const maxOT = props.maxOT;
  const bans = props.bans;
  const side = props.side;
  const attackers = props.operators.attackers;
  const defenders = props.operators.defenders;

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
    </div>
  );
};

export default GameDisplay;
