import React from "react";

import "./ErrorList.css";

const ErrorList = (props) => {
  let html = null;

  if (props.errors && props.errors.length) {
    html = (
      <div className="row">
        <div className="col-12">
          <ul className="errorList list-unstyled ml-5">
            {props.errors.map((err, i) => (
              <li key={i}>
                <p className="mb-0 text-danger d-inline-block">{err}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  return html;
};

export default ErrorList;
