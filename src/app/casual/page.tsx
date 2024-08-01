import React from "react";
import Classic from "@/components/Classic";

const page = () => {
  return (
    <Classic gameMode="Quick Match" bans={false} maxRounds={5} maxOT={1} />
  );
};

export default page;
