document.addEventListener("DOMContentLoaded", () => {
  const step1 = document.getElementById("registerStep1");
  const step2 = document.getElementById("registerStep2");
  const nextBtn = document.getElementById("nextRegisterStep");
  const closeBtn = document.getElementById("closeRegister");
  const registerModal = document.getElementById("registerModal");

  const daySelect = document.getElementById("daySelect");
  const monthSelect = document.getElementById("monthSelect");
  const yearSelect = document.getElementById("yearSelect");
  const form = registerModal.querySelector("form");
  const hiddenBirthdate = form.querySelector("input[name='birthdate']");

  // Remplir jours
  for(let i=1; i<=31; i++) daySelect.innerHTML += `<option value="${i}">${i}</option>`;

  // Remplir mois
  const months = [
    'Janvier','Février','Mars','Avril','Mai','Juin',
    'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
  ];
  for(let m=1; m<=12; m++) monthSelect.innerHTML += `<option value="${m}">${months[m-1]}</option>`;

  // Remplir années
  const currentYear = new Date().getFullYear();
  for(let i=currentYear; i>=1900; i--) yearSelect.innerHTML += `<option value="${i}">${i}</option>`;

  // Étape 1 → Étape 2
  nextBtn?.addEventListener("click", () => {
    step1.classList.add("hidden");
    step2.classList.remove("hidden");
  });

  // Fermer modal
  closeBtn.addEventListener("click", () => registerModal.style.display = "none");

  // Avant la soumission : combiner day/month/year en ISO
  form.addEventListener("submit", (e) => {
    const day = daySelect.value;
    const month = monthSelect.value;
    const year = yearSelect.value;

    if (!day || !month || !year) {
      e.preventDefault();
      alert("Veuillez sélectionner votre date de naissance complète");
      return;
    }

    hiddenBirthdate.value = `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`;
  });
});