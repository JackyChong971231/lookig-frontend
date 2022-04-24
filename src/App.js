import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/profile/login.component";
import Register from "./components/profile/register.component";
import Home from "./components/home/home.component";
import Search from "./components/search/search.component";
import SavedShops from "./components/savedShops/savedShops.component"
import Profile from "./components/profile/profile.component";
import BoardUser from "./components/board-user.component";
import Add from "./components/add/add.component";
import CategoryTree from "./components/global/categoryTree.component";
// import BoardModerator from "./components/board-moderator.component";
// import BoardAdmin from "./components/board-admin.component";

// images/logo
import homeLogo from "./ui/App/Home.png"
import addLogo from "./ui/App/Add.png"
import searchLogo from "./ui/App/Search.png"
import wishlistLogo from "./ui/App/Wishlist.png"
import profileLogo from "./ui/App/Profile.png"

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
  }

  logOut() {
    AuthService.logout();
  }

  render() {
    const { currentUser, showModeratorBoard, showAdminBoard } = this.state;
    return (
      <>
        <div className="midContainer">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route path="/add" component={Add} />
            <Route path="/search" component={Search} />
            <Route path="/user" component={SavedShops} />
            <Route path="/profile" component={Profile} />
            <Route path="/categoryTree" component={CategoryTree} />
            {/* <Route path="/mod" component={BoardModerator} />
            <Route path="/admin" component={BoardAdmin} /> */}
          </Switch>
        </div>
        <div className="popUpLikeContainer">
          <Switch>
            <Route exact path={["/profile/login","/add/login"]} component={Login} />
            <Route exact path={["/profile/register","/add/register"]} component={Register} />
          </Switch>
        </div>

        <nav className="navbar top navbar-expand navbar-light bg-white border-bottom">
          <Link to={"/"} className="navbar-brand mx-auto">
            Lookig
          </Link>
        </nav>

        <nav className="navbar bottom navbar-expand navbar-light bg-white border-top">
          <div className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                <img src={homeLogo} width="40" height="40" alt="" />
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/add"} className="nav-link">
                <img src={addLogo} width="40" height="40" alt="" />
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/search"} className="nav-link">
                <img src={searchLogo} width="40" height="40" alt="" />
              </Link>
            </li>

            {/* <li className="nav-item">
              <Link to={"/user"} className="nav-link">
                <img src={wishlistLogo} width="40" height="40" alt="" />
              </Link>
            </li> */}

            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                <img src={profileLogo} width="40" height="40" alt="" />
              </Link>
            </li>
          </div>
        </nav>
      </>
    );
  }
}

export default App;