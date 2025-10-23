// -----------------------------
// MODAL AUTHENTIFICATION
// -----------------------------

// --- Étape 1 Inscription ---
const formCreate = document.getElementById('formCreate')
const step2Section = document.getElementById('modalCreateAccountStep2')

// Champs visibles étape 1
const fullName = document.getElementById('full-name')
const phone = document.getElementById('phone')
const email = document.getElementById('email')
const daySelect = document.getElementById('daySelect')
const monthSelect = document.getElementById('monthSelect')
const yearSelect = document.getElementById('yearSelect')

// Champ mot de passe étape 2
const createPassword = document.getElementById('createPassword')
const toggleCreatePassword = document.getElementById('toggleCreatePassword')

// Créer un input caché pour envoyer la date ISO complète
let hiddenBirthdate = document.createElement('input')
hiddenBirthdate.type = 'hidden'
hiddenBirthdate.name = 'birthdate'
formCreate.appendChild(hiddenBirthdate)

// Étape 1 → étape 2
formCreate.addEventListener('submit', (e) => {
  e.preventDefault()

  if (!fullName.value || !phone.value || !email.value || !daySelect.value || !monthSelect.value || !yearSelect.value) {
    alert('Veuillez remplir tous les champs obligatoires')
    return
  }

  // Construire la date complète ISO
  const day = String(daySelect.value).padStart(2, '0')
  const month = String(monthSelect.value).padStart(2, '0')
  const year = yearSelect.value
  hiddenBirthdate.value = `${year}-${month}-${day}`

  // Afficher étape 2
  formCreate.classList.add('hidden')
  step2Section.classList.remove('hidden')
})

// Toggle mot de passe création
toggleCreatePassword.addEventListener('click', () => {
  if (createPassword.type === 'password') {
    createPassword.type = 'text'
    toggleCreatePassword.textContent = 'Masquer'
  } else {
    createPassword.type = 'password'
    toggleCreatePassword.textContent = 'Afficher'
  }
})

// Bouton créer le compte (étape 2) : envoi final du formulaire
step2Section.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault()

  // On crée un vrai formulaire POST
  const finalForm = document.createElement('form')
  finalForm.method = 'POST'
  finalForm.action = '/register'

  // CSRF
  const csrfToken = document.querySelector('input[name="_csrf"]').value
  finalForm.innerHTML = `
    <input type="hidden" name="_csrf" value="${csrfToken}">
    <input type="hidden" name="name" value="${fullName.value}">
    <input type="hidden" name="phone" value="${phone.value}">
    <input type="hidden" name="email" value="${email.value}">
    <input type="hidden" name="password" value="${createPassword.value}">
    <input type="hidden" name="birthdate" value="${hiddenBirthdate.value}">
  `

  document.body.appendChild(finalForm)
  finalForm.submit()
})


// --- Remplissage dynamique des jours et années ---
function populateDays() {
  daySelect.innerHTML = '<option value="" disabled selected>Jour</option>'
  for (let i = 1; i <= 31; i++) {
    daySelect.innerHTML += `<option value="${i}">${i}</option>`
  }
}

function populateYears() {
  const currentYear = new Date().getFullYear()
  yearSelect.innerHTML = '<option value="" disabled selected>Année</option>'
  for (let y = currentYear; y >= currentYear - 100; y--) {
    yearSelect.innerHTML += `<option value="${y}">${y}</option>`
  }
}

populateDays()
populateYears()
