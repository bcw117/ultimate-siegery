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
        <img
          className="weapon"
          src={weapon_details.icon_url}
          alt={weapon_details.name}
        />
      </div>
      <div className="attachments">
        {weapon_details.scope[0] === "NA" ? (
          <></>
        ) : (
          <div className="grid-item">
            <p className={ScoutItalic.className}>Scope</p>
            <div className="inner-attachment">
              <img
                src={weapon_details.scope[1]}
                alt={weapon_details.scope[0]}
              />
              <p>{weapon_details.scope[0]}</p>
            </div>
          </div>
        )}
        {weapon_details.barrel[0] === "NA" ? (
          <></>
        ) : (
          <div className="grid-item">
            <p className={ScoutItalic.className}>Barrel</p>
            <div className="inner-attachment">
              <img
                src={weapon_details.barrel[1]}
                alt={weapon_details.barrel[0]}
              />
              <p>{weapon_details.barrel[0]}</p>
            </div>
          </div>
        )}

        {weapon_details.grip[0] === "NA" ? (
          <></>
        ) : (
          <div className="grid-item">
            <p className={ScoutItalic.className}>Grip</p>
            <div className="inner-attachment">
              <img src={weapon_details.grip[1]} alt={weapon_details.grip[0]} />
              <p>{weapon_details.grip[0]} Grip</p>
            </div>
          </div>
        )}
        {weapon_details.underbarrel[0] === "NA" ? (
          <></>
        ) : (
          <div className="grid-item">
            <p className={ScoutItalic.className}>Underbarrel</p>
            <div className="inner-attachment">
              <img src={weapon_details.underbarrel[1]} alt="None"></img>
              <p>{weapon_details.underbarrel[0]}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeaponDisplay;
