const LoginView = {

//----view----//
  render() {
   const container = document.getElementById("app");
    container.innerHTML = `
      <div class="login-container">
        <div class="login-box">
          <h2>Login</h2>
          <form id="loginForm">
            <input type="email" id="email" placeholder="Email" required />
            <input type="password" id="password" placeholder="Password" required />
            <button type="submit">Login</button>
          </form>
          <p>Belum punya akun? <a href="#register">Daftar di sini</a></p>
        </div>
      </div>
    `;
  },

//------model----///
  bindSubmit(handler) {
    const form = document.getElementById("loginForm");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      handler(email, password);
    });
  },


  showError(message) {
    alert(message); // Bisa ganti dengan tampilan inline
  },
};

export default LoginView;
