import HomePage from "./home-page.js";
import Api from "../../data/api.js";
import { navigateTo } from "../../app.js";


const HomePagePresenter = {
  async init() {
    HomePage.init(() => {
      navigateTo("#upload");
    });

    await this.fetchStories();
    await this.fetchStoriesWithLocation();
  },

  async fetchStories() {
    const token = localStorage.getItem("authToken");
    if (!token) {
      HomePage.showNotLoggedIn?.();
      return;
    }

    try {
      const stories = await Api.fetchStories(token); // API terpisah
     HomePage.showStories(stories);
    } catch (err) {
      HomePage.showErrorMessage(err.message);
    }
  },

  async fetchStoriesWithLocation() {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const stories = await Api.fetchStoriesWithMap(token); // render lat/lon
      HomePage.showMapWithStories(stories); // upload ke View
    } catch (err) {
      HomePage.showMapErrorMessage?.(err.message);
    }
  },


};

export default HomePagePresenter;
