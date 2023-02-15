import React, { Component } from "react";
import NewsItem from "./NewsItems";
export default class News extends Component {
    articles = []
    constructor() {
    super();
    this.state = {
      articles: this.articles,
      loading: false,
    };
  }

  async componentDidMount(){
    let url = "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=967f17c4ca51418e8b09db0bd95d7894"
    let data = await fetch(url)
    let parsed = await data.json()
    this.setState({articles: parsed.articles})
  }
  
  render() {
    return (
      <div className="container">
        <h2>Top Headlines News</h2>
        <div className="row">
          {this.state.articles.map((element) => {
            return <div className="col-md-4 my-3" key={element.url}>
                <NewsItem title={element.title} description={element.description} imageUrl={element.urlToImage}></NewsItem>
              </div>
            
          })}
        </div>
      </div>
    );
  }
}
