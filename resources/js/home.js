document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("new-tweet-content");
  const postBtn = document.getElementById("post-tweet-button");
  const parent = textarea.parentElement;

  // Media input
  const mediaInput = document.createElement("input");
  mediaInput.type = "file";
  mediaInput.name = "media";
  mediaInput.multiple = true;
  mediaInput.classList.add("hidden");
  parent.appendChild(mediaInput);

  // Emoji picker
  const emojiPicker = document.createElement("div");
  emojiPicker.className = "mt-2 hidden flex flex-wrap gap-1 max-h-32 overflow-y-auto border-t border-gray-800 pt-2";
  parent.appendChild(emojiPicker);

  const addEmojiBtn = parent.querySelector('[aria-label="Add emoji"]');
  const emojis = ["😀","😁","😂","🤣","😃","😄","😅","😆","😉","😊","😋","😎","😍","😘"];

  if(addEmojiBtn) addEmojiBtn.addEventListener("click", ()=>{
    emojiPicker.innerHTML = "";
    emojis.forEach(e=>{
      const span = document.createElement("span");
      span.textContent = e;
      span.className = "cursor-pointer text-lg";
      span.addEventListener("click", ()=>{ textarea.value += e; toggleSubmit(); });
      emojiPicker.appendChild(span);
    });
    emojiPicker.classList.toggle("hidden");
  });

  // Toggle post button
  function toggleSubmit(){
    postBtn.disabled = textarea.value.trim() === "" && mediaInput.files.length === 0;
    postBtn.classList.toggle("opacity-50", postBtn.disabled);
    postBtn.classList.toggle("cursor-not-allowed", postBtn.disabled);
  }

  textarea.addEventListener("input", toggleSubmit);
  mediaInput.addEventListener("change", toggleSubmit);
  toggleSubmit();

  // Media button
  const imgBtn = parent.querySelector('[aria-label="Add image"]');
  if(imgBtn) imgBtn.addEventListener("click", ()=>mediaInput.click());

  // Submit
  postBtn.addEventListener("click", async () => {
    const content = textarea.value.trim();
    if(!content && mediaInput.files.length === 0) return;

    const formData = new FormData();
    formData.append("content", content);
    formData.append("visibility", "public");
    Array.from(mediaInput.files).forEach(f => formData.append("media", f));

    try {
      const res = await fetch("/tweets", { method: "POST", body: formData });
      if(!res.ok) throw new Error("Erreur lors de la publication");

      textarea.value = "";
      mediaInput.value = "";
      emojiPicker.classList.add("hidden");
      toggleSubmit();

      location.reload(); // ou prepend le tweet dans le DOM
    } catch(err) {
      console.error(err);
      alert("Impossible de poster le tweet");
    }
  });
});
