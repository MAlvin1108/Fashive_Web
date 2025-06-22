import LoginView from "../login/login-page.js";
import Api from "../../data/api.js";
import {navigateTo } from "../../app.js";

const LoginPresenter = {
  init() {
    const renderAndBind = () => {
      LoginView.render();
      LoginView.bindSubmit(this.handleLogin.bind(this));
      hideLoading();
    };

    if (document.startViewTransition) {
      document.startViewTransition(renderAndBind);
    } else {
      renderAndBind();
    }
  },

  async handleLogin(email, password) {
    try {
      showLoading();
      const data = await Api.login(email, password);
      localStorage.setItem("authToken", data.loginResult.token);
      localStorage.setItem("userName", data.loginResult.name);
      navigateTo("#home");
    } catch (err) {
      LoginView.showError("Login gagal: " + err.message);
    } finally {
      hideLoading();
    }
  },
};

export default LoginPresenter;
