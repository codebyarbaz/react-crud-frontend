import React, { Fragment } from "react";
import ErrorList from "../../../Components/ErrorList/ErrorList";
import { Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const AddUserCard = (props) => {
  let CTAButton =
    props.modalTitle === "Add New User" ? (
      <button
        type="button"
        className="btn rounded text-white themeBtn px-3"
        type="button"
        onClick={props.onAddUser}
      >
        Add
      </button>
    ) : (
      <button
        type="button"
        className="btn rounded text-white themeBtn px-3"
        type="button"
        onClick={props.onUpdateUser}
      >
        Update
      </button>
    );

  if (props.addUser_Loader === true) {
    CTAButton = (
      <div className="dotsWrapper">
        <span className="dot dotOne"></span>
        <span className="dot dotTwo"></span>
        <span className="dot dotThree"></span>
        <span className="dot dotFour"></span>
      </div>
    );
  }

  let successStrip = null;

  if (props.addUserSuccessMsg === true) {
    successStrip = (
      <div className="form-group mb-0 mt-3">
        <p className="text-success alert-success py-1 rounded mb-0 px-3">
          {props.addUserSuccessMsgText}
        </p>
      </div>
    );
  }

  return (
    <Fragment>
      <Modal
        size="lg"
        show={props.showModal}
        animation={false}
        backdrop="static"
        keyboard={false}
        className="border-0"
      >
        <Modal.Header className="align-items-center">
          <h4 className="mb-0">{props.modalTitle}</h4>
          <FontAwesomeIcon
            className="fontIcon c-pointer"
            icon={faTimes}
            onClick={props.onAddUserModalClose}
          />
        </Modal.Header>
        <Modal.Body>
          <Form noValidate>
            <div className="form-group">
              <input
                id="name"
                type="text"
                className="form-control form-control-lg defaultInput"
                placeholder="Arbaz Tyagi"
                name="name"
                value={props.cardDetails.name}
                onChange={(event) => props.onInputChange(event, "name")}
              />
            </div>

            <div className="form-group mb-0">
              <input
                id="designation"
                type="text"
                className="form-control form-control-lg defaultInput"
                placeholder="Mean Stack Developer"
                name="designation"
                value={props.cardDetails.designation}
                onChange={(event) => props.onInputChange(event, "designation")}
              />
            </div>
            {successStrip}
          </Form>
          <div className="mt-3">
            <ErrorList errors={props.errors} />
          </div>
        </Modal.Body>
        <Modal.Footer className="d-block">{CTAButton}</Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default AddUserCard;
