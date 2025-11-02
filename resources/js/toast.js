// ===============================
// 🔹 TOAST SYSTEME GLOBAL
// ===============================
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `
    flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white animate-slideIn
    ${type === 'success' ? 'bg-green-600' :
      type === 'error' ? 'bg-red-600' :
      'bg-gray-700'}
  `;
  toast.innerHTML = `
    <span>${
      type === 'success' ? '✅' :
      type === 'error' ? '❌' :
      'ℹ️'
    }</span>
    <span>${message}</span>
  `;

  const container = document.getElementById('toastContainer');
  container.appendChild(toast);

  // disparition automatique
  setTimeout(() => {
    toast.classList.add('animate-fadeOut');
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

// ===============================
// 🔹 Animation CSS
// ===============================
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes fadeOut {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(100%); }
  }
  .animate-slideIn { animation: slideIn 0.3s ease-out; }
  .animate-fadeOut { animation: fadeOut 0.5s ease-in forwards; }
`;
document.head.appendChild(style);
