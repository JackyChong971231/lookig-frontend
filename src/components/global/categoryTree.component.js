import React, { Component } from "react";

import PublicService from "../../services/public.service";
import UiLibrary from "../global.element"
import "./categoryTree.component.css"


export default class CategoryTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categoryTreeComponent: {},
      selectedCategory1_name: "",
      category2Container: []
    };
  }

  componentDidMount() {
    this.displayCategoryTable();
  }

  componentDidUpdate() {
    if (this.props.childComponent.pageName === 'add') {this.props.childComponent.checkSelectedCategory()}   // Update checkBox
  }

  expandOrCollapse(category) {
    const tempTargetDiv = document.getElementsByClassName(`subCollapsibleCategory ${category}`);
    if (tempTargetDiv[0].style.display === "block") {
      tempTargetDiv[0].style.display = "none";
    } else if (tempTargetDiv[0].style.display === "none" || tempTargetDiv[0].style.display === "") {
      tempTargetDiv[0].style.display = "block";
    }
  }

  categoryTreeComponentBuild_add(categoryTreeDict) {
    // ---------------------- Building component ---------------------- //
    var categoryTreeComponent = {}
    for (let category1_name in categoryTreeDict) {
      const category1_object = categoryTreeDict[category1_name];
      categoryTreeComponent[category1_name] = []; 
      for (let category2_name in category1_object) {
        const category2_object = category1_object[category2_name]
        var category3_array = []

        for (let category3_name in category2_object) {
          const category_id = category2_object[category3_name]
          category3_array.push(
            <div className={category1_name + " " + category2_name + " " + category3_name + " "}>
              <input type="checkbox" className="categoryCheckBox" id={"categoryCheckBox "+category_id.toString()}
              onClick={(e) => this.props.childComponent.addCategoryToShop(e.target,[category1_name,category2_name,category3_name],category_id) }
              ></input>
              <p>{category3_name}</p>
            </div>
          )
        }
        var category2_checkBox = []
        if (category3_array.length === 0) {
          const category_id = category1_object[category2_name]
          category2_checkBox.push(
            <input type="checkbox" className="categoryCheckBox" id={"categoryCheckBox "+category_id.toString()}
            onClick={(e) => this.props.childComponent.addCategoryToShop(e.target,[category1_name,category2_name],category_id) }
            ></input>
          )
        }
        categoryTreeComponent[category1_name].push(
          <div>
            <div className='category title'>
              <button className={"collapsibleCategory " + category2_name} onClick={() => this.expandOrCollapse(category2_name)}>
                <img src={"category/" + category1_name + "/" + category2_name+".jpg"} alt=""/>
                {category2_checkBox}
                <p>{category2_name}</p>
                {/* <p>See more</p> */}
              </button>
            </div>
            <div className={"subCollapsibleCategory " + category2_name}>
              {category3_array}
            </div>
        </div>
        )
      }
    }
    this.setState({
      categoryTreeComponent: categoryTreeComponent,
      selectedCategory1_name: Object.keys(categoryTreeComponent)[0]
    });
  }

  categoryTreeComponentBuild_search(categoryTreeDict) {
    // ---------------------- Building component ---------------------- //
    var categoryTreeComponent = {}
    for (let category1_name_key in categoryTreeDict) {
      const category1_name_value = categoryTreeDict[category1_name_key];
      categoryTreeComponent[category1_name_key] = []; 
      for (let category2_name_key in category1_name_value) {
        const category2_name_value = category1_name_value[category2_name_key]
        var category3_array = []
        for (let category3_name_key in category2_name_value) {
          const category_id = category2_name_value[category3_name_key]
          category3_array.push(
            <div className={category1_name_key + " " + category2_name_key + " " + category3_name_key + " "}>
              <p onClick={() => this.props.childComponent.queryByCategoryId(category_id, category1_name_key + " > " + category2_name_key + " > " + category3_name_key) }>{category3_name_key}</p>
            </div>
          )
        }
        if (category3_array.length === 0) {
          categoryTreeComponent[category1_name_key].push(
            <div>
              <div className='category title'>
                <button className={"collapsibleCategory " + category2_name_key} onClick={() => this.props.childComponent.queryByCategoryId(category2_name_value, category1_name_key + " > " + category2_name_key)}>
                  <img src={"category/" + category1_name_key + "/" + category2_name_key+".jpg"} alt=""/>
                  <p>{category2_name_key}</p>
                  {/* <p>See more</p> */}
                </button>
              </div>
              <div className={"subCollapsibleCategory " + category2_name_key}>
                {category3_array}
              </div>
          </div>
          )
        } else {
          categoryTreeComponent[category1_name_key].push(
            <div>
              <div className='category title'>
                <button className={"collapsibleCategory " + category2_name_key} onClick={() => this.expandOrCollapse(category2_name_key)}>
                  <img src={"category/" + category1_name_key + "/" + category2_name_key+".jpg"} alt=""/>
                  <p>{category2_name_key}</p>
                  {/* <p>See more</p> */}
                </button>
              </div>
              <div className={"subCollapsibleCategory " + category2_name_key}>
                {category3_array}
              </div>
          </div>
          )
        }
      }
    }
    this.setState({
      categoryTreeComponent: categoryTreeComponent,
      selectedCategory1_name: Object.keys(categoryTreeComponent)[0]
    });
}

  displayCategoryTable() {
    PublicService.queryCategoryArray().then(categoryTreeList => {
      // loop through each combination (supports more than 3-layer categoryTree)
      function idk(currentObjectPath, currentCombination, currentCombinationId) {
        const thisElement = currentCombination[0];
        const nextElement = currentCombination[1];
        const isThisTheLastElement = (nextElement)? false: true;
        if (isThisTheLastElement) {
          currentObjectPath[thisElement] = currentCombinationId
        } else {
          if (thisElement in currentObjectPath) {
            currentCombination.shift();
            currentObjectPath = currentObjectPath[thisElement]
            idk(currentObjectPath, currentCombination, currentCombinationId)
          } else {
            currentObjectPath[thisElement] = {};
            currentCombination.shift();
            currentObjectPath = currentObjectPath[thisElement]
            idk(currentObjectPath, currentCombination, currentCombinationId)
          }
        }
      }

      // Put the array into object
      var categoryTreeDict = {};
      // loop through category array
      categoryTreeList.forEach(eachCategoryCombination => {
        var currentCombinationArray = [];
        // transform {category1_name: xxxxx, category2_name: xxxx .....} into [xxxx, xxxx, ....]
        for (let categoryNth in eachCategoryCombination) {
          if ((eachCategoryCombination[categoryNth] !== 'null') && (['category1_name','category2_name','category3_name'].includes(categoryNth))) {
            currentCombinationArray.push(eachCategoryCombination[categoryNth])
          }
        }
        const currentCombinationId = eachCategoryCombination['combination_id']
        // base on each row, create the json object
        idk(categoryTreeDict, currentCombinationArray, currentCombinationId);
      })
      // localStorage.setItem('categoryTreeObject',JSON.stringify(categoryTreeDict));
      // localStorage.setItem('categoryTreeArray',JSON.stringify(currentCombinationArray));
      if (this.props.childComponent.pageName === 'add') {this.categoryTreeComponentBuild_add(categoryTreeDict)}
      else if (this.props.childComponent.pageName === 'search') {this.categoryTreeComponentBuild_search(categoryTreeDict)}
      
    })
  }

  displayCategory1Container() {
    const { categoryTreeComponent, selectedCategory1_name } = this.state;
    var category1Container = [];
    for (let category1_name in categoryTreeComponent) {
      category1Container.push(
        <button
        onClick={() => {this.setState({ selectedCategory1_name: category1_name })}}
        style={{
          backgroundColor: ((selectedCategory1_name === category1_name)? UiLibrary.color.darkGray: UiLibrary.color.white),
          color: ((selectedCategory1_name === category1_name)? UiLibrary.color.white : UiLibrary.color.defaultFontColor)
          }}>
          {category1_name}
        </button>
      )
    }
    if (typeof Object.keys(categoryTreeComponent)[0] !== "undefined") {
      // this.setState({ selectedCategory1_name: Object.keys(categoryTreeComponent)[0] });
      // console.log(Object.keys(categoryTreeComponent)[0]);
    }
    return category1Container
  }

  render() {
    const { categoryTreeComponent, selectedCategory1_name } = this.state;
    return (
      <div className="categoryTreeContainer">
        <div className="category1Container">
          {this.displayCategory1Container()}
        </div>
        {categoryTreeComponent[selectedCategory1_name]}
        {/* <p>asdfsafd</p> */}
      </div>
    );
  }
}