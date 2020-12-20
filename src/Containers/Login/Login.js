import React, { Fragment, Component } from "react";
import validator from "validator";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import Header from "../../Components/Header/Header";
import ErrorList from "../../Components/ErrorList/ErrorList";

import { decodeToken } from "../../utils/utils";
import constants from "../../config/constants";

import axios from "../../config/axios";

import "../Signup/Signup.css";
import signup_banner from "../../assets/img/signup.png";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      loginDetails: {
        email: "",
        password: "",
      },
      errors: [],
      showPassword: false,
      loggedUser: "guest",
      isAdmin: false,
    };
  }

  onInputChange(evt, type) {
    const loginDetails = { ...this.state.loginDetails };
    loginDetails[type] = evt.target.value;
    this.setState({ ...this.state, loginDetails });
  }

  validateDetails() {
    const errors = [];
    const loginDetails = { ...this.state.loginDetails };

    if (!loginDetails.email) {
      errors.push("Please enter email");
    } else {
      if (!validator.isEmail(loginDetails.email)) {
        errors.push("Please enter valid email address");
      }
    }

    if (!loginDetails.password) {
      errors.push("Please enter password");
    }

    return errors;
  }

  async onLogin() {
    try {
      const errors = this.validateDetails(this.state.loginDetails);
      if (errors.length) {
        this.setState({ ...this.state, errors });
        return;
      }

      this.setState({ ...this.state, loader: true });

      const result = await axios.postRequest(
        "/api/v1/auth/login",
        this.state.loginDetails
      );

      if (result && result.success === false) {
        this.setState({
          ...this.state,
          loader: false,
          errors: [result.msg],
        });
        return;
      }

      const tokenDetails = decodeToken(result.token);
      if (tokenDetails && tokenDetails.success === false) {
        this.setState({
          ...this.state,
          errors: ["Login failed!"],
        });
        return;
      }

      localStorage.setItem("token", result.token);

      if (
        tokenDetails &&
        tokenDetails.data &&
        tokenDetails.data.role === constants.USER_ROLES.ADMIN
      ) {
        this.props.history.push("/admin");
      } else {
        this.props.history.push("/");
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

  isAdmin() {
    const token = localStorage.getItem("token");
    if (token) {
      const tokenDetails = decodeToken(token);
      if (tokenDetails.success === true) {
        if (tokenDetails.data.role === constants.USER_ROLES.ADMIN) {
          this.props.history.push("/admin");
        } else {
          this.props.history.push("/");
        }

        return;
      }
    }
  }

  async componentDidMount() {
    document.title = "Login into your account!";
    this.isAdmin();
  }

  render() {
    let CTA = (
      <button
        type="button"
        className="btn btn-block rounded text-white themeBtn"
        onClick={this.onLogin.bind(this)}
      >
        Sign In
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
                  Welcome, please login your account
                </h1>
                <Form noValidate>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-group">
                        <input
                          id="email"
                          type="text"
                          className="form-control form-control-lg defaultInput"
                          placeholder="info@abc.com"
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
                          name="password"
                          onChange={(event) =>
                            this.onInputChange(event, "password")
                          }
                        />
                        {eye}
                      </div>
                    </div>
                  </div>
                  <ErrorList errors={this.state.errors} />
                  <div className="row">
                    <div className="col-12 text-center">
                      <div className="form-group CTA_Wrapper">{CTA}</div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <p className="extraText">
                          Don’t have an account? &nbsp;
                          <Link
                            to="/signup"
                            className="d-inline-block text-decoration-none themeColor themeColorHover"
                          >
                            Sign Up
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
