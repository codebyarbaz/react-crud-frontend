import React from "react";
import { limitText } from "../../utils/utils";

import "./UserCard.css";

const UserCard = (props) => {
  return (
    <div className="userCard mx-auto mb-sm-5 mb-4 p-sm-4 p-3 position-relative">
      <img
        src={props.image}
        alt={props.name}
        className="mb-3 userCard__Image"
      />
      <h3 className="userCard__Name">{limitText(props.name, 16)}</h3>
      <span className="d-block userCard__Designation">
        {limitText(props.designation, 18)}
      </span>

      <div className="CTA_Overlay position-absolute"></div>
    </div>
  );
};

export default UserCard;
