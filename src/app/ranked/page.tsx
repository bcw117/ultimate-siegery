import React from "react";
import Classic from "@/components/Classic";

const page = () => {
  return <Classic bans={true} maxRounds={9} maxOT={3} />;
};

export default page;
