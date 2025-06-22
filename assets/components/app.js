import LoginPresenter from "./pages/login/login-page-pressenter.js";
import RegisterPresenter from "./pages/register/register-pages-pressenter.js";
import LogoutPresenter from "./pages/logout/logout-page-pressenter.js";
import HomePage from "./pages/home/home-page-pressenter.js";
import "../style/styling.css";
import logo from "../pic/img/icons/WhatsApp_Image_2025-04-30_at_14.01.37-removebg-preview.png";
import TopPagePresenter from "./pages/top-edition/top-pages-pressenter.js";
import UploadStoryPresenter from "./pages/story/upload-story-pressenter.js";
import favouritePresenter from "./pages/favourite/favourite-page-presenter.js";

const nav = document.querySelector(".navbar");
const logoImg = document.createElement("img");
logoImg.src = logo;
logoImg.alt = "logofashive";
nav.prepend(logoImg);

const routes = {
  "#login": LoginPresenter,
  "#register": RegisterPresenter,
  "#home": HomePage,
  "#Top": TopPagePresenter,
  "#logout": LogoutPresenter,
  "#upload": () => new UploadStoryPresenter(),
  "#favourite": favouritePresenter,
};

function navigateTo(hash) {
  window.location.hash = hash;
}

function showLoading() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="loading-wrapper">
      <div class="spinner"></div>
      <p class="loading-text">Loading...</p>
    </div>
  `;
}

function hideLoading() {
  const app = document.getElementById("app");
  app.innerHTML = "";
}

let currentPresenter = null;

async function loadPage() {
  const hash = window.location.hash || "#login";
  const nextPresenterFactory = routes[hash];

  const app = document.getElementById("app");

  if (!nextPresenterFactory) {
    app.innerHTML = "<p>Halaman tidak ditemukan.</p>";
    return;
  }

  if (currentPresenter && typeof currentPresenter.destroy === "function") {
    currentPresenter.destroy();
  }

  const presenter = typeof nextPresenterFactory === "function"
    ? nextPresenterFactory()
    : nextPresenterFactory;

  currentPresenter = presenter;

  const render = async () => {
    showLoading();
    await new Promise((resolve) => setTimeout(resolve, 300));
    await presenter.init();
  };

  if (document.startViewTransition) {
    document.startViewTransition(() => render());
  } else {
    await render();
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

window.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const hideIcon = document.getElementById("hideIcon");

  if (menuToggle && hideIcon) {
    menuToggle.addEventListener("click", function (e) {
      e.preventDefault();
      hideIcon.classList.toggle("active");
    });
  }

  const mainContent = document.querySelector("#main-content");
  const skipLink = document.querySelector(".skip-to-content");

  if (skipLink && mainContent) {
    skipLink.addEventListener("click", function (event) {
      event.preventDefault();
      skipLink.blur();
      mainContent.setAttribute("tabindex", "-1");
      mainContent.focus();
      mainContent.scrollIntoView();
    });
  }

  loadPage();

  // SERVICE WORKER + PUSH
if ("serviceWorker" in navigator && "PushManager" in window) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered:", registration);

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Izin notifikasi ditolak.");
      }

      const vapidKey = "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";
      const convertedVapidKey = urlBase64ToUint8Array(vapidKey);

      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
        console.log("User baru subscribe:", subscription);
      } else {
        console.log("User sudah subscribe:", subscription);
      }

      // tombol subscribe/unsubscribe
    const subscribeBtns = document.querySelectorAll("#subscribeBtn");
    const unsubscribeBtns = document.querySelectorAll("#unsubscribeBtn");
        
    subscribeBtns.forEach(btn => {
    btn.addEventListener("click", async () => {
    alert("Notifikasi diaktifkan!");
    subscribeBtns.forEach(b => b.style.display = "none");
    unsubscribeBtns.forEach(b => b.style.display = "inline-block");
  });
});

  unsubscribeBtns.forEach(btn => {
  btn.addEventListener("click", async () => {
    alert("Notifikasi dimatikan!");
    unsubscribeBtns.forEach(b => b.style.display = "none");
    subscribeBtns.forEach(b => b.style.display = "inline-block");
  });
});

      let lastStoryId = null;

      async function checkNewStories() {
        try {
          const token = localStorage.getItem("authToken");
          if (!token) return;

          const response = await fetch("https://story-api.dicoding.dev/v1/stories", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.message);

          const latestStory = result.listStory[0];
          if (!lastStoryId) {
            lastStoryId = latestStory.id;
            return;
          }

          if (latestStory.id !== lastStoryId) {
            lastStoryId = latestStory.id;

            // Trigger local push
            registration.showNotification("Fashive Update!", {
              body: `Cerita baru dari ${latestStory.name}`,
              icon: "/zipper.png",
              badge: "/zipper.png",
              data: { url: "/" }
            });
          }
        } catch (err) {
          console.error("Gagal cek story terbaru:", err);
        }
      }

      setInterval(checkNewStories, 60000);
    } catch (err) {
      console.error("Gagal setup push:", err);
    }
  });
 }
});

window.addEventListener("hashchange", loadPage);

export { hideLoading, showLoading, navigateTo };
