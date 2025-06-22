//================= View =================
const RegisterView = {

  render() {
    return `
      <div class="register-container">
        <div class="register-box">
          <h2>Register</h2>
          <form id="registerForm">
            <label for="name" hidden>Nama Lengkap</label>
            <input type="text" id="name" placeholder="Nama Lengkap" required />

            <label for="email" hidden>Email</label>
            <input type="email" id="email" placeholder="Email" required />

            <label for="password" hidden>Password</label>
            <input type="password" id="password" placeholder="Password" required />

            <button type="submit">Daftar</button>
          </form>
          <p>Sudah punya akun? <a href="#login">Login di sini</a></p>
        </div>
      </div>
    `;
  },

   renderToApp() {
    document.getElementById("app").innerHTML = this.render();
  },

  bindSubmit(handler) {
    const form = document.getElementById("registerForm");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      handler(name, email, password);
    });
  },
};

export default RegisterView;
