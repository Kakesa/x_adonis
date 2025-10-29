document.addEventListener("DOMContentLoaded", () => {
  const modalLogin = document.getElementById("loginModal");
  const closeLogin = document.getElementById("closeLogin");
  const gotoRegister = document.getElementById("gotoRegisterFromLogin");

  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-message");

  // Fonction pour afficher le toast
  function showToast(message, type = "success") {
    toastMsg.textContent = message;
    toast.style.backgroundColor = type === "success" ? "#16a34a" : "#dc2626";
    toast.classList.remove("hidden");
    toast.style.opacity = 0;
    toast.style.transform = "translate(-50%, -20px)";

    setTimeout(() => {
      toast.style.opacity = 1;
      toast.style.transform = "translate(-50%, 0)";
    }, 50);

    setTimeout(() => {
      toast.style.opacity = 0;
      toast.style.transform = "translate(-50%, -20px)";
      setTimeout(() => toast.classList.add("hidden"), 300);
    }, 4000);
  }

  // Fermer le modal
  closeLogin?.addEventListener("click", () => {
    modalLogin.classList.add("hidden");
  });

  // Aller à l'inscription
  gotoRegister?.addEventListener("click", () => {
    modalLogin.classList.add("hidden");
    const modalRegister = document.getElementById("registerModal");
    modalRegister?.classList.remove("hidden");
  });

  // Afficher les messages flash automatiquement au chargement
  const flashError = document.querySelector('meta[name="flash-error"]')?.content;
  const flashSuccess = document.querySelector('meta[name="flash-success"]')?.content;

  if (flashError) showToast(flashError, "error");
  if (flashSuccess) showToast(flashSuccess, "success");
});
