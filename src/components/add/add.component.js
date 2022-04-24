import React, { Component } from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";


import PublicService from "../../services/public.service";
import AuthService from "../../services/auth.service";
import CategoryTree from "../global/categoryTree.component";
import "./add.component.css";

import UserService from "../../services/user.service";
import UiLibrary from "../global.element"

const NOT_YET_SIGNED_IN = "No token provided!"

export default class Add extends Component {
  constructor(props) {
    super(props);
    this.isShopOwnerCheckBox = React.createRef();
    this.state = {
      currentUser: AuthService.getCurrentUser(),
      isShopOwner: false,
      isSkippedSignIn: false,
      isAboutToSubmit: false,
      enteredShopName: "",
      selectedCategories: {},
      selectedCategoriesList: [],
      has_physical_store: 0,
      addShopStatusMessage: ""
    };
    this.pageName = 'add'
  }

  componentDidMount() {
    // Clear Local Storage
    localStorage.setItem("addShopInfo",JSON.stringify({
      shop_name: this.state.enteredShopName,
      selectedCategoriesById: [],
      has_physical_store: this.state.has_physical_store
    }))
  }

  isShopDetailedCorrectlyFilled() {
    const {enteredShopName, selectedCategories, isShopOwner, currentUser} = this.state;
    return (
      (enteredShopName !== "")&&
      (Object.keys(selectedCategories).length > 0)&&
      (!isShopOwner || (isShopOwner&&currentUser))
    )
  }

  generateNewShopInfo() {
    const { enteredShopName, isShopOwner, currentUser, has_physical_store } = this.state
    const user_id = (currentUser? currentUser.id: null)
    const shopOwnerUserId = (isShopOwner? user_id : null)
    return {
      shop_name: enteredShopName,
      added_by_user_id: user_id,
      owned_by_user_id: shopOwnerUserId,
      category_combination_ids: JSON.parse(localStorage.getItem('addShopInfo')).selectedCategoriesById,
      is_active: 1,
      has_physical_store: has_physical_store
    }
  }

  addShop() {
    // console.log(this.generateNewShopInfo())
    PublicService.addShop(this.generateNewShopInfo())
      .then(status => {
        this.setState({addShopStatusMessage: status[1]})
      })
  }

  toggleShopOwnerCheckBox() {
    const checkBox = this.isShopOwnerCheckBox.current;
    if (checkBox.checked) {
      this.setState({ isShopOwner: true });
    } else {
      this.setState({ isShopOwner: false });
    }
  }

  updateSelectedCategories() {
    const { selectedCategories, enteredShopName, has_physical_store } = this.state;
    var selectedCategoriesList = [];
    var selectedCategoriesById = [];
    for (let category in selectedCategories) {
      selectedCategoriesList.push(<div className="selectedCategoriesDiv">{category}<button className="selectedCategoriesDiv cancel" onClick={() => this.deleteCategory(category)}/></div>)
      selectedCategoriesById.push(selectedCategories[category].category_id)
    }
    this.setState({ selectedCategoriesList: selectedCategoriesList });
    // Update Local Storage
    localStorage.setItem("addShopInfo",JSON.stringify({
      shop_name: enteredShopName,
      selectedCategoriesById: selectedCategoriesById,
      has_physical_store: has_physical_store
    }))
    this.checkSelectedCategory();
  }

  checkSelectedCategory() {
    var allCheckBox = Array.from(document.getElementsByClassName("categoryCheckBox"));
    allCheckBox.forEach(checkBox => {checkBox.checked = false})
    const selectedCategoriesById = JSON.parse(localStorage.getItem('addShopInfo')).selectedCategoriesById;
    selectedCategoriesById.forEach(category_id => {
      var tempCheckBox = document.getElementById("categoryCheckBox " + String(category_id))
      if (tempCheckBox) {tempCheckBox.checked = true}
    })
  }

  deleteCategory(categoryName) {
    const { isAboutToSubmit } = this.state;
    var { selectedCategories } = this.state;
    if (!isAboutToSubmit) {
      delete selectedCategories[categoryName];
      this.setState({ selectedCategories: selectedCategories }, () => {this.updateSelectedCategories()});

    }
  }

  addCategoryToShop(button,categoryNameArray,category_id) {
    const categoryNameCombinedStr = categoryNameArray.join(' > ')
    if (button.checked === true) {
      var { selectedCategories } = this.state;
      if (!(categoryNameCombinedStr in selectedCategories)) {
        selectedCategories[categoryNameCombinedStr] = {category_id:category_id};
        if (Object.keys(selectedCategories).length <= 10) {
          this.setState({ selectedCategories: selectedCategories }, () => {this.updateSelectedCategories()});
        }
      }
      button.checked = true;
    } else {
      this.deleteCategory(categoryNameCombinedStr)
    }
  }



  render() {
    const { selectedCategoriesList, currentUser, isSkippedSignIn, isShopOwner, isAboutToSubmit, enteredShopName, addShopStatusMessage } = this.state;
    const categoriesLeftCount = 10-selectedCategoriesList.length;
    return (
      <>
        <div className="addOuterMostContainer" style={{filter: (isAboutToSubmit? "blur(4px)": "blur(0)")}}>
          <h1>Add Instagram Shop</h1>
          <button
            style={{
              opacity: (this.isShopDetailedCorrectlyFilled() ? "100%" : "0%"),
              top: (this.isShopDetailedCorrectlyFilled() ? "0px" : "-40px")
            }}
            className="addShopSubmitBtn"
            onClick={() => this.setState({ isAboutToSubmit: true })}
            >Submit</button>
          <input type="search" className="addShopNameInput" placeholder="Instagram account name of the IG shop"
            value={enteredShopName} onChange={e => this.setState({ enteredShopName: e.target.value }, this.checkSelectedCategory())}>
          </input>
          <div className="isOwnerContainer mx-auto">
            <p>Are you the shop owner?</p>
            <input type="checkbox" ref={this.isShopOwnerCheckBox} onClick={() => this.toggleShopOwnerCheckBox()} id="isOwner" name="isOwner" value="ownerYes" />
            <p>Yes</p>
          </div>

          {(!currentUser)? (
          <div className="addShopIsSignedInContainer">
            <button>
              <Link to={"/add/register"} className="buttons">
                Sign Up
              </Link>
            </button>
            <button>
              <Link to={"/add/login"} className="buttons">
                Sign In
              </Link>
            </button>
            {(!isShopOwner)? (
              <button style={{
                backgroundColor: (isSkippedSignIn? UiLibrary.color.darkGray: UiLibrary.color.white),
                color: (isSkippedSignIn? UiLibrary.color.white : UiLibrary.color.defaultFontColor)
                }}
                onClick={() => this.setState({ isSkippedSignIn: true })}>Skip</button>
            ): (null)}
          </div>
          ): (null)}        

          {((currentUser) || (isSkippedSignIn && !isShopOwner))? (
            <div className="addPageCategoryTreeArea">
              <div className="selectedCategories">
                <p>Choose up to 10 categories: {categoriesLeftCount} left</p>
                <div className="selectedCategoriesListContainer">
                  {selectedCategoriesList}
                </div>
              </div>
              <CategoryTree childComponent={this} />
            </div>
          ) : (
            null
          )}
        </div>

        <div className="confirmSubmitContainer" style={{top: (isAboutToSubmit? "0%" : "100%")}}>
          <div className="confirmSubmitOutside" onClick={() => {this.setState({isAboutToSubmit: false})}}/>
          <div className="confirmSubmitContent">
            <button type="button" className="confirmSubmitContentCloseBtn" onClick={() => {this.setState({isAboutToSubmit: false})}}>&times;</button>            
            <div className="addShopInfo">
              <p>Shop Name: {enteredShopName}</p>
              <p>Category: </p>
              {selectedCategoriesList}
              {/* {isShopOwner? (
                <div className="shopOwnerVerificationContainer">
                  <p>Verification Code sent to the IG shop account</p>
                </div>
              ):(null)} */}
              <div className="hasPhysicalStoreContainer">
                <p>It owns a physical store: </p>
                <input type="checkbox" name="hasPhysicalStore"
                onClick={(e) => {this.setState({ has_physical_store: (e.target.checked)? 1: 0 })}}></input>
              </div>
              <button onClick={() => this.addShop()}>Confirm</button>
              <p>{addShopStatusMessage}</p>
            </div>
          </div>
        </div>
        {/* <div className="dummyContainer" /> */}
      </>
    );
  }
}