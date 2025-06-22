import FavoriteDB from "../../data/favorite-db.js";

const favouriteView = {
    
    render() {
        const app = document.querySelector("#app");
        app.innerHTML = this.template()
    },

    template() {
        return `
         <section class="hero3" id="hero5">
        <h2>Favourite</h2>
        <div id="favorite-section">
        </div>
        </section>
        `
    },

   async renderFavorites() {
    const stories = await FavoriteDB.getAll();
    const container = document.getElementById("favorite-section");
    container.innerHTML = `
    <div class="expose-wrapper">
      <button class="scroll-btn left" aria-label="Scroll Left">&#10094;</button>
      <div class="card-expose-scroll">
    ${stories
      .map(
        (story) =>`
        <div class="story-card">
          <img src="${story.photoUrl}" alt="${story.name}" />
          <div class="story-content">
            <p><strong>${story.name}</strong></p>
            <p>${story.description}</p>
            ${
              story.lat && story.lon
                ? `<p>📍 ${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}</p>`
                : ""
            }
          </div>
                <div class="btn-feathur">
                  <a href="javascript:void(0)" data-id="${story.id}" class="delete-btn">
                    <i data-feather="trash"></i>
                  </a>
                </div>
          </div>`
      
      )
      .join("")}
      </div>
      <button class="scroll-btn right" aria-label="Scroll Right">&#10095;</button>
    </div>
      `

    container.addEventListener("click", async (e) => {
      if (e.target.classList.contains("delete-btn")) {
        e.preventDefault();
        const id = e.target.closest(".delete-btn").dataset.id;
        await FavoriteDB.delete(id);
        this.renderFavorites();
      }
    });
    feather.replace();
  },

}

export default favouriteView;