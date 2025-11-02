document.addEventListener('DOMContentLoaded', () => {
  const editModal = document.getElementById('editTweetModal');
  const editPanel = document.getElementById('editTweetPanel');
  const closeModalBtn = document.getElementById('closeEditModal');
  const editForm = document.getElementById('editTweetForm');
  const contentInput = document.getElementById('editTweetContent');
  const editBtn = document.getElementById('editPostBtn');
  const emojiBtn = document.getElementById('addEmojiBtnEdit');
  const emojiPicker = document.getElementById('editEmojiPicker');

  // ===============================
  // 🔹 1. OUVERTURE DU MODAL
  // ===============================
  window.openEditModal = function (tweetId, content) {
    document.getElementById('editTweetId').value = tweetId;
    contentInput.value = content;
    editBtn.disabled = content.trim() === '';
    editModal.classList.remove('hidden');
    setTimeout(() => editPanel.classList.add('open'), 10);
  };

  // ===============================
  // 🔹 2. FERMETURE DU MODAL
  // ===============================
  closeModalBtn.addEventListener('click', () => {
    editPanel.classList.remove('open');
    setTimeout(() => editModal.classList.add('hidden'), 200);
  });

  // ===============================
  // 🔹 3. ACTIVER LE BOUTON ENREGISTRER
  // ===============================
  contentInput.addEventListener('input', () => {
    editBtn.disabled = contentInput.value.trim() === '';
  });

  // ===============================
  // 🔹 4. ENVOI DE LA MODIFICATION (PUT)
  // ===============================
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const tweetId = document.getElementById('editTweetId').value;
    const formData = new FormData(editForm);

    editBtn.disabled = true;
    editBtn.textContent = 'Enregistrement...';

    try {
      const response = await fetch(`/tweets/${tweetId}`, {
        method: 'PUT',
        headers: {
          'X-CSRF-TOKEN': formData.get('_csrf'),
        },
        body: formData,
      });

      if (response.ok) {
        alert('✅ Tweet modifié avec succès');
        location.reload();
      } else {
        const text = await response.text();
        console.error('Erreur:', text);
        alert('❌ Erreur lors de la modification du tweet');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Erreur réseau ou serveur');
    } finally {
      editBtn.disabled = false;
      editBtn.textContent = 'Enregistrer';
    }
  });

  // ===============================
  // 🔹 5. GESTION DES ÉMOJIS
  // ===============================

  // Liste simplifiée de plus de 200 emojis (ajoutables selon besoin)
  const emojis = "😀😁😂🤣😃😄😅😆😉😊😋😎😍😘😗😙😚☺🙂🤗🤩🤔🤨😐😑😶🙄😏😣😥😮🤐😯😪😫🥱😴😌😛😜😝🤤😒😓😔😕🙃🫠🤑🤒🤕🤢🤮🤧🥵🥶🥴😵🤯🤠🥳😎🤓🧐😕😟🙁☹😮😯😲😳🥺😭😢😤😠😡🤬😷🤒🤕🤢🤮🤧😇🥰🤗🤭🤫🤥😶‍🌫️😴🫶🤝🙏💪👋🤚🖐✋🖖👌🤌🤏✌🤞🤟🤘🤙👈👉👆🖕👇☝👍👎✊👊🤛🤜👏🙌🫶👐🤲🤝💅👀👁👅👄🫦💋🧠🫀🫁🦷🦴👶👧🧒👦👩🧑👨👩‍🦰🧑‍🦰👨‍🦰👩‍🦱🧑‍🦱👨‍🦱👩‍🦳🧑‍🦳👨‍🦳👩‍🦲🧑‍🦲👨‍🦲👩‍❤️‍👨👨‍❤️‍👨👩‍❤️‍👩💃🕺🕴️🏃‍♂️🏃‍♀️🚶‍♂️🚶‍♀️🧍‍♂️🧍‍♀️🧎‍♂️🧎‍♀️💏💋❤️🧡💛💚💙💜🖤🤍🤎💔❣️💕💞💓💗💖💘💝💟".split('');

  // Construction du picker
  emojis.forEach(e => {
    const span = document.createElement('span');
    span.textContent = e;
    span.addEventListener('click', () => insertEmoji(e));
    emojiPicker.appendChild(span);
  });

  // Afficher / masquer le picker
  emojiBtn.addEventListener('click', () => {
    emojiPicker.classList.toggle('hidden');
  });

  // Insertion emoji dans textarea
  function insertEmoji(emoji) {
    const start = contentInput.selectionStart;
    const end = contentInput.selectionEnd;
    const text = contentInput.value;
    contentInput.value = text.slice(0, start) + emoji + text.slice(end);
    contentInput.focus();
    contentInput.selectionStart = contentInput.selectionEnd = start + emoji.length;
    editBtn.disabled = contentInput.value.trim() === '';
  }
});
