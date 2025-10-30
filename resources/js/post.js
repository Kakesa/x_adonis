
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("postModal");
  const openBtn = document.getElementById("openPostModal");
  const closeBtn = document.getElementById("closePostModal");
  const textarea = document.getElementById("modalTweetContent");
  const postBtn = document.getElementById("postFromModal");
  const form = modal.querySelector("form");

  if (!modal || !openBtn || !closeBtn || !textarea || !postBtn) return;

  const closeModal = () => {
    modal.classList.add("hidden");
    textarea.value = "";
    postBtn.disabled = true;
    form.reset();
    document.body.style.overflow = "";
  };

  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.remove("hidden");
    setTimeout(() => textarea.focus(), 30);
    document.body.style.overflow = "hidden";
  });

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  });

  textarea.addEventListener("input", () => {
    postBtn.disabled = textarea.value.trim() === "";
  });

  form.addEventListener("submit", () => {
    setTimeout(() => closeModal(), 200);
  });
});
