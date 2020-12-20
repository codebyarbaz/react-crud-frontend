import React, { Fragment, Component } from "react";
import Header from "../../Components/Header/Header";
import UserCard from "../../Components/UserCard/UserCard";

import { decodeToken } from "../../utils/utils";

import constants from "../../config/constants";

import axios from "../../config/axios";

import "../Signup/Signup.css";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: false,
      loader: false,
      userCards: [],
      loggedUser: "guest",
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
          loggedUser: tokenDetails.data.name,
          isAdmin,
        });
      }
    }
  }

  async getUsers() {
    const result = await axios.getRequest("/api/v1/card", {
      headers: { authorization: localStorage.getItem("token") },
    });

    if (result.success === true) {
      this.setState({ ...this.state, userCards: result.data });
    }
  }

  async componentDidMount() {
    document.title = "React CRUD App";
    this.getUsers();
    this.isAdmin();
  }

  render() {
    let userCards = this.state.userCards.map((user, index) => (
      <UserCard {...user} key={index} />
    ));

    if (this.state.userCards.length === 0) {
      userCards = <p className="mb-0">No user cards found!</p>;
    }

    return (
      <Fragment>
        <Header user={this.state.loggedUser} isAdmin={this.state.isAdmin} />
        <div className="container mt-sm-5 mt-4 px-0 px-sm-3">
          <div className="row flex-wrap mx-auto justify-content-center">
            {userCards}
          </div>
        </div>
      </Fragment>
    );
  }
}
