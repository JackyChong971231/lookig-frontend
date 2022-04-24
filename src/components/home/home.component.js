import React, { Component } from "react";
import axios from 'axios';

import { Switch, Route, Link, Redirect } from "react-router-dom";
import UserService from "../../services/user.service";
import "./home.component.css"
import publicService from "../../services/public.service";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      thisDevice: "",
      slideIndex: 1
    };
  }

  function1() {
    const userAccessToken = "EAAJdYYbZBhgIBANKKIJFpKYpBLmKbbUTk34Svui71fkiOyyXfGPd9gG1rV8hCnZB2vxrt0WxSZAVBtCoVN13zuiX3Qvhywvj7w0f4DXxRhi0It3GGrbYT0SFJTYCXzmp4ZBcp5LqZByqI1ltFWoOZAwyI8wRETOplZBnosemrprTNFSIm4ZApNcn1p9G3eCq1rQw2jTZAZB8Eiit72gZBzeaTyD"
    axios.get(`https://graph.facebook.com/v9.0/me/accounts?access_token=${userAccessToken}`)
        .then(response => {
            // console.log(response.data.data[0].id);
            const page_id = response.data.data[0].id;
            console.log(response.data.data);
            axios.get(`https://graph.facebook.com/${page_id}?fields=access_token&access_token=${userAccessToken}`)
                .then(response => {
                    const pageAccessToken = response.data.access_token
                    console.log(response.data);
                    axios.get(`https://graph.instagram.com/me?fields=id,username&access_token=${pageAccessToken}`)
                      .then(response => {
                        console.log(response);
                      })
                    // axios.get(`https://graph.facebook.com/v9.0/${page_id}/conversations?platform=instagram&access_token=${pageAccessToken}`)
                    //     .then(response => {
                    //         console.log(response)
                    //     })
                })
        });
  }

  function2() {
    // const igAccessToken = "IGQVJWV0hHbUlVdHhPZAHpKbFR6NVdMMTVNTHVKRTcxUE1hRGZAKMk1Gd3ozVWlnSHNTejJZAYlZASWmg0d3dJVXhRRUE1czBGd3loUUtueHFmNlNIYmVPZA0NNQWFVWFB3d0xMeVRnOXNIb1c1NXdKU3NFZAAZDZD"
    // const igAppID = "6929822007058977"
    // const igUserName = "wwhitetale"
    // // axios.get(`https://graph.instagram.com/me/media?fields=id,caption&access_token=${igAccessToken}`)
    // axios({
    //   method: 'get',
    //   url: `https://www.instagram.com/${igUserName}/?__a=1`
    // })
    //   .then(response => {
    //     // const posts = response.data.data    // it is a list
    //     console.log(response);
    //   })
    publicService.getIGProfileInfo()
      .then(response => {
        console.log(response)
      })
  }

  mostViewed() {
    const mostViewedArray=[]
    mostViewedArray.push(<div className="igProfile"><div></div><iframe width="100%" height="100%" src="https://www.instagram.com/p/CYooXYlpYYu/embed"></iframe></div>);
    mostViewedArray.push(<div className="igProfile"><div></div><iframe width="100%" height="100%" src="https://www.instagram.com/wwhitetale/?__a=1"></iframe></div>);
    mostViewedArray.push(<div className="igProfile"><div></div><iframe width="100%" height="100%" src="https://www.instagram.com/p/CYooXYlpYYu/embed"></iframe></div>);
    return mostViewedArray;
  }

  componentDidMount() {
    this.showSlides(1)
    UserService.getPublicContent().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );

    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      this.setState({thisDevice:"mobile"});
    }else{
      this.setState({thisDevice:"not mobile"});
    }
    window.scrollTo(0,1)
  }

  showMostBrowsedCategories() {
    var componentsArray = [];
    componentsArray.push(<div className="mostBrowsedCategory"><div></div><p>Fashion</p></div>)
    componentsArray.push(<div className="mostBrowsedCategory"><div></div><p>Gift</p></div>)
    componentsArray.push(<div className="mostBrowsedCategory"><div></div><p>Food</p></div>)
    componentsArray.push(<div className="mostBrowsedCategory"><div></div><p>Workshop</p></div>)
    componentsArray.push(<div className="mostBrowsedCategory"><div></div><p>Fashion</p></div>)
    componentsArray.push(<div className="mostBrowsedCategory"><div></div><p>Gift</p></div>)
    componentsArray.push(<div className="mostBrowsedCategory"><div></div><p>Food</p></div>)
    componentsArray.push(<div className="mostBrowsedCategory"><div></div><p>Workshop</p></div>)
    // componentsArray.push(<div className="mostBrowsedCategory"><div></div><p>Garments</p></div>)
    // componentsArray.push(<div className="mostBrowsedCategory"><div></div><p>Garments</p></div>)
    return componentsArray
  }

  // Next/previous controls
  plusSlides(n) {
    var {slideIndex} = this.state;
    this.showSlides(slideIndex += n);
  }

  // Thumbnail image controls
  currentSlide(n) {
    var {slideIndex} = this.state;
    this.showSlides(slideIndex = n);
  }

  showSlides(n) {
    var {slideIndex} = this.state;
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dot");

    slideIndex = n;
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
    this.setState({slideIndex: slideIndex});
    setTimeout(() => this.showSlides(slideIndex+1), 2000);
  }

  render() {
    return (
      <div className="homeContainer">
        <button onClick={() => this.function2()}>test function</button>
        {/* <button onClick={() => this.function2()}>do sth</button> */}
        <header className="jumbotron">
          {/* <p>A website that categorises HKIG shops</p> */}
          {/* <h3>{this.state.content}</h3>
          <h5>{this.state.thisDevice}</h5> */}
        </header>

        {/* <!-- Slideshow container --> */}
        <div class="slideshowContainer">

          {/* <!-- Full-width images with number and caption text --> */}
          <div class="mySlides">
            <div class="numbertext">1 / 3</div>
            {/* <img src="img1.jpg" style="width:100%" /> */}
            <div class="text">Caption Text</div>
          </div>

          <div class="mySlides">
            <div class="numbertext">2 / 3</div>
            {/* <img src="img2.jpg" style="width:100%" /> */}
            <div class="text">Caption Two</div>
          </div>

          <div class="mySlides">
            <div class="numbertext">3 / 3</div>
            {/* <img src="img3.jpg" style="width:100%" /> */}
            <div class="text">Caption Three</div>
          </div>

          {/* <!-- Next and previous buttons --> */}
          <a class="prev" onClick={() => this.plusSlides(-1)}>&#10094;</a>
          <a class="next" onClick={() => this.plusSlides(1)}>&#10095;</a>
        </div>
        {/* <br /> */}

        {/* <!-- The dots/circles --> */}
        <div style={{textAlign: "center"}}>
          <span class="dot" onClick={() => this.currentSlide(1)}></span>
          <span class="dot" onClick={() => this.currentSlide(2)}></span>
          <span class="dot" onClick={() => this.currentSlide(3)}></span>
        </div>

        <input className="shopNameInput" placeholder="Start searching ..." onClick={() => {this.props.history.push('/search')}}></input>
        
        <h5>Most browsed categories</h5>
        <p><Link to={"/search"}>View all</Link></p>
        <div className="mostBrowsedCategoriesContainer">
          {this.showMostBrowsedCategories()}
        </div>

        <h5>Most viewed shops</h5>
        {/* <p>View all</p> */}
        <div className="mostXXXshopsContainer mostViewed">
          {this.mostViewed()}
        </div>

        <h5>Most viewed shops</h5>
        {/* <p>View all</p> */}
        <div className="mostXXXshopsContainer mostViewed">
          {this.mostViewed()}
        </div>


      </div>
    );
  }
}