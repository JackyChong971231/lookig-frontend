import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";

import UserService from "../../services/user.service";
import AuthService from "../../services/auth.service";
import PublicService from "../../services/public.service";
import InstagramListView from "../global/instagram/instagramDisplay.component";
import CategoryTree from "../global/categoryTree.component";

import "./search.component.css"

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.searchResultArea = React.createRef();
    this.rightSearchResultContainer1 = React.createRef(); //
    this.rightSearchResultContainer2 = React.createRef();
    this.bottomContainer = React.createRef();
    this.filterContainer = React.createRef();
    this.isOnlyLikedShopCheckbox = React.createRef();
    this.searchInput = React.createRef();
    this.shopList = React.createRef();
    this.addIntoSearchHistory = this.addIntoSearchHistory.bind(this);

    this.state = {
      currentUser: AuthService.getCurrentUser(),
      searchString: "",
      inputOnFocus: false,
      history: null,
      searchResult: "",
      searchResultContainer1Content: {header: "", body: []},
      searchResultContainer2Content: {header: "", body: []},
      bottomContainerContent: {shopName: "", shop_id: null, content: null},
      shopListByCategoryContainer: null,
      currentCategoryCombination: "",
      reviewStar: 0,
      isLeftComment: false,

      searchResultFilter: {
        isOnlyLikedShop: false,
        sortOption: 0     // 0: Followers; 1: Mostly browsed; 2: Top rated
      }
    };
    this.pageName = 'search'
  }

  componentDidMount() {
    localStorage.removeItem('review')
    // localStorage.setItem('review',JSON.stringify({isOpen: false}));
  }

  async onChangeInput(searchString) {
    this.setState({ searchString: searchString });

    if (searchString !== "") {
      const results = await PublicService.queryByInput(searchString);
      // For shops
      var shopsContainerArray = []
      results.shops.forEach(eachShop => {
        shopsContainerArray.push(<div className="igProfileForSearch"><p>{eachShop.shop_name}</p></div>)
      })
      // For category2_name
      var categoriesContainerArray = []
      for (let btn in results.category2_name_btn) {
        categoriesContainerArray.push(
          <button className="categoryForSearch" onClick={() => this.queryByCategory(btn, results.category2_name_btn[btn])}><p>{btn}</p></button>
        )
      }
      // For category3_name
      var subCategoriesContainerArray = []
      results.category3_name_btn.forEach(eachCategory3 => {
        subCategoriesContainerArray.push(
          <button onClick={() => this.queryByCategoryId(eachCategory3.combination_id, eachCategory3.button_text)}>
            <p style={{left: "5%"}}>{eachCategory3.button_text}</p>
            <p style={{right: "5%"}}>&#8594;</p>
          </button>
        )
      })

      this.setState({
        searchResult: [
          <div className="searchResultSections">
            {(shopsContainerArray.length !== 0)? (<h1>Shops: </h1>) : null}
            <div className="searchResultContainer_overflowX">{shopsContainerArray}</div>
          </div>,
          <div className="searchResultSections">
            {(categoriesContainerArray.length !== 0 || subCategoriesContainerArray.length !== 0)? (<h1>Categories: </h1>) : null}
            <div className="searchResultContainer_overflowX">{categoriesContainerArray}</div>

            <div className="searchResultContainer_overflowY">{subCategoriesContainerArray}</div>
          </div>
        ],
        inputOnFocus: true
      });
    }
  }

  // Construct the HTML element when 
  displaySearchHistory() {
    const { currentUser } = this.state;

    var searchHistory = [];
    if (currentUser) {
      searchHistory = JSON.parse(localStorage.getItem('user')).search_history;
    } else {
      searchHistory = null
    }

    if (searchHistory !== null) {
      var historyContainer = [];

      for(let i=0; i<((searchHistory.length < 10)?searchHistory.length:10); i++) {
        historyContainer.push(
          <button className="searchHistory button" type="button" onClick={() => {this.onChangeInput(searchHistory[i])}} alt="">{searchHistory[i]}</button>
        )
      }

      return historyContainer;
    } else { return null }
  }

  addIntoSearchHistory(e) {
    e.preventDefault();
    const { searchString, currentUser } = this.state;
    if (currentUser) {
      var prevUserLocalStorage = JSON.parse(localStorage.getItem('user'))
      if (prevUserLocalStorage.search_history) {
        if (!(prevUserLocalStorage.search_history.includes(searchString))) {
          prevUserLocalStorage.search_history.unshift(searchString)
          localStorage.setItem('user', JSON.stringify(prevUserLocalStorage))
        }
      } else {
        prevUserLocalStorage.search_history = [searchString]
        // console.log(prevUserLocalStorage)
        localStorage.setItem('user', JSON.stringify(prevUserLocalStorage))
      }
      UserService.addIntoSearchHistory(prevUserLocalStorage.search_history);
      return false;
    }
  }

  queryByCategory(category_name, categoryInfo) {
    if ( (categoryInfo.length === 1)&&(categoryInfo[0].category_name.category3_name === 'null') ) {
      const headerString = categoryInfo[0].category_name.category1_name + " > " + categoryInfo[0].category_name.category2_name
      this.queryByCategoryId(categoryInfo[0].category_id, headerString)
    } else {
      var htmlElement = [];
      categoryInfo.forEach(eachCategoryCombination => {
        const headerString = eachCategoryCombination.category_name.category1_name + " > " + eachCategoryCombination.category_name.category2_name + " > " + eachCategoryCombination.category_name.category3_name
        htmlElement.push(
          <button className="subCategoriesBtn" onClick={() => this.queryByCategoryId(eachCategoryCombination.category_id, headerString)}>
            <p style={{left: "5%"}}>{eachCategoryCombination.category_name.category3_name}</p>
            <p style={{right: "5%"}}>&#8594;</p>
          </button>
        )}
      );
      const newContent = {
        header: category_name,
        body: htmlElement
      }
      this.setState({ searchResultContainer1Content: newContent });
      this.rightSearchResultContainer1.current.style.left = "0%";
      console.log('Show category')
    }
  }

  queryByCategoryId(category_id, headerString) {
    PublicService.queryByCategoryId(category_id)
      .then(response => {
        // console.log(response)
        var htmlElement = [];
        response.forEach(eachShop => {
          htmlElement.push(
            <InstagramListView shop={eachShop} searchComponent={this}/>
          )
        });

        const newContent = {
          header: headerString,
          body: htmlElement,
          filterBody: htmlElement
        }
        this.setState({ searchResultContainer2Content: newContent });
        this.rightSearchResultContainer2.current.style.left = "0%";
        this.filterMachine();
      })
  }

  displayArea() {
    const { searchString, searchResult, inputOnFocus, shopListByCategoryContainer, currentCategoryCombination } = this.state;
    if (inputOnFocus) {
      if (searchString !== "") {
        return <div className="searchResultOutermost">{searchResult}</div>
      } else {
        return (
          <div className="searchHistory container">
            <h1>Recent searches:</h1>
            {this.displaySearchHistory()}
          </div>
        )
      }
    } else {
      return (
        <div className="searchByCategoryContainer">
          <CategoryTree childComponent={this}/>
        </div>
      )
    }
  }

  displayReviewContent() {
    const {bottomContainerContent} = this.state;
    var htmlElement = []
    bottomContainerContent.content.forEach(eachReview => {
      const percentage = String(eachReview.rating / 5 * 100)
      htmlElement.push(
        <div className="eachReviewContainer">
          <div className="reviewInfoContainer">
            <div className="reviewFakeUserIcon"><p>{eachReview.user_name[0]}</p></div>
            <p className="reviewUsername">{eachReview.user_name}</p>
            <p className="reviewDate">{eachReview.updatedAt.slice(0,10)}</p>
          </div>
          <div className="reviewContentContainer">
            <div className="starRating reviews" style={{
              background: `linear-gradient(90deg, #fc0 ${percentage}%, #fff ${percentage}%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}>★★★★★</div>
            <p>{eachReview.comment}</p>
          </div>
        </div>
      )
    })
    return htmlElement
  }

  closeReview() {
    this.searchResultArea.current.style.filter = "blur(0px)"
    this.bottomContainer.current.style.top = "100%"
    this.setState({ bottomContainerContent: {shopName: "", shop_id: null, content: null} })
  }

  cancelLeaveReview() {
    this.setState({reviewStar: 0})
    var allCheckBox = Array.from(document.getElementsByClassName("starButton"));
    // console.log(allCheckBox)
    allCheckBox.forEach(checkBox => {checkBox.checked = false})
  }

  submitReview() {
    const {reviewStar, currentUser, bottomContainerContent, isLeftComment } = this.state;
    if (currentUser) {
      var comment = document.getElementsByClassName("reviewContentTextArea")[0].value;
      UserService.submitReview({shop_id: bottomContainerContent.shop_id, rating: reviewStar, comment})
        .then(response => {
          console.log(response)
        })
        this.setState({isLeftComment: true});
    }
  }

  filterMachine() {
    var { searchResultContainer2Content, searchResultFilter, currentUser } = this.state;
    var searchResultContainer2ContentFiltered = [];
    for(const eachShop of searchResultContainer2Content.body) {
      var isThisShopCanBeDisplayed = false
      if (currentUser) {
        // isOnlyLikedShop
        if (this.isOnlyLikedShopCheckbox.current.checked) { if (currentUser.liked_shops.includes(eachShop.props.shop.shop_id))  {isThisShopCanBeDisplayed = true} }
        else                                                                                                                    {isThisShopCanBeDisplayed = true}
      } else {
        isThisShopCanBeDisplayed = true;
      }
      // add the shop or not
      if (isThisShopCanBeDisplayed)   {searchResultContainer2ContentFiltered.push(eachShop)}
    }
    searchResultContainer2Content.filteredBody = searchResultContainer2ContentFiltered;
    this.setState({searchResultContainer2Content});
  } 

  isThisTheSelectedSortingMethod(sortingIndex) {
    if(this.state.searchResultFilter.sortOption === sortingIndex) return <p>&#10003;</p>
    else return null 
  }

  changeSortingMethod(sortingIndex) {
    var {searchResultFilter} = this.state;
    searchResultFilter.sortOption = sortingIndex;
    this.setState({searchResultFilter});
  }

  render() {
    const { inputOnFocus, searchResultContainer1Content, searchResultContainer2Content, bottomContainerContent, reviewStar, isLeftComment } = this.state;
    return (
      <>
        <div className="searchOuterMostContainer" ref={this.searchResultArea} style={{transition: '0.5s'}}>
          <div className="searchMainContainer">
            <form action="#" onSubmit={this.addIntoSearchHistory} ref={c => {this.form = c;}}>
              <input name='search' type="search" className="shopNameInput" placeholder="Search IG shops, products or categories"
                ref={this.searchInput}
                value={this.state.searchString}
                onChange={(e) => this.onChangeInput(e.target.value)}
                onFocus={() => {this.setState({ inputOnFocus: true })}}
                style={{
                  width: (inputOnFocus? "calc(100% - 100px)": "calc(100% - 40px)")
                }}>
              </input>
            </form>
            <button style={{
              right: (inputOnFocus? '5px' : '-40px'),
              opacity: (inputOnFocus? '100%' : '0%')
              }}
              onClick={() => {this.setState({ inputOnFocus: false, searchString: "" })}}
            >cancel</button>

            <div className="searchDisplayArea">
              {this.displayArea()}
            </div>
          </div>
          
          {/* --------------------------------For right container-------------------------------- */}
          <div ref={this.rightSearchResultContainer1} className="rightSearchResult Container1">
            <header>
              <button className="rightSearchResultBackBtn" onClick={() => {
                this.rightSearchResultContainer1.current.style.left = "100%"
                this.setState({searchResultContainer1Content: {header: "", body: []},})
              }}>
                <img src={"back.png"} alt=""/>
              </button>
              <h1>{searchResultContainer1Content.header}</h1>
            </header>
            <body>
              {searchResultContainer1Content.body}
            </body>
          </div>

          <div ref={this.rightSearchResultContainer2} className="rightSearchResult Container2">
            <header>
              <button className="rightSearchResultBackBtn" onClick={() => {
                this.rightSearchResultContainer2.current.style.left = "100%"
                this.setState({searchResultContainer2Content: {header: "", body: [], filteredBody: []},})
              }}>
                <img src={"back.png"} alt=""/>
              </button>
              <h1>{searchResultContainer2Content.header}</h1>
              <img className="filterBtn" src={"filterLogo2.png"} alt="" onClick={() => {this.filterContainer.current.style.top = "90px"}}/>
            </header>
            <body>
              {searchResultContainer2Content.filteredBody}
            </body>
          </div>
        </div>

        {/* --------------------------------For review container-------------------------------- */}
        <div ref={this.bottomContainer} className="bottomContainer">
          <div className="reviewContainer">
            <header>
              <button className="bottomContainerCloseBtn" onClick={() => this.closeReview()}>&#x2715;</button>
              <p className="reviewContainerHeader">{bottomContainerContent.shopName} - Reviews</p>
            </header>
            {bottomContainerContent.content? (
              <body>
                {this.displayReviewContent()}
              </body>
            ): null}

            <div style={{
              bottom: (((!isLeftComment) && (bottomContainerContent.content !== null))? "50px" : "-100%")
              }}className="leaveAReview">
              <div class="rate">
                <p>Tap a Star to Rate: </p>
                {/* <button onClick={() => console.log(this.state.reviewStar)}>Ok</button> */}
                <input className="starButton" type="radio" id="star5" name="rate" value="5" />
                <label className="starButton" for="star5" title="text" onClick={() => this.setState({reviewStar: 5})}></label>
                <input className="starButton" type="radio" id="star4" name="rate" value="4" />
                <label className="starButton" for="star4" title="text" onClick={() => this.setState({reviewStar: 4})}></label>
                <input className="starButton" type="radio" id="star3" name="rate" value="3" />
                <label className="starButton" for="star3" title="text" onClick={() => this.setState({reviewStar: 3})}></label>
                <input className="starButton" type="radio" id="star2" name="rate" value="2" />
                <label className="starButton" for="star2" title="text" onClick={() => this.setState({reviewStar: 2})}></label>
                <input className="starButton" type="radio" id="star1" name="rate" value="1" />
                <label className="starButton" for="star1" title="text" onClick={() => this.setState({reviewStar: 1})}></label>
              </div>
              {((reviewStar !== 0) && (!isLeftComment))? (
                <div className="reviewContent">
                  <textarea className="reviewContentTextArea" placeholder="Leave a review? (Optional)" onChange={() => console.log('hi')}></textarea><br/>
                  <button style={{backgroundColor: "gray"}} onClick={() => this.cancelLeaveReview()}>Cancel</button>
                  <button style={{backgroundColor: "rgb(20, 126, 251)"}} onClick={() => this.submitReview()}>Ok</button>
                </div>
              ):null}
            </div>

          </div>
        </div>
        {/* --------------------------------For filter container-------------------------------- */}
        <div ref={this.filterContainer} className="filterContainer">
          <header>
            <button className="filterContainerCloseBtn" onClick={() => {this.filterContainer.current.style.top = "100%"}}>&#x2715;</button>
            <p className="reviewContainerHeader">Filter</p>
          </header>
          <body>
            <div className="filterOption onlyLikeShop">
              <input type="checkbox" ref={this.isOnlyLikedShopCheckbox} onClick={() => this.filterMachine()} />
              <p>Show Only Liked Shop</p>
            </div>
            <h3>Sort by:</h3>
            <div className="sortOption mostFollowed">
              {this.isThisTheSelectedSortingMethod(0)}
              <p onClick={() => this.changeSortingMethod(0)}>&emsp;Most followed</p>
            </div>
            <div className="sortOption mostViewed">
            {this.isThisTheSelectedSortingMethod(1)}
              <p onClick={() => this.changeSortingMethod(1)}>&emsp;Most viewed</p>
            </div>
            <div className="sortOption topRated">
            {this.isThisTheSelectedSortingMethod(2)}
              <p onClick={() => this.changeSortingMethod(2)}>&emsp;Top rated</p>
            </div>
          </body>
        </div>
      </>
    );
  }
}