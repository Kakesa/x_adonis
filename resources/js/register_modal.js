document.addEventListener("DOMContentLoaded", () => {
  const step1 = document.getElementById("registerStep1");
  const step2 = document.getElementById("registerStep2");
  const nextBtn = document.getElementById("nextRegisterStep");
  const closeBtn = document.getElementById("closeRegister");
  const registerModal = document.getElementById("registerModal");

  const daySelect = document.getElementById("daySelect");
  const monthSelect = document.getElementById("monthSelect");
  const yearSelect = document.getElementById("yearSelect");
  const form = document.getElementById("registerForm");
  const hiddenBirthdate = form.querySelector("input[name='birthdate']");

  const toast = document.getElementById("toastRegister");
  const toastMsg = document.getElementById("toastRegisterMessage");

  // Fonction toast
  function showToast(message, type = "success") {
    toastMsg.textContent = message;
    toast.style.backgroundColor = type === "success" ? "#16a34a" : "#dc2626";
    toast.classList.remove("hidden");
    toast.style.opacity = 0;
    setTimeout(() => {
      toast.style.opacity = 1;
    }, 50);
    setTimeout(() => {
      toast.style.opacity = 0;
      setTimeout(() => toast.classList.add("hidden"), 300);
    }, 4000);
  }

  // Remplir jours
  for(let i=1; i<=31; i++) daySelect.innerHTML += `<option value="${i}">${i}</option>`;

  // Remplir mois
  const months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  for(let m=1; m<=12; m++) monthSelect.innerHTML += `<option value="${m}">${months[m-1]}</option>`;

  // Remplir années
  const currentYear = new Date().getFullYear();
  for(let i=currentYear; i>=1900; i--) yearSelect.innerHTML += `<option value="${i}">${i}</option>`;

  // Étape 1 → Étape 2
  nextBtn.addEventListener("click", () => {
    const day = daySelect.value;
    const month = monthSelect.value;
    const year = yearSelect.value;

    if (!day || !month || !year) {
      showToast("Veuillez sélectionner votre date de naissance complète", "error");
      return;
    }

    step1.classList.add("hidden");
    step2.classList.remove("hidden");
  });

  // Fermer modal
  closeBtn.addEventListener("click", () => registerModal.classList.add("hidden"));

  // Avant soumission : date ISO
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const day = daySelect.value.padStart(2,'0');
    const month = monthSelect.value.padStart(2,'0');
    const year = yearSelect.value;

    hiddenBirthdate.value = `${year}-${month}-${day}`;

    const formData = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
        },
        credentials: 'same-origin',
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        showToast(data.message || "Erreur lors de l'inscription", "error");
        return;
      }

      showToast("Compte créé ! Vérifiez votre email.", "success");

      setTimeout(() => {
        registerModal.classList.add("hidden");
        const loginModal = document.getElementById("loginModal");
        loginModal?.classList.remove("hidden");
      }, 1500);

    } catch (err) {
      console.error("Erreur register:", err);
      showToast("Erreur réseau, réessayez.", "error");
    }
  });

  // Aller à login
  const gotoLogin = document.getElementById("gotoLoginFromRegister");
  gotoLogin?.addEventListener("click", () => {
    registerModal.classList.add("hidden");
    const loginModal = document.getElementById("loginModal");
    loginModal?.classList.remove("hidden");
  });
});
