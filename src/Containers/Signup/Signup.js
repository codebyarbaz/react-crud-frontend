import React, { Fragment, Component } from "react";
import validator from "validator";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import Header from "../../Components/Header/Header";
import ErrorList from "../../Components/ErrorList/ErrorList";

import constants from "../../config/constants";

import { decodeToken } from "../../utils/utils";

import axios from "../../config/axios";

import "./Signup.css";
import signup_banner from "../../assets/img/signup.png";

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      signupDetails: {
        name: "",
        email: "",
        password: "",
        role: constants.USER_ROLES.ADMIN,
      },
      errors: [],
      successMsg: false,
      showPassword: false,
      loggedUser: "guest",
      isAdmin: false,
    };
  }

  isAdmin() {
    const token = localStorage.getItem("token");
    if (token) {
      const tokenDetails = decodeToken(token);
      if (tokenDetails.success === true) {
        let isAdmin = false;
        if (tokenDetails.data.role === constants.USER_ROLES.ADMIN) {
          isAdmin = true;
        }

        this.setState({
          ...this.state,
          isAdmin,
          loggedUser: tokenDetails.data.name,
        });
      }
    }
  }

  onInputChange(evt, type) {
    const signupDetails = { ...this.state.signupDetails };
    signupDetails[type] = evt.target.value;
    this.setState({ ...this.state, signupDetails });
  }

  validateDetails() {
    const errors = [];
    const signupDetails = { ...this.state.signupDetails };
    if (!signupDetails.name) {
      errors.push("Please enter name");
    }

    if (!signupDetails.email) {
      errors.push("Please enter email");
    } else {
      if (!validator.isEmail(signupDetails.email)) {
        errors.push("Please enter valid email address");
      }
    }

    if (!signupDetails.password) {
      errors.push("Please enter password");
    } else {
      if (signupDetails.password.length < 5) {
        errors.push("Password must be at least 5 characters long");
      }
    }

    return errors;
  }

  async onSignup() {
    try {
      const errors = this.validateDetails(this.state.signupDetails);
      if (errors.length) {
        this.setState({ ...this.state, errors });
        return;
      }

      this.setState({ ...this.state, loader: true });

      const result = await axios.postRequest(
        "/api/v1/user",
        this.state.signupDetails
      );

      if (result && result.success === true) {
        this.setState({
          ...this.state,
          loader: false,
          signupDetails: {
            name: "",
            email: "",
            password: "",
            role: constants.USER_ROLES.ADMIN,
          },
          errors: [],
          successMsg: true,
        });
      } else {
        this.setState({
          ...this.state,
          loader: false,
          errors: [result.msg],
          successMsg: false,
        });
      }
    } catch (err) {
      console.log(err);
      this.setState({
        ...this.state,
        errors: ["Something went wrong! Please try again"],
      });
    }
  }

  togglePasswordEye() {
    this.setState({ ...this.state, showPassword: !this.state.showPassword });
    setTimeout(() => {
      const password = document.querySelector("#password");
      if (this.state.showPassword === true) {
        password.type = "text";
      } else if (this.state.showPassword === false) {
        password.type = "password";
      }
    }, 50);
  }

  async componentDidMount() {
    document.title = "Create your account!";
    this.isAdmin();
  }

  render() {
    let CTA = (
      <button
        type="button"
        className="btn btn-block rounded text-white themeBtn"
        onClick={this.onSignup.bind(this)}
      >
        Create Account
      </button>
    );

    if (this.state.loader === true) {
      CTA = (
        <div className="dotsWrapper">
          <span className="dot dotOne"></span>
          <span className="dot dotTwo"></span>
          <span className="dot dotThree"></span>
          <span className="dot dotFour"></span>
        </div>
      );
    }

    let successStrip = null;

    if (this.state.successMsg === true) {
      successStrip = (
        <p className="text-success alert-success py-1 rounded">
          Account created! You can login now
        </p>
      );
    }

    let eye = (
      <FontAwesomeIcon
        onClick={this.togglePasswordEye.bind(this)}
        icon={faEyeSlash}
        className="inputRightIcon"
      />
    );

    if (this.state.showPassword === true) {
      eye = (
        <FontAwesomeIcon
          onClick={this.togglePasswordEye.bind(this)}
          icon={faEye}
          className="inputRightIcon"
        />
      );
    }

    return (
      <Fragment>
        <Header user={this.state.loggedUser} isAdmin={this.state.isAdmin} />
        <section className="mt-lg-5 mt-4">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-5">
                <h1 className="mb-lg-4 mb-3 welcomeHeading">
                  Welcome, please create your account
                </h1>
                <Form noValidate>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-group">
                        <input
                          id="name"
                          type="text"
                          className="form-control form-control-lg defaultInput text-capitalize"
                          placeholder="Full Name"
                          name="name"
                          value={this.state.signupDetails.name}
                          onChange={(event) =>
                            this.onInputChange(event, "name")
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-group">
                        <input
                          id="email"
                          type="text"
                          className="form-control form-control-lg defaultInput"
                          placeholder="info@abc.com"
                          value={this.state.signupDetails.email}
                          name="email"
                          onChange={(event) =>
                            this.onInputChange(event, "email")
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-group position-relative">
                        <input
                          id="password"
                          type="password"
                          className="form-control form-control-lg defaultInput"
                          placeholder="Password"
                          value={this.state.signupDetails.password}
                          name="password"
                          onChange={(event) =>
                            this.onInputChange(event, "password")
                          }
                        />
                        {eye}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label
                          htmlFor="userRole"
                          className="mb-0 extraText userRoleText"
                        >
                          I am an
                        </label>
                        <div className="mt-3 d-flex justify-content-start">
                          <div className="mr-4">
                            <input
                              type="radio"
                              className="radioBtn"
                              id="adminRole"
                              name="userRole"
                              value={constants.USER_ROLES.ADMIN}
                              defaultChecked={true}
                              onChange={(event) =>
                                this.onInputChange(event, "role")
                              }
                            />
                            <label
                              htmlFor="adminRole"
                              className="extraText userRoleText"
                            >
                              Admin
                            </label>
                          </div>

                          <div className="mr-4">
                            <input
                              type="radio"
                              className="radioBtn"
                              id="userRole"
                              name="userRole"
                              value={constants.USER_ROLES.USER}
                              onChange={(event) =>
                                this.onInputChange(event, "role")
                              }
                            />
                            <label
                              htmlFor="userRole"
                              className="extraText userRoleText"
                            >
                              User
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ErrorList errors={this.state.errors} />
                  <div className="row">
                    <div className="col-12 text-center">
                      {successStrip}
                      <div className="form-group CTA_Wrapper">{CTA}</div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <p className="extraText">
                          Already have an account? &nbsp;
                          <Link
                            to="/login"
                            className="d-inline-block text-decoration-none themeColor themeColorHover"
                          >
                            Sign In
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
              <div className="offset-lg-1"></div>
              <div className="col-lg-6 text-lg-right d-none d-lg-block">
                <img
                  className="img-fluid signup_banner"
                  src={signup_banner}
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}
