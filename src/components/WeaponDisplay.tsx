import localFont from "next/font/local";
import "@styles/weapondisplay.css";
import React from "react";
import { Weapon } from "@/types/operator";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const ScoutItalic = localFont({ src: "../fonts/ScoutCond-BoldItalic.otf" });

interface Props {
  weapon_details: Weapon;
  weapon_type: string;
}

const WeaponDisplay = (props: Props) => {
  const { weapon_type, weapon_details } = props;
  return (
    <div className="weapon-container">
      <div className="weapon">
        <h2 className={ScoutItalic.className}>{weapon_type}</h2>
        <h3>{weapon_details.name}</h3>
        <img
          className="weapon"
          src={weapon_details.icon_url}
          alt={weapon_details.name}
        />
      </div>
      <div className="attachments">
        {weapon_details.scope.type === "NA" ? (
          <></>
        ) : (
          <Card className="grid-item">
            <CardTitle>
              <h2 className="font-ScoutCond-BoldItalic">Scope</h2>
            </CardTitle>
            <CardContent className="attachment-content">
              <div className="flex items-center min-h-[75px]">
                <img
                  src={weapon_details.scope.icon_url}
                  alt={weapon_details.scope.type}
                />
              </div>

              <p>{weapon_details.scope.type}</p>
            </CardContent>
          </Card>
        )}
        {weapon_details.barrel.type === "NA" ? (
          <></>
        ) : (
          <Card className="grid-item">
            <h2 className={ScoutItalic.className}>Barrel</h2>
            <CardContent className="attachment-content">
              <div className="flex items-center min-h-[75px]">
                <img
                  src={weapon_details.barrel.icon_url}
                  alt={weapon_details.barrel.type}
                />
              </div>

              <p>{weapon_details.barrel.type}</p>
            </CardContent>
          </Card>
        )}

        {weapon_details.grip.type === "NA" ? (
          <></>
        ) : (
          <Card className="grid-item">
            <h2 className={ScoutItalic.className}>Grip</h2>
            <CardContent className="attachment-content">
              <div className="flex items-center min-h-[75px]">
                <img
                  src={weapon_details.grip.icon_url}
                  alt={weapon_details.grip.type}
                />
              </div>

              <p>{weapon_details.grip.type} Grip</p>
            </CardContent>
          </Card>
        )}
        {weapon_details.underbarrel.type === "NA" ? (
          <></>
        ) : (
          <Card className="grid-item">
            <h2 className={ScoutItalic.className}>Underbarrel</h2>
            <CardContent className="attachment-content">
              <div className="flex items-center min-h-[75px]">
                <img src={weapon_details.underbarrel.icon_url} alt="None" />
              </div>

              <p>{weapon_details.underbarrel.type}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WeaponDisplay;
