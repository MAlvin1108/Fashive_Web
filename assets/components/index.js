let deferredPrompt = null;

window.addEventListener("beforeinstallprompt",(e) => {
  
  e.preventDefault();
  deferedPrompt = e;

   const installBtn = document.getElementById("installAppBtn");
  if (installBtn) {
    installBtn.style.display = "block";
    installBtn.addEventListener("click", async () => {
      installBtn.style.display = "none";
      deferredPrompt.prompt();

      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      deferredPrompt = null;
    });
  }
})
