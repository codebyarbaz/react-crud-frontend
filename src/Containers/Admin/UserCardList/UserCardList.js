import React from "react";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

import { limitText } from "../../../utils/utils";

import "./UserCardList.css";

const UserCardList = (props) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th className="tableHeading">No.</th>
          <th className="tableHeading">Name</th>
          <th className="tableHeading">Image</th>
          <th className="tableHeading">Actions</th>
        </tr>
      </thead>
      <tbody>
        {props.users.map((user, index) => {
          return (
            <tr key={index}>
              <td className="">{index + 1}</td>
              <td className="">{limitText(user.name, 10)}</td>
              <td>
                <img alt={user.name} className="userImage" src={user.image} />
              </td>
              <td>
                <FontAwesomeIcon
                  className="mr-3 fontIcon c-pointer "
                  icon={faEdit}
                    onClick={() => props.onEditUser(user._id)}
                />
                <FontAwesomeIcon
                  className="fontIcon c-pointer "
                  icon={faTrash}
                    onClick={() => props.onConfirmDelete(user._id)}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default UserCardList;
