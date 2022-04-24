import React, { Component } from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";

import AuthService from "../../services/auth.service";
import publicService from "../../services/public.service";
import "./profile.component.css"

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.rightProfileContainer = React.createRef();
    this.state = {
      currentUser: AuthService.getCurrentUser(),
      rightProfileContainerContent: {header: "", body: []}
    };
  }

  goTo(url) {
    window.location.href=url;
  }

  logOut() {
    AuthService.logout();
    window.location.href="/profile";
    // <Redirect to="/home" />;
  }

  async viewPendingShop() {
    const header = "Pending Shops";
    var body = [];
    var {rightProfileContainerContent} = this.state;
    const categoryTree = JSON.parse(localStorage.getItem("category_tree"))
    console.log(categoryTree)
    
    publicService.getPendingShops()
      .then(response => {
        for (const eachShop of response) {
          var categories = eachShop.category_combination_ids;
          var categoriesComponents = [];
          for (const eachCategoryTreeCombination of categoryTree) {
            if (categories.includes(eachCategoryTreeCombination.combination_id)) {
              const categoryString = eachCategoryTreeCombination.category1_name + " > " + eachCategoryTreeCombination.category2_name + " > " + eachCategoryTreeCombination.category3_name
              categoriesComponents.push(
                <p>{categoryString}</p>
              )
            }
          }
          body.push(
            <div className="pendingShop">
              <h1>{eachShop.shop_name}</h1>
              <div>
                {categoriesComponents}
              </div>
              <button>Accept</button>
              <button>Abandon</button>
            </div>
          )
        }
        rightProfileContainerContent.header = header;
        rightProfileContainerContent.body = body;
        this.setState({rightProfileContainerContent});
        console.log(categories);
      })
    this.rightProfileContainer.current.style.left = '0%';
  }

  render() {
    const { currentUser, rightProfileContainerContent } = this.state;

    return (
      <div className="profileContainer">
        <div className="accountInfo">
          <div className="proPic">
            <img
              src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
              alt="profile-img"
              className="profile-img-card profile"
            />
          </div>
          {currentUser ? (
            <div className="accountDetails">
              {/* <p>
                <strong>Token:</strong>{" "}
                {currentUser.accessToken.substring(0, 10)} ...{" "}
                {currentUser.accessToken.substr(currentUser.accessToken.length - 10)}
              </p>
              <strong>Authorities:</strong>
              <ul>
                {currentUser.roles &&
                  currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
              </ul> */}
              <p>
                <strong>User ID:</strong>{" "}
                {currentUser.id}
              </p>
              <p>
                <strong>Username:</strong>{" "}
                {currentUser.username}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {currentUser.email}
              </p>
            </div>
          ) : (
            <div className="accountDetails">
              <p>
                <strong>Username:</strong>{" "}
                Anonymous
              </p>
            </div>
          )}
        </div>
        {currentUser ? (
          <div className="accountOptions mx-auto">
            <button className="mx-auto" onClick={() => {this.props.history.goBack()}}>My contribution</button>
            {(currentUser.roles === 'Admin')? (
              <button className="mx-auto" onClick={() => this.viewPendingShop()}>Pending shops</button>
            ): null}
            <button href="/profile" className="mx-auto" onClick={this.logOut}>
              Log Out
            </button>
            {/* <button className="mx-auto" onClick={this.logOut}>Sign Out</button> */}
            <p>Copyright &#169;2022-2022 HKIG <br/> All rights reserved</p>
          </div>
        ) : (
          <div className="accountOptions mx-auto">
            <button className="mx-auto" onClick={() => this.goTo("/profile/login")}>
              <Link to={"/profile/login"} className="buttons">
                  Login
              </Link>
            </button>
            <button className="mx-auto" onClick={() => this.goTo("/profile/register")}>
              <Link to={"/profile/register"} className="buttons">
                Sign Up
              </Link>
            </button>
            <p>Copyright &#169;2022-2022 HKIG <br/> All rights reserved</p>
          </div>
        )}

        <div className="rightProfileContainer" ref={this.rightProfileContainer}>
            <header>
              <button className="rightProfileContainerBackBtn" onClick={() => {
                this.rightProfileContainer.current.style.left = "100%"
                this.setState({rightProfileContainerContent: {header: "", body: []},})
              }}>
                <img src={"back.png"} alt=""/>
              </button>
              <h1>{rightProfileContainerContent.header}</h1>
            </header>
            <body>
              {rightProfileContainerContent.body}
            </body>
        </div>
      </div>
    );
  }
}