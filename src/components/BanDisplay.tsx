import React from "react";

type Props = {
  side: string;
};

const BanDisplay = (props: Props) => {
  const { side } = props;
  return (
    <>
      <h1>BANS</h1>
      {side === "A" ? <></> : <></>}
    </>
  );
};

export default BanDisplay;
