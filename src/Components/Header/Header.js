import React from "react";
import { Link, withRouter } from "react-router-dom";

const Header = (props) => {
  const logout = () => {
    localStorage.clear();
    window.location.assign("/login");
  };

  let mainMenu = (
    <ul className="list-unstyled d-flex mb-0 justify-content-end">
      <li className="d-sm-inline-block d-none mr-4">
        <span className="mb-0 themeColor_Secondary d-inline-block font-weight-font-weight-bolder pb-1 mainMenuLink text-decoration-none">
          Welcome, {props.user}!
        </span>
      </li>
      <li className="d-inline-block mr-4">
        <Link
          to="/login"
          className={`text-decoration-none d-inline-block mainMenuLink ${
            props.location && props.location.pathname === "/login"
              ? "activeLink"
              : ""
          }`}
        >
          <span className="mb-0 themeColor_Secondary d-inline-block font-weight-font-weight-bolder pb-1">
            Login
          </span>
        </Link>
      </li>
      <li className="d-inline-block">
        <Link
          to="/signup"
          className={`text-decoration-none d-inline-block mainMenuLink ${
            props.location && props.location.pathname === "/signup"
              ? "activeLink"
              : ""
          }`}
        >
          <span className="mb-0 themeColor_Secondary d-inline-block font-weight-font-weight-bolder pb-1">
            Signup
          </span>
        </Link>
      </li>
    </ul>
  );

  let adminMenu = null;
  if (props.isAdmin === true) {
    adminMenu = (
      <li className="d-inline-block mr-4">
        <Link
          to="/admin"
          className={`text-decoration-none d-inline-block mainMenuLink ${
            props.location && props.location.pathname === "/admin"
              ? "activeLink"
              : ""
          }`}
        >
          <span className="mb-0 themeColor_Secondary d-inline-block font-weight-font-weight-bolder pb-1">
            Admin
          </span>
        </Link>
      </li>
    );
  }

  if (props.user && props.user !== "guest") {
    mainMenu = (
      <ul className="list-unstyled d-flex mb-0 justify-content-end">
        <li className="d-sm-inline-block d-none mr-sm-4 mr-2">
          <span className="mb-0 themeColor_Secondary d-inline-block font-weight-font-weight-bolder pb-1 mainMenuLink text-decoration-none">
            Welcome, {props.user}!
          </span>
        </li>
        {adminMenu}
        <li className="d-inline-block">
          <span
            className="mb-0 themeColor_Secondary d-inline-block font-weight-font-weight-bolder pb-1 text-decoration-none mainMenuLink c-pointer"
            onClick={logout}
          >
            Logout
          </span>
        </li>
      </ul>
    );
  }

  return (
    <header>
      <div className="container-fluid">
        <div className="row py-3 align-items-center">
          <div className="col-sm-6 col-7">
            <Link to="/" className="text-decoration-none d-inline-block">
              <h3 className="mb-0 font-weight-bold mainTitle">
                <span className="d-inline-block themeColor font-weight-bold">
                  React
                </span>
                &nbsp;
                <span className="d-inline-block themeColor_Secondary">
                  CRUD
                </span>
              </h3>
            </Link>
          </div>
          <div className="col-sm-6 col-5">{mainMenu}</div>
        </div>
      </div>
    </header>
  );
};

export default withRouter(Header);
