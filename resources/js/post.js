document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("postModal");
    const panel = document.getElementById("postPanel");
    const openBtn = document.getElementById("openPostModal");
    const closeBtn = document.getElementById("closePostModal");
    const textarea = document.getElementById("modalTweetContent");
    const postBtn = document.getElementById("postFromModal");
    const mediaInput = document.getElementById("tweetMedia");
    const form = document.getElementById("postForm");
    const pollContainer = document.getElementById("pollContainer");
    const addPollBtn = document.getElementById("addPollBtn");
    const addPollOption = document.getElementById("addPollOption");
    const emojiPicker = document.getElementById("emojiPicker");
    const addEmojiBtn = document.getElementById("addEmojiBtn");
    const pollDataInput = document.getElementById("pollData");

    if (!modal || !panel || !textarea || !postBtn) return;

    // -----------------------
    // Modal open/close
    // -----------------------
    function openModal() { modal.classList.remove("hidden"); requestAnimationFrame(()=>panel.classList.add("open")); setTimeout(()=>textarea.focus(),120); document.documentElement.style.overflow="hidden"; document.body.style.overflow="hidden"; }
    function closeModal() { panel.classList.remove("open"); setTimeout(()=>{ modal.classList.add("hidden"); form.reset(); textarea.value=""; postBtn.disabled=true; pollContainer.classList.add("hidden"); emojiPicker.classList.add("hidden"); document.documentElement.style.overflow=""; document.body.style.overflow=""; },220); }

    if(openBtn) openBtn.addEventListener("click", e=>{ e.preventDefault(); openModal(); });
    if(closeBtn) closeBtn.addEventListener("click", e=>{ e.preventDefault(); closeModal(); });
    modal.addEventListener("click", e=>{ if(e.target===modal) closeModal(); });
    document.addEventListener("keydown", e=>{ if(e.key==="Escape"&&!modal.classList.contains("hidden")) closeModal(); });

    // -----------------------
    // Enable/disable post button
    // -----------------------
    function toggleSubmit() { postBtn.disabled = textarea.value.trim()==="" && mediaInput.files.length===0 && pollContainer.querySelectorAll("input[type=text]").length===0; }
    textarea.addEventListener("input", toggleSubmit);
    mediaInput.addEventListener("change", toggleSubmit);

    // -----------------------
    // Media button
    // -----------------------
    const imgBtn = modal.querySelector('[aria-label="Add image"]');
    if(imgBtn) imgBtn.addEventListener("click", ()=>mediaInput.click());

    // -----------------------
    // Poll
    // -----------------------
    if(addPollBtn) addPollBtn.addEventListener("click", ()=>{ pollContainer.classList.toggle("hidden"); toggleSubmit(); });
    if(addPollOption) addPollOption.addEventListener("click", ()=>{ 
        const div = document.createElement("div"); 
        div.className="flex gap-2 mt-1"; 
        div.innerHTML=`<input type="text" placeholder="Option" class="flex-1 bg-gray-800 rounded px-2 py-1">`;
        pollContainer.appendChild(div); 
    });

    // -----------------------
    // Emoji picker
    // -----------------------
    const emojis = ["😀","😂","😍","😎","😭","🤔","👍","🎉","💯"];
    if(addEmojiBtn) addEmojiBtn.addEventListener("click", ()=>{
        emojiPicker.innerHTML="";
        emojis.forEach(e=>{ const span=document.createElement("span"); span.textContent=e; span.addEventListener("click", ()=>{ textarea.value+=e; toggleSubmit(); }); emojiPicker.appendChild(span); });
        emojiPicker.classList.toggle("hidden");
    });

    // -----------------------
    // Submit form
    // -----------------------
    if(form) form.addEventListener("submit", ()=>{
        const pollOptions = Array.from(pollContainer.querySelectorAll("input[type=text]")).map(i=>i.value).filter(Boolean);
        pollDataInput.value = JSON.stringify(pollOptions);
        setTimeout(()=>closeModal(),200);
    });
});