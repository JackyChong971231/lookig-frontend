import React, { Component } from "react";

import PublicService from "../../services/public.service";
import "./instagramFeed.css"
import Feed from "react-instagram-authless-feed"


export default class InstagramFeed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  componentDidMount() {
  }

  getInstagramFeed(username) {
    console.log(username);
  }

  render() {
    const { categoryContainer } = this.state;
    return (
      <div className="instagramFeedContainer">
        <p>hello</p>
        <button onClick={() =>  this.getInstagramFeed('cggyee')}>test</button>
      </div>
    );
  }
}