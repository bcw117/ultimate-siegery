import localFont from "next/font/local";
import "@styles/weapondisplay.css";
import React from "react";
import { Weapon } from "@/types/operator";

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
        <img className="weapon" src={""} alt={weapon_details.name} />
      </div>
      <div className="attachments">
        {weapon_details.scope === "NA" ? (
          <></>
        ) : (
          <div className="grid-item">
            <p className={ScoutItalic.className}>Scope</p>
            <div className="inner-attachment">
              <img
                src={`/attachments/${weapon_details.scope}.png`}
                alt={weapon_details.scope}
              />
              <p>{weapon_details.scope}</p>
            </div>
          </div>
        )}
        {weapon_details.barrel === "NA" ? (
          <></>
        ) : (
          <div className="grid-item">
            <p className={ScoutItalic.className}>Barrel</p>
            <div className="inner-attachment">
              <img
                src={`/attachments/${weapon_details.barrel}.png`}
                alt={weapon_details.barrel}
              />
              <p>{weapon_details.barrel}</p>
            </div>
          </div>
        )}

        {weapon_details.grip === "NA" ? (
          <></>
        ) : (
          <div className="grid-item">
            <p className={ScoutItalic.className}>Grip</p>
            <div className="inner-attachment">
              <img
                src={`/attachments/${weapon_details.grip}.png`}
                alt={weapon_details.grip}
              />
              <p>{weapon_details.grip} Grip</p>
            </div>
          </div>
        )}
        {weapon_details.underbarrel ? (
          <div className="grid-item">
            <p className={ScoutItalic.className}>Underbarrel</p>
            <div className="inner-attachment">
              <img src={`/attachments/laser.png`} alt="Laser"></img>
              <p>Laser Sight</p>
            </div>
          </div>
        ) : (
          <div className="grid-item">
            <p className={ScoutItalic.className}>Underbarrel</p>
            <div className="inner-attachment">
              <img src={`/attachments/none.png`} alt="None"></img>
              <p>None</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeaponDisplay;
