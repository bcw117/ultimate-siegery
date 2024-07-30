import React, { useEffect } from "react";

type Props = {
  side: string;
};

const BanDisplay = (props: Props) => {
  const { side } = props;

  const getOperatorData = async () => {};

  useEffect(() => {
    getOperatorData();
  });
  return (
    <>
      <h1>BANS</h1>
      {side === "A" ? <></> : <></>}
    </>
  );
};

export default BanDisplay;
