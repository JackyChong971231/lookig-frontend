import React, { Component } from "react";
import AuthService from "../../services/auth.service";
import PublicService from "../../services/public.service";

export default class SavedShops extends Component {
  constructor(props) {
    super(props);

    this.state = {
        currentUser: AuthService.getCurrentUser(),
    };
  }

  componentDidMount() {
    this.getInvolvedCategories();
  }

  getInvolvedCategories() {
    const likedShopsArray = JSON.parse(localStorage.getItem("user")).liked_shops;
    // PublicService.getShopInfoByShopID(likedShopsArray);
  }

  render() {
    const {currentUser} = this.state;
    return (
      <div className="savedShopsContainer">
          <p>{currentUser.id}</p>
      </div>
    );
  }
}