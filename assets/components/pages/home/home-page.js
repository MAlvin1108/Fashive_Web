import FavoriteDB from "../../data/favorite-db";

const HomePage = {

  init(onUploadClick) {
    const container = document.getElementById("app");
    this.renderTo(container);
    this.bindUploadButton(onUploadClick);
    this.initMap();
  if (document.getElementById("favorite-section")) {
  this.renderFavorites();

}

  },

  renderTo(container) {
    container.innerHTML = this.template();
    feather.replace();
  },

  template() {
    return `
      <section class="hero" id="home">
        <main class="content">
          <h1>The Streetwear Fashion</h1>
          <p>for your inspiration outfit styles and cool looks</p>
        </main>
      </section>

      <section class="hero1" id="shirt">
        <h2>Shirt</h2>
        <div class="shop-card-list">
          ${this.generateShirtCards()}
        </div>
      </section>

      <section class="hero2">
        <ul class="list-img">
          <li></li>
          <li></li>
        </ul>
      </section>

      <section class="hero1" id="pants">
        <h2>Pants</h2>
        <div class="shop-card-list">
          ${this.generatePantsCards()}
        </div>
      </section>

      <section class="hero3" id="hero3">
        <h2>Expose Your Style</h2>
        <button id="addStoryBtn" class="upload-btn">📷 Upload Your Photo Here</button>
        <main class="card-expose"></main>
      </section>


      <section class="hero4" id="friends-map">
        <h2>CREW LOCATION</h2>
        <div id="map-friends" style="height: 400px; margin-top: 10px;"></div>
      </section>
    `;
  },

  updateStoryExposeHTML(stories) {
    return `
    <div class="expose-wrapper">
      <button class="scroll-btn left" aria-label="Scroll Left">&#10094;</button>
      <div class="card-expose-scroll">
        ${stories
          .map(
            (story) => `
              <div class="story-card">
                <img src="${story.photoUrl}" alt="${story.name}" />
                <div class="story-content">
                  <p><strong>${story.name}</strong></p>
                  <p>${story.description}</p>
                  ${story.lat && story.lon
                    ? `<p>📍 ${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}</p>`
                    : ""}
                </div>
                <div class="btn-feathur">
                  <a href="#" data-id="${story.id}" class="favorite-btn">
                    <i data-feather="heart"></i>
                  </a>
                </div>
              </div>`
          )
          .join("")}
      </div>
      <button class="scroll-btn right" aria-label="Scroll Right">&#10095;</button>
    </div>
  `;
  },
  
  showErrorMessage(message) {
    const container = document.querySelector(".card-expose");
    container.innerHTML = `<p style="color:red;">${message}</p>`;
  },

  bindUploadButton(callback) {
    const addBtn = document.querySelector("#addStoryBtn");
    if (addBtn) {
      addBtn.addEventListener("click", callback);
    }
  },

  showStories(stories) {
  const container = document.querySelector(".card-expose");
  container.innerHTML = this.updateStoryExposeHTML(stories);
  this.bindScrollButtons();
  this.initFavoriteHandler();
},

  initMap() {
    // Implement map initialization logic here (for example, using Leaflet.js or Google Maps API)
    const mapElement = document.getElementById("map-friends");
    if (mapElement) {
    }
  },

  setExposeStories(stories) {
    const container = document.querySelector(".card-expose");
    container.innerHTML = this.updateStoryExposeHTML(stories);
    this.bindScrollButtons();
  },

  showMapWithStories(stories) {
  const map = L.map("map-friends").setView([-2.5, 117], 4.8);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  stories.forEach((story) => {
    if (story.lat && story.lon) {
      L.marker([story.lat, story.lon])
        .addTo(map)
        .bindPopup(
          `<strong>${story.name}</strong><br>${story.description || "No description"}`
        );
    }
  });

  setTimeout(() => {
    map.invalidateSize(); // penting agar map menyesuaikan ukuran
  }, 300);
},



  bindScrollButtons() {
    const container = document.querySelector(".card-expose");
    const scrollContainer = container.querySelector(".card-expose-scroll");

    container
      .querySelector(".scroll-btn.left")
      .addEventListener("click", () => {
        scrollContainer.scrollBy({ left: -200, behavior: "smooth" });
      });
    container
      .querySelector(".scroll-btn.right")
      .addEventListener("click", () => {
        scrollContainer.scrollBy({ left: 200, behavior: "smooth" });
      });
  },

 initFavoriteHandler() {
    const container = document.querySelector(".card-expose");

    container.addEventListener("click", async (e) => {
      const favBtn = e.target.closest(".favorite-btn");
      if (favBtn) {
        e.preventDefault();
        const id = favBtn.dataset.id;
        const card = favBtn.closest(".story-card");
      
        const name = card.querySelector("p strong").innerText;
        const description = card.querySelectorAll("p")[1]?.innerText;
        const photoUrl = card.querySelector("img").src;
      
        const locationText = card.querySelectorAll("p")[2]?.innerText;
        const [lat, lon] = locationText?.includes("📍")
          ? locationText.replace("📍", "").split(",").map(val => parseFloat(val.trim()))
          : [null, null];
      
        const story = { id, name, description, photoUrl, lat, lon };
      
        const existing = await FavoriteDB.isFavorited(id); // ✅ benar
        if (existing) {
          alert("Story sudah ada di favorit.");
          return;
        }
      
        await FavoriteDB.add(story);
        favBtn.innerHTML = "<i data-feather='check'></i> Favorited";
        feather.replace();
        alert("Ditambahkan ke favorit!");
      }
    });

    feather.replace();
  },


  generateShirtCards() {
    return Array(4)
      .fill(
        `
      <div class="shop-card">
        <div class="shirt-image"></div>
        <h3 class="shop-card-tittle">Cotton Round Neck Short Sleeve T-shirt Men - White</h3>
        <p class="price">167000</p>
        <div class="btn-feathur">
          <a href="buy"><i data-feather="shopping-cart"></i>buy</a>
        </div>
      </div>
    `
      )
      .join("");
  },

  generatePantsCards() {
    return Array(4)
      .fill(
        `
      <div class="shop-card">
        <div class="pants-image"></div>
        <h3 class="shop-card-tittle">Jean Baggy Délavé</h3>
        <p class="price">167000</p>
        <div class="btn-feathur">
          <a href="buy"><i data-feather="shopping-cart"></i>buy</a>
        </div>
      </div>
    `
      )
      .join("");
  },
};

export default HomePage;
