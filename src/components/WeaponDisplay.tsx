import { AttachmentSet, Loadout } from "@/types/loadout";
import localFont from "next/font/local";
import "@styles/weapondisplay.css";
import React from "react";

const ScoutItalic = localFont({ src: "../fonts/ScoutCond-BoldItalic.otf" });

interface Props {
  weapon_type: string;
  loadout: Loadout;
  attachments: AttachmentSet;
}

const WeaponDisplay = (props: Props) => {
  const { weapon_type, loadout, attachments } = props;
  return (
    <div className="weapon-container">
      <div className="weapon">
        <h2 className={ScoutItalic.className}>{weapon_type}</h2>
        <h3>
          {weapon_type === "Primary"
            ? loadout.primary.name
            : loadout.secondary.name}
        </h3>
        <img
          className="weapon"
          src={
            weapon_type === "Primary"
              ? loadout.primary.icon_url
              : loadout.secondary.icon_url
          }
          alt={
            weapon_type === "Primary"
              ? loadout.primary.name
              : loadout.secondary.name
          }
        />
      </div>
      <div className="attachments">
        {attachments.scope === "NA" ? (
          <></>
        ) : (
          <div className="grid-item">
            <p className={ScoutItalic.className}>Scope</p>
            <div className="inner-attachment">
              <img
                src={`/attachments/${attachments.scope}.png`}
                alt={attachments.scope}
              />
              <p>{attachments.scope}</p>
            </div>
          </div>
        )}
        {attachments.barrel === "NA" ? (
          <></>
        ) : (
          <div className="grid-item">
            <p className={ScoutItalic.className}>Barrel</p>
            <div className="inner-attachment">
              <img
                src={`/attachments/${attachments.barrel}.png`}
                alt={attachments.barrel}
              />
              <p>{attachments.barrel}</p>
            </div>
          </div>
        )}

        {attachments.grip === "NA" ? (
          <></>
        ) : (
          <div className="grid-item">
            <p className={ScoutItalic.className}>Grip</p>
            <div className="inner-attachment">
              <img
                src={`/attachments/${attachments.grip}.png`}
                alt={attachments.grip}
              />
              <p>{attachments.grip} Grip</p>
            </div>
          </div>
        )}
        {attachments.laser ? (
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
