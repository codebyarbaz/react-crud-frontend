import React from "react";
import { Modal } from "react-bootstrap";

const ConfirmDelete = (props) => {
  let CTA = (
    <button
      type="button"
      className="btn rounded text-white themeBtn px-3"
      type="button"
      onClick={props.onDeleteUser}
    >
      Yes
    </button>
  );

  if (props.deleteUser_Loader === true) {
    CTA = (
      <div className="dotsWrapper">
        <span className="dot dotOne"></span>
        <span className="dot dotTwo"></span>
        <span className="dot dotThree"></span>
        <span className="dot dotFour"></span>
      </div>
    );
  }

  return (
    <Modal
      size="sm"
      show={props.showDeleteModal}
      animation={false}
      onHide={() => props.toggleDeleteUserModal(false)}
    >
      <Modal.Header>
        <Modal.Title>
          <h4 className="mb-0">Are you sure?</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-6 text-center">{CTA}</div>
            <div className="col-6 text-center">
              <button
                type="button"
                className="btn rounded text-white themeBtn px-3"
                type="button"
                onClick={() => props.toggleDeleteUserModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmDelete;
