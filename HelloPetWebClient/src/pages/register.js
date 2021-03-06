import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import { CometChat } from "@cometchat-pro/chat";
import { COMETCHAT_CONSTANTS } from "../const";
import AuthService from "../services/auth.service";
import { Link } from "react-router-dom";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const email = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vname = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

export class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      name: "",
      username: "",
      email: "",
      password: "",
      successful: false,
      message: "",
    };
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value,
    });
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value,
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  handleRegister(e) {
    e.preventDefault();

    var appID = COMETCHAT_CONSTANTS.APP_ID;
    var region = COMETCHAT_CONSTANTS.REGION;

    var appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(region)
      .build();
    CometChat.init(appID, appSetting).then(
      () => {
        if (CometChat.setSource) {
          CometChat.setSource("ui-kit", "web", "reactjs");
        }
        let authKey = COMETCHAT_CONSTANTS.AUTH_KEY;
        var uid = this.state.username;
        var name = this.state.name;

        var user = new CometChat.User(uid);

        user.setName(name);

        CometChat.createUser(user, authKey).then(
          (user) => {
            console.log("user created", user);
          },
          (error) => {
            console.log("error", error);
          }
        );
      },
      (error) => {
        console.log("Initialization failed with error:", error);
        // Check the reason for error and take appropriate action.
      }
    );

    this.setState({
      message: "",
      successful: false,
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.register(
        this.state.name,
        this.state.username,
        this.state.email,
        this.state.password
      ).then(
        (response) => {
          this.setState({
            message: response.data.message,
            successful: true,
          });
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: resMessage,
          });
        }
      );
    }
  }

  render() {
    return (
      <div>
        <div className="page-content page-auth " id="register">
          <div className="section-store-auth">
            <div className="container">
              <div className="row align-items-center row-login">
                <div className="col-lg-6 text-center">
                  <img
                    src="/assets/images/login-placeholder.png"
                    alt=""
                    className="w-50 mb-4 mb-lg-none"
                  />
                </div>
                <div className="col-lg-5">
                  <h2>
                    Cari kebutuhan perlengkapan <br />
                    untuk hewan kesayanganmu disini
                  </h2>
                  <Form
                    className="mt-3"
                    onSubmit={this.handleRegister}
                    ref={(c) => {
                      this.form = c;
                    }}
                  >
                    {!this.state.successful && (
                      <div>
                        <div className="form-group">
                          <label htmlFor="name">Full Name</label>
                          <Input
                            type="text"
                            className="form-control is-valid"
                            name="name"
                            value={this.state.name}
                            onChange={this.onChangeName}
                            validations={[required, vname]}
                            autofocus
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="username">Username</label>
                          <Input
                            type="text"
                            className="form-control is-invalid"
                            name="username"
                            value={this.state.username}
                            onChange={this.onChangeUsername}
                            validations={[required, vusername]}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="email">Email</label>
                          <Input
                            type="email"
                            className="form-control is-invalid"
                            aria-describedby="emailHelp"
                            name="email"
                            value={this.state.email}
                            onChange={this.onChangeEmail}
                            validations={[required, email]}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="password">Password</label>
                          <Input
                            type="password"
                            className="form-control"
                            name="password"
                            value={this.state.password}
                            onChange={this.onChangePassword}
                            validations={[required, vpassword]}
                          />
                        </div>

                        <div className="form-group">
                          <button
                            type="submit"
                            className="btn btn-success btn-block mt-4"
                          >
                            Sign Up Now
                          </button>
                          <Link
                            to={"/login"}
                            className="btn btn-signup btn-block mt-2"
                          >
                            Back to Sign In
                          </Link>
                        </div>
                      </div>
                    )}

                    {this.state.message && (
                      <div className="form-group">
                        <div
                          className={
                            this.state.successful
                              ? "alert alert-success"
                              : "alert alert-danger"
                          }
                          role="alert"
                        >
                          {this.state.message}
                        </div>
                      </div>
                    )}
                    <CheckButton
                      style={{ display: "none" }}
                      ref={(c) => {
                        this.checkBtn = c;
                      }}
                    />
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
