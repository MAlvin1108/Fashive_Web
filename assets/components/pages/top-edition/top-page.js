const TopPage = {
  render() {
    const app = document.querySelector("#app");
    app.innerHTML = this.template();
  },

  template() {
    return `
      <section class="hero1" id="shirt">
        <h2>Shirt</h2>
        <div class="shop-card-list">
          ${this.generateShirtCards()}
        </div>
      </section>

      <section class="hero1" id="pants">
        <h2>Pants</h2>
        <div class="shop-card-list">
          ${this.generatePantsCards()}
        </div>
      </section>
    `;
  },

  generateShirtCards() {
    return Array(4)
      .fill(`
        <div class="shop-card">
          <div class="shirt-image"></div>
          <h3 class="shop-card-tittle">Cotton Round Neck Short Sleeve T-shirt Men - White</h3>
          <p class="price">167000</p>
          <div class="btn-feathur">
            <a href="buy"><i data-feather="shopping-cart"></i>buy</a>
          </div>
        </div>
      `)
      .join("");
  },

  generatePantsCards() {
    return Array(4)
      .fill(`
        <div class="shop-card">
          <div class="pants-image"></div>
          <h3 class="shop-card-tittle">Jean Baggy Délavé</h3>
          <p class="price">167000</p>
          <div class="btn-feathur">
            <a href="buy"><i data-feather="shopping-cart"></i>buy</a>
          </div>
        </div>
      `)
      .join("");
  },
};

export default TopPage;
