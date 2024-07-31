import React from "react";
import "@styles/rules.css";

const rules = () => {
  return (
    <div className="rules">
      <h1>RULES</h1>
      <ol className="list-decimal">
        <li>Select the correct mode you&apos;re playing and starting side.</li>
        <li>
          You must to play with the given operators, weapons, attachments and
          gadgets.
        </li>
        <li>
          Finish the game only playing with the given operators and loadouts.
        </li>
        <li>GLHF!</li>
      </ol>
    </div>
  );
};

export default rules;
