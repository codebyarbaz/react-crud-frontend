import React, { Fragment, Component } from "react";
import Header from "../../Components/Header/Header";
import AddUserCard from "./AddUserCard/AddUserCard";
import UserCardList from "./UserCardList/UserCardList";
import ConfirmDelete from "./ConfirmDelete/ConfirmDelete";

import { decodeToken } from "../../utils/utils";
import constants from "../../config/constants";

import axios from "../../config/axios";

import "../Signup/Signup.css";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      loggedUser: "guest",
      users: [],
      showModal: false,
      showDeleteModal: false,
      cardDetails: {
        name: "",
        designation: "",
      },
      editCardId: "",
      modalTitle: "Add New User",
      addUser_Loader: false,
      errors: [],
      deleteUser_Id: "",
      deleteUser_Loader: false,
      addUserSuccessMsg: false,
      addUserSuccessMsgText: "",
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

          this.setState({
            ...this.state,
            isAdmin,
            loggedUser: tokenDetails.data.name,
          });
        } else {
          this.props.history.push("/");
          return;
        }
      }
    }
  }

  onInputChange(evt, type) {
    const cardDetails = { ...this.state.cardDetails };
    cardDetails[type] = evt.target.value;
    this.setState({ ...this.state, cardDetails });
  }

  async getUsers() {
    const result = await axios.getRequest("/api/v1/card", null);

    if (result.success === true) {
      this.setState({ ...this.state, users: result.data });
    }
  }

  toggleAddUserModal(open) {
    this.setState({ ...this.state, showModal: open });
  }

  toggleDeleteUserModal(open) {
    const state = { ...this.state, showDeleteModal: open };
    if (open === false) {
      state.deleteUser_Id = "";
    }
    this.setState(state);
  }

  onAddUserModalClose() {
    this.setState({
      ...this.state,
      showModal: false,
      cardDetails: {
        name: "",
        designation: "",
      },
      modalTitle: "Add New User",
      addUser_Loader: false,
      errors: [],
      addUserSuccessMsg: false,
      editCardId: "",
    });
  }

  validateDetails() {
    const errors = [];
    const cardDetails = { ...this.state.cardDetails };

    if (!cardDetails.name) {
      errors.push("Please enter name");
    }

    if (!cardDetails.designation) {
      errors.push("Please enter designation");
    }

    return errors;
  }

  async onAddUser() {
    try {
      const errors = this.validateDetails();
      if (errors && errors.length) {
        this.setState({ ...this.state, errors });
        return;
      }

      this.setState({ ...this.state, addUser_Loader: true });

      const result = await axios.postRequest(
        "/api/v1/card",
        this.state.cardDetails,
        {
          headers: { authorization: localStorage.getItem("token") },
        }
      );

      if (result && result.success === true) {
        const users = [...this.state.users];
        users.unshift(result.data);

        this.setState({
          ...this.state,
          loader: false,
          users,
          addUserSuccessMsgText: "User card added!",
          addUserSuccessMsg: true,
          cardDetails: {
            name: "",
            designation: "",
          },
          errors: [],
          addUser_Loader: false,
        });
      } else {
        this.setState({
          ...this.state,
          errors: [result.msg],
          addUser_Loader: false,
          addUserSuccessMsgText: "",
        });
      }
    } catch (err) {
      console.log(err);
      this.setState({
        ...this.state,
        errors: ["Something went wrong"],
      });
    }
  }

  onConfirmDelete(id) {
    this.setState({ ...this.state, showDeleteModal: true, deleteUser_Id: id });
  }

  async onDeleteUser() {
    try {
      if (this.state.deleteUser_Id) {
        this.setState({
          ...this.state,
          deleteUser_Loader: true,
        });

        const result = await axios.deleteRequest(
          `/api/v1/card/${this.state.deleteUser_Id}`,
          {
            headers: { authorization: localStorage.getItem("token") },
          }
        );

        if (result && result.success === true) {
          const index = this.state.users.findIndex(
            (user) => user._id === this.state.deleteUser_Id
          );
          if (index > -1) {
            const users = [...this.state.users];
            users.splice(index, 1);
            this.setState({
              ...this.state,
              users,
              showDeleteModal: false,
              deleteUser_Id: "",
              deleteUser_Loader: false,
            });
          }
        }
      }
    } catch (err) {
      console.log(err);
      this.setState({
        ...this.state,
        showDeleteModal: false,
        deleteUser_Id: "",
        deleteUser_Loader: false,
      });
    }
  }

  async onEditUser(id) {
    const result = await axios.getRequest(`/api/v1/card/${id}`);

    if (result && result.success === true) {
      this.setState({
        ...this.state,
        editCardId: result.data._id,
        showModal: true,
        modalTitle: `Edit - ${result.data.name}`,
        cardDetails: {
          name: result.data.name,
          designation: result.data.designation,
        },
      });
    }
  }

  async onUpdateUser() {
    if (this.state.editCardId) {
      try {
        this.setState({ ...this.state, addUser_Loader: true });

        const result = await axios.patchRequest(
          `/api/v1/card/${this.state.editCardId}`,
          this.state.cardDetails,
          {
            headers: { authorization: localStorage.getItem("token") },
          }
        );

        if (result && result.success === true) {
          const users = [...this.state.users];
          const index = users.findIndex(
            (user) => user._id === this.state.editCardId
          );
          if (index > -1) {
            users[index].name = this.state.cardDetails.name;
            users[index].designation = this.state.cardDetails.designation;
          }

          this.setState({
            ...this.state,
            loader: false,
            users,
            addUserSuccessMsg: true,
            errors: [],
            addUserSuccessMsgText: "User card updated!",
            addUser_Loader: false,
            editCardId: "",
          });
        } else {
          this.setState({
            ...this.state,
            errors: [result.msg],
            addUser_Loader: false,
            addUserSuccessMsgText: "",
          });
        }
      } catch (err) {
        console.log(err);
        this.setState({
          ...this.state,
          errors: ["Something went wrong"],
          addUser_Loader: false,
          addUserSuccessMsgText: "",
        });
      }
    }
  }

  async componentDidMount() {
    document.title = "Admin Panel";
    this.getUsers();
    this.isAdmin();
  }

  render() {
    let usersList = (
      <UserCardList
        users={this.state.users}
        onConfirmDelete={this.onConfirmDelete.bind(this)}
        onEditUser={this.onEditUser.bind(this)}
      />
    );

    if (this.state.users.length === 0) {
      usersList = <p className="mb-0">No user cards found!</p>;
    }

    return (
      <Fragment>
        <Header user={this.state.loggedUser} isAdmin={this.state.isAdmin} />

        <div className="container mt-sm-5 mt-4 px-0 px-sm-3">
          <div className="row mx-0">
            <div className="col-12 mb-sm-5 mb-4">
              <button
                onClick={() => this.toggleAddUserModal(true)}
                type="button"
                className="btn rounded text-white themeBtn px-3"
              >
                Add User Card
              </button>
            </div>
            <div className="col-12">{usersList}</div>
          </div>
        </div>
        <AddUserCard
          showModal={this.state.showModal}
          cardDetails={this.state.cardDetails}
          modalTitle={this.state.modalTitle}
          addUser_Loader={this.state.addUser_Loader}
          errors={this.state.errors}
          addUserSuccessMsg={this.state.addUserSuccessMsg}
          addUserSuccessMsgText={this.state.addUserSuccessMsgText}
          onInputChange={this.onInputChange.bind(this)}
          onAddUserModalClose={this.onAddUserModalClose.bind(this)}
          onAddUser={this.onAddUser.bind(this)}
          onUpdateUser={this.onUpdateUser.bind(this)}
        />
        <ConfirmDelete
          showDeleteModal={this.state.showDeleteModal}
          deleteUser_Loader={this.state.deleteUser_Loader}
          toggleDeleteUserModal={this.toggleDeleteUserModal.bind(this)}
          onDeleteUser={this.onDeleteUser.bind(this)}
        />
      </Fragment>
    );
  }
}
