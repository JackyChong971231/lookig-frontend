import axios from 'axios';
import { Button } from 'bootstrap';
import authHeader from './auth-header';

const API_URL = 'http://112.120.157.150:8080/api/test/';

class PublicService {
  queryCategoryArray() {  // categoryTree.component.js
    return axios
      .post(API_URL + "categoryTree/getAll", {
        // headers: authHeader(),
      })
      .then(response => {
        localStorage.setItem("category_tree", JSON.stringify(response.data));
        return response.data;
      });
  }

  addShop(newShopInfo) {  // add tab
    // console.log(newShopInfo);
    return axios
      .post(API_URL + "add/submit",{
        newShopInfo
      })
      .then(response => {
        if (response.data.status === "Successful") {
          return [true, newShopInfo.shop_name + " added"]
        } else {
          return [false, response.data.status]
        }
      })
  }

  queryByCategoryId(category_id) {
    return axios
      .post(API_URL + "search/byCategoryId",{
        category_id
      })
      .then(resultArray => {
        return resultArray.data
      })
  }

  queryByShopName(searchString) {
    return axios
    .post(API_URL + "search/byShopName",{
      searchString
    })
    .then(resultArray => {
      return resultArray.data
    })
  }

  async queryByInput(searchString) {
    var returnSeearchResult = {}
    // console.log("Women".includes('W'))
    returnSeearchResult.shops = await this.queryByShopName(searchString)

    const categoryTreeList = JSON.parse(localStorage.getItem('category_tree'));
    var category2_name_array = {};
    var category3_name_array = [];
    categoryTreeList.forEach(eachCategoryCombination => {
      if (eachCategoryCombination.category2_name.toLowerCase().includes(searchString)) {
        const combinationCategoryName = eachCategoryCombination.category2_name + " in " + eachCategoryCombination.category1_name
        const categoryInfo = {
          category_id:    eachCategoryCombination.combination_id,
          category_name:  {
            category1_name: eachCategoryCombination.category1_name,
            category2_name: eachCategoryCombination.category2_name,
            category3_name: eachCategoryCombination.category3_name
          }
        }
        if (combinationCategoryName in category2_name_array) {
          category2_name_array[combinationCategoryName].push(categoryInfo)
        } else {
          category2_name_array[combinationCategoryName] = [categoryInfo]
        }
      }
      returnSeearchResult.category2_name_btn = category2_name_array

      if (eachCategoryCombination.category3_name.toLowerCase().includes(searchString) && eachCategoryCombination.category3_name.toLowerCase() !== "null") {
        category3_name_array.push({
          button_text: eachCategoryCombination.category1_name + " > " + eachCategoryCombination.category2_name + " > " + eachCategoryCombination.category3_name,
          combination_id: eachCategoryCombination.combination_id
        })
      }
      returnSeearchResult.category3_name_btn = category3_name_array
    })
    return returnSeearchResult
  
  }
  
  getPendingShops() {
    return axios
      .post(API_URL + "profile/getPendingShops")
      .then(response => {
        return response.data
      })
  }

  getIGProfileInfo() {
    return axios
      .post(API_URL + "home/getIGProfileInfo")
      .then(response => {
        return response.data
      })
  }

}

export default new PublicService();