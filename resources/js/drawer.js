document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.getElementById('openProfileDrawer')
  const closeBtn = document.getElementById('closeProfileDrawer')
  const drawer = document.getElementById('profileDrawer')
  const overlay = document.getElementById('profileDrawerOverlay')

  if (openBtn && closeBtn && drawer && overlay) {
    const openDrawer = () => {
      drawer.classList.remove('-translate-x-full', 'hidden')
      overlay.classList.remove('hidden')
    }

    const closeDrawer = () => {
      drawer.classList.add('-translate-x-full')
      setTimeout(() => {
        drawer.classList.add('hidden')
        overlay.classList.add('hidden')
      }, 300)
    }

    openBtn.addEventListener('click', openDrawer)
    closeBtn.addEventListener('click', closeDrawer)
    overlay.addEventListener('click', closeDrawer)
  }
})