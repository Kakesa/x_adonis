document.addEventListener("DOMContentLoaded", () => {
  const modalLogin = document.getElementById("loginModal");
  const step1 = document.getElementById("loginStep1");
  const step2 = document.getElementById("loginStep2");
  const openLogin = document.getElementById("btnLogin");
  const closeLogin = document.getElementById("closeLogin");
  const nextBtn = document.getElementById("nextLoginStep");
  const submitBtn = document.getElementById("submitLogin");
  const gotoRegister = document.getElementById("gotoRegisterFromLogin");
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-message");

  // ✅ Toast
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

  // ✅ Ouverture / fermeture
  openLogin?.addEventListener("click", () => modalLogin.classList.remove("hidden"));
  closeLogin?.addEventListener("click", () => {
    modalLogin.classList.add("hidden");
    step1.classList.remove("hidden");
    step2.classList.add("hidden");
  });

  // ✅ Étape 1 → Étape 2
  nextBtn?.addEventListener("click", () => {
    const email = document.getElementById("loginEmail")?.value.trim();
    if (!email) return showToast("Veuillez entrer votre email.", "error");
    step1.classList.add("hidden");
    step2.classList.remove("hidden");
  });

  // ✅ Soumission
  submitBtn?.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPassword")?.value;

    if (!email || !password) {
      return showToast("Veuillez remplir tous les champs.", "error");
    }

    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        showToast(data.message || "Erreur de connexion", "error");
        return;
      }

      showToast(data.message || "Bienvenue ", "success");
      setTimeout(() => (window.location.href = "/index"), 1500);
    } catch (err) {
      console.error("Erreur lors du login:", err);
      showToast("Erreur réseau, réessayez.", "error");
    }
  });

  // ✅ Aller à l'inscription
  gotoRegister?.addEventListener("click", () => {
    modalLogin.classList.add("hidden");
    const modalRegister = document.getElementById("registerModal");
    modalRegister?.classList.remove("hidden");
  });
});