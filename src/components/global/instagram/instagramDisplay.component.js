import React, { Component } from "react";
import PublicService from "../../../services/public.service";
import AuthService from "../../../services/auth.service";
import UserService from "../../../services/user.service";
import filledHeart from "../../../ui/Wishlist/filledHeart.png";
import emptyHeart from "../../../ui/Wishlist/emptyHeart.png"

import "./instagramDisplay.component.css"


export default class InstagramListView extends Component {
  constructor(props) {
    super(props);
    this.likeShopBtn = React.createRef();
    this.state = {
      currentUser: AuthService.getCurrentUser(),
      totalMarks: '',
      numOfRatings: '',
      avrgMarks: ''
    };
  }

  componentDidMount() {
    this.getReview();
  }

  // componentDidUpdate() {
  //   this.getReview();
  // }

  function1() {
    PublicService.getLinkPreview("https://instagram.com/wwhitetale?utm_medium=copy_link")
    .then(response => {
      console.log(response)
    });
  }

  getReview() {
    var totalMarks = 0
    var numOfRatings = 0
    var avrgMarks = 0

    for (const currentReview of this.props.shop.review) {
      if (Number.isInteger(currentReview.rating)) {
        totalMarks += currentReview.rating
        numOfRatings += 1
      }
    }
    avrgMarks = totalMarks/numOfRatings
    avrgMarks = +(Math.round(avrgMarks + "e+1")  + "e-1")

    this.setState({
      totalMarks: String(totalMarks),
      numOfRatings: String(numOfRatings),
      avrgMarks: String(avrgMarks)
    })
  }

  triggerReview() {
    this.props.searchComponent.searchResultArea.current.style.filter = "blur(1px)";
    this.props.searchComponent.bottomContainer.current.style.top = "0%";
    const reviewContent = {
      shopName: this.props.shop.shop_name,
      shop_id: this.props.shop.shop_id,
      content: this.props.shop.review,
    }
    this.props.searchComponent.setState({bottomContainerContent: reviewContent});
    this.props.searchComponent.setState({isLeftComment: false});
  }

  saveOrUnsavedShop() {
    const currentUserData = JSON.parse(localStorage.getItem('user'));
    if ( currentUserData.liked_shops === null ) {
      currentUserData.liked_shops = [this.props.shop.shop_id];
    } else {
      if (currentUserData.liked_shops.includes(this.props.shop.shop_id)) {
        const index = currentUserData.liked_shops.indexOf(this.props.shop.shop_id);
        currentUserData.liked_shops.splice(index, this.props.shop.shop_id);
        this.likeShopBtn.current.src = emptyHeart;
      } else {
        currentUserData.liked_shops.unshift(this.props.shop.shop_id);
        this.likeShopBtn.current.src = filledHeart;
      }
    }
    localStorage.setItem('user', JSON.stringify(currentUserData));
    UserService.saveOrUnsavedShop(currentUserData.liked_shops)
      .then(response => {
        console.log(response)
      })
  }

  isSaved() {
    const {currentUser} = this.state;
    if (currentUser && currentUser.liked_shops !== null) {
      if (currentUser.liked_shops.includes(this.props.shop.shop_id)) {
        return filledHeart
      } else {
        return emptyHeart
      }
    } else {
      return emptyHeart
    }
  }

  render() {
    const { totalMarks, numOfRatings, avrgMarks } = this.state;
    const percentage = String(avrgMarks / 5 *100)
    return (
      <div className="instagramListViewContainer">
        <div className="instagramDataConatiner">
          <div className="instagramProfilePicture"></div>
          <div>
            <h1 className="instagramProfileUsername">{this.props.shop.shop_name}</h1>
            <p className="instagramProfileFollowers">Followers: </p>
          </div>
        </div>
        <div className="instagramReviewContainer" onClick={() => this.triggerReview()}>
          <p className="instagramReviewScore">{(numOfRatings > 0)? avrgMarks : "-"}</p>
          <p>/5 <small><small>{numOfRatings} ratings</small></small></p><br />
          {(numOfRatings > 0)? (
            <button className="instagramReviewSeeBtn" onClick={() => this.triggerReview()}>See reviews</button>
          ) : null}
        </div>
        <img ref={this.likeShopBtn} className="isLikedShop" src={this.isSaved()} onClick={() => this.saveOrUnsavedShop()} alt=""></img>
        <div className="categoryListContainer">
          {/* {this.showCategory()} */}
        </div>
        {/* <button onClick={() => this.function1()}>asdfasdf</button> */}
        {/* <iframe width="100%" height="100%" title="IG Profile" src="https://instagram.com/wwhitetale?utm_medium=copy_link/embed"></iframe> */}
      </div>
    );
  }
}