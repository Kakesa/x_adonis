document.addEventListener("DOMContentLoaded", () => {
  // Modals
  const authModal = document.getElementById('authModal')
  const registerModal = document.getElementById('registerModal')
  const loginModal = document.getElementById('loginModal')

  // Buttons
  const btnCreateAccount = document.getElementById('btnCreateAccount')
  const btnLogin = document.getElementById('btnLogin')

  // Toast container
  const toastContainer = document.getElementById('toastContainer')

  // Étapes modales
  const registerStep1 = document.getElementById('registerStep1')
  const registerStep2 = document.getElementById('registerStep2')
  const nextRegisterStep = document.getElementById('nextRegisterStep')
  const closeRegister = document.getElementById('closeRegister')

  const loginStep1 = document.getElementById('loginStep1')
  const loginStep2 = document.getElementById('loginStep2')
  const nextLoginStep = document.getElementById('nextLoginStep')
  const closeLogin = document.getElementById('closeLogin')

  // Ouvrir modale inscription
  btnCreateAccount?.addEventListener('click', () => {
    authModal.classList.remove('opacity-0', 'pointer-events-none')
    registerModal.classList.remove('hidden')
    loginModal.classList.add('hidden')
  })

  // Ouvrir modale connexion
  btnLogin?.addEventListener('click', () => {
    authModal.classList.remove('opacity-0', 'pointer-events-none')
    loginModal.classList.remove('hidden')
    registerModal.classList.add('hidden')
  })

  // Fermer modale inscription
  closeRegister?.addEventListener('click', () => {
    registerModal.classList.add('hidden')
    authModal.classList.add('opacity-0', 'pointer-events-none')
    registerStep1.classList.remove('hidden')
    registerStep2.classList.add('hidden')
  })

  // Fermer modale connexion
  closeLogin?.addEventListener('click', () => {
    loginModal.classList.add('hidden')
    authModal.classList.add('opacity-0', 'pointer-events-none')
    loginStep1.classList.remove('hidden')
    loginStep2.classList.add('hidden')
  })

  // Inscription step 1 → step 2
  nextRegisterStep?.addEventListener('click', () => {
    registerStep1.classList.add('hidden')
    registerStep2.classList.remove('hidden')
  })

  // Login step 1 → step 2
  nextLoginStep?.addEventListener('click', () => {
    loginStep1.classList.add('hidden')
    loginStep2.classList.remove('hidden')
  })

  // Fonction pour afficher un toast
  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div')
    toast.className = `px-4 py-2 rounded-lg text-white shadow-md transform transition-all ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`
    toast.textContent = message
    toastContainer.appendChild(toast)
    setTimeout(() => toast.remove(), 5000)
  }

  // Flash messages depuis Edge
  if (window.flashMessages) {
    if (window.flashMessages.success) {
      showToast(window.flashMessages.success, 'success')
      // Ouvrir login modal si succès
      authModal.classList.remove('opacity-0', 'pointer-events-none')
      loginModal.classList.remove('hidden')
      registerModal.classList.add('hidden')
    }
    if (window.flashMessages.error) {
      showToast(window.flashMessages.error, 'error')
      // Ouvrir register modal si erreur
      authModal.classList.remove('opacity-0', 'pointer-events-none')
      registerModal.classList.remove('hidden')
      loginModal.classList.add('hidden')
    }
  }
})
