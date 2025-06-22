import favouriteView from "./favourite-page";

const favouritePresenter = {

    async init(){
        favouriteView.render();
        await favouriteView.renderFavorites(); 
    },
}

export default favouritePresenter;