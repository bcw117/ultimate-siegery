import React from "react";
import Classic from "@/components/Classic";

const page = () => {
  return <Classic gameMode="Standard" bans={false} maxRounds={7} maxOT={1} />;
};

export default page;
