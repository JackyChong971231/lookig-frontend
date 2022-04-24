import React, { Component } from "react";

import UserService from "../services/user.service";
import InstagramFeed from "./global/instagramFeed";

export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount() {
    UserService.getUserBoard().then(
      response => {
        this.setState({
          content: response.data.message
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  render() {
    return (
      <div className="userContainer">
        <header className="jumbotron">
          <h3>{this.state.content}</h3>
        </header>
        <InstagramFeed />
        {/* <div className="dummyContainer" /> */}
      </div>
    );
  }
}