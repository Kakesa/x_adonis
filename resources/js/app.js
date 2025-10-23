document.addEventListener("DOMContentLoaded", () => {
  const authModal = document.getElementById("authModal");
  const modalClose = document.getElementById("modalClose");

  const btnCreateAccount = document.getElementById("btnCreateAccount");
  const btnLogin = document.getElementById("btnLogin");

  // Sélectionne les vues internes (incluses dans auth/register et auth/login)
  const registerForm = document.querySelector("#registerForm");
  const loginForm = document.querySelector("#loginForm");

  /**
   * 🔹 Ouvre la modale et affiche la vue demandée
   */
  const openModal = (type) => {
    if (!authModal) return;

    authModal.classList.remove("pointer-events-none", "opacity-0");
    authModal.classList.add("opacity-100");

    // Par défaut, on cache tout
    registerForm?.classList.add("hidden");
    loginForm?.classList.add("hidden");

    if (type === "register") {
      registerForm?.classList.remove("hidden");
    } else if (type === "login") {
      loginForm?.classList.remove("hidden");
    }

    // Bloque le scroll du body
    document.body.classList.add("overflow-hidden");
  };

  /**
   * 🔹 Ferme la modale et réinitialise
   */
  const closeModal = () => {
    if (!authModal) return;
    authModal.classList.add("opacity-0");
    authModal.classList.add("pointer-events-none");
    document.body.classList.remove("overflow-hidden");
  };

  // Boutons d'ouverture
  btnCreateAccount?.addEventListener("click", () => openModal("register"));
  btnLogin?.addEventListener("click", () => openModal("login"));

  // Bouton de fermeture
  modalClose?.addEventListener("click", closeModal);

  // Fermer si on clique à l’extérieur du contenu
  authModal?.addEventListener("click", (e) => {
    if (e.target === authModal) {
      closeModal();
    }
  });

  // Animation fluide
  authModal?.classList.add("transition-all", "duration-300");
});
