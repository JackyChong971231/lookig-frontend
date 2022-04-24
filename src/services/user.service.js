import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://112.120.157.150:8080/api/test/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {    
    return axios.get(API_URL + 'isSignedIn', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }

  addIntoSearchHistory(searchString) {
    return axios
      .post(API_URL + "user/history", {
        authHeader: authHeader(),
        searchString: searchString
      })
      .then(response => {
        return response.data
      })
  }
  
  submitReview(reviewInfo) {
    return axios
      .post(API_URL + "user/review/add", {
        authHeader: authHeader(),
        reviewInfo
      })
      .then(response => {
        return response.data
      })
  }

  saveOrUnsavedShop(savedShopsArray) {
    return axios
      .post(API_URL + "user/savedShops/addOrRemove", {
        authHeader: authHeader(),
        savedShopsArray
      })
      .then(response => {
        return response.data
      })
  }
}

export default new UserService();