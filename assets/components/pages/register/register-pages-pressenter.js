import RegisterView from "../register/register-pages";
import Api from "../../data/api.js";
import { showLoading, hideLoading, navigateTo } from "../../app.js";

const RegisterPresenter = {
  init() {
    RegisterView.renderToApp();
    RegisterView.bindSubmit(this.handleRegister.bind(this));
  },
  async handleRegister(name, email, password) {
    try {
      showLoading();
      await Api.register(name, email, password);
      alert("Pendaftaran berhasil! Silakan login.");
       navigateTo("#login");
    } catch (err) {
      alert("Pendaftaran gagal: " + err.message);
    } finally {
      hideLoading();
    }
  },
};

export default RegisterPresenter;
