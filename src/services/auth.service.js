import axios from "axios";

const API_URL = "http://112.120.157.150:8080/api/auth/";

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    var userItem = localStorage.getItem('user')
    if (userItem == null) {
      return null;
    } else{
      return JSON.parse(userItem);
    }
  }
}

export default new AuthService();