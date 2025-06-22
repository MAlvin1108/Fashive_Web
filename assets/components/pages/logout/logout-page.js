const LogoutView = {
  render(message = "Logging out...") {
    const app = document.getElementById("app"); // Mengambil elemen container

    // Render tampilan logout
    app.innerHTML = `
      <div class="logout-message">
        <p>${message}</p>
      </div>
    `;
  },
};

export default LogoutView;
