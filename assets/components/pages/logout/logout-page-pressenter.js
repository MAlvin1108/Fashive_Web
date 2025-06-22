import LogoutView from "../logout/logout-page.js";
import {hideLoading, showLoading, navigateTo} from "../../app.js";

const LogoutPresenter = {
  init() {

    const performLogout = () => {
      // Menghapus data otentikasi dari localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("userName");

      navigateTo("#login");

      hideLoading();
    };

    // Fungsi untuk merender tampilan dan memulai logout
    const renderAndLogout = () => {
      // Render tampilan logout dan tampilkan loading
      LogoutView.render("Logging out...");
      showLoading();

      // Delay untuk efek loading
      setTimeout(performLogout, 500);
    };

    // Jika browser mendukung ViewTransition API, gunakan untuk transisi tampilan halus
    if (document.startViewTransition) {
      document.startViewTransition(renderAndLogout);
    } else {
      renderAndLogout();
    }
  },
};

export default LogoutPresenter;
