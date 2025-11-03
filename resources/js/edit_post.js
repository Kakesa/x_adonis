document.addEventListener('DOMContentLoaded', () => {
  const editModal = document.getElementById('editTweetModal');
  const editPanel = document.getElementById('editTweetPanel');
  const closeModalBtn = document.getElementById('closeEditModal');
  const editForm = document.getElementById('editTweetForm');
  const contentInput = document.getElementById('editTweetContent');
  const editBtn = document.getElementById('editPostBtn');
  const emojiBtn = document.getElementById('addEmojiBtnEdit');
  const emojiPicker = document.getElementById('editEmojiPicker');
  const mediaInput = document.getElementById('editTweetMedia');
  const mediaPreview = document.getElementById('editMediaPreview');

  let keptMedia = [];
  let newMediaFiles = [];

  // -------------------------
  // Ouvrir le modal
  // -------------------------
  window.openEditModal = (tweetId, content, existingMedia = []) => {
    document.getElementById('editTweetId').value = tweetId;
    contentInput.value = content;
    editBtn.disabled = content.trim() === '';

    keptMedia = existingMedia.map(m => ({ ...m })); // clone
    newMediaFiles = [];

    mediaPreview.innerHTML = '';

    keptMedia.forEach(media => {
      mediaPreview.appendChild(createMediaPreview(media.url, media.type, true));
    });

    editModal.classList.remove('hidden');
    setTimeout(() => editPanel.classList.add('open'), 10);
  };

  // -------------------------
  // Fermer le modal
  // -------------------------
  closeModalBtn.addEventListener('click', () => {
    editPanel.classList.remove('open');
    setTimeout(() => editModal.classList.add('hidden'), 200);
  });

  // -------------------------
  // Bouton enregistrer activé
  // -------------------------
  contentInput.addEventListener('input', () => {
    editBtn.disabled = contentInput.value.trim() === '';
  });

  // -------------------------
  // Gestion des médias
  // -------------------------
  document.getElementById('addImageBtnEdit').addEventListener('click', () => mediaInput.click());

  mediaInput.addEventListener('change', (e) => {
    Array.from(e.target.files).forEach(file => {
      newMediaFiles.push(file);
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('video') ? 'video' : 'image';
      mediaPreview.appendChild(createMediaPreview(url, type, false, file));
    });
  });

  function createMediaPreview(url, type, isExisting = false, file = null) {
    const wrapper = document.createElement('div');
    wrapper.className = 'relative w-24 h-24 rounded-lg overflow-hidden border border-gray-700 group';

    const removeBtn = document.createElement('button');
    removeBtn.className =
      'absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition';
    removeBtn.innerHTML = '&times;';
    removeBtn.addEventListener('click', () => {
      wrapper.remove();
      if (isExisting) keptMedia = keptMedia.filter(m => m.url !== url);
      else newMediaFiles = newMediaFiles.filter(f => f !== file);
    });

    if (type === 'video') {
      const video = document.createElement('video');
      video.src = url;
      video.className = 'w-full h-full object-cover';
      video.controls = false;
      wrapper.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = url;
      img.className = 'w-full h-full object-cover';
      wrapper.appendChild(img);
    }

    wrapper.appendChild(removeBtn);
    return wrapper;
  }

  // -------------------------
  // Soumettre le formulaire
  // -------------------------
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const tweetId = document.getElementById('editTweetId').value;
    const formData = new FormData();
    formData.append('content', contentInput.value);
    formData.append('_csrf', document.querySelector('input[name=_csrf]').value);

    // Ajouter les médias conservés
    keptMedia.forEach(m => formData.append('keptMedia[]', m.url));
    // Ajouter les nouveaux fichiers
    newMediaFiles.forEach(f => formData.append('media', f));

    editBtn.disabled = true;
    editBtn.textContent = 'Enregistrement...';

    try {
      const response = await fetch(`/tweets/${tweetId}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        showToast('✅ Tweet modifié avec succès', 'success');
        location.reload();
      } else {
        const text = await response.text();
        console.error('Erreur:', text);
        showToast('❌ Erreur lors de la modification du tweet', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('❌ Erreur réseau ou serveur', 'error');
    } finally {
      editBtn.disabled = false;
      editBtn.textContent = 'Enregistrer';
    }
  });

  // -------------------------
  // Gestion emojis
  // -------------------------
  const emojis = '😀😁😂🤣😃😄😅😆😉😊😋😎😍😘😗😙😚☺🙂🤗🤩🤔🤨😐😑😶🙄😏😣😥😮🤐😯😪😫🥱😴😌😛😜😝🤤😒😓😔😕🙃🫠🤑🤒🤕🤢🤮🤧🥵🥶🥴😵🤯🤠🥳😎🤓🧐🥺😭😢😤😠😡🤬😷🤒🤕🤢🤮🤧😇🥰🤗🤭🤫🤥😴🫶🤝🙏💪👋🤚🖐✋🖖👌🤌🤏✌🤞🤟🤘🤙👍👎👏🙌🫶👐🤲🙏💋❤️💖💙💚💛💜🖤🤍🤎💔❣️💕💞💓💗💘💝💟'.split('');
  emojis.forEach(e => {
    const span = document.createElement('span');
    span.textContent = e;
    span.className = 'cursor-pointer hover:bg-gray-700 rounded px-1';
    span.addEventListener('click', () => insertEmoji(e));
    emojiPicker.appendChild(span);
  });

  emojiBtn.addEventListener('click', () => emojiPicker.classList.toggle('hidden'));

  function insertEmoji(emoji) {
    const start = contentInput.selectionStart;
    const end = contentInput.selectionEnd;
    contentInput.value = contentInput.value.slice(0, start) + emoji + contentInput.value.slice(end);
    contentInput.selectionStart = contentInput.selectionEnd = start + emoji.length;
    contentInput.focus();
    editBtn.disabled = contentInput.value.trim() === '';
  }

  // -------------------------
  // Toast
  // -------------------------
  window.showToast = (msg, type='info') => {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg text-white shadow-lg z-50 ${
      type==='success' ? 'bg-green-600' : type==='error' ? 'bg-red-600':'bg-gray-700'}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };
});
