async function toggleRetweet(tweetId) {
    try {
        const res = await fetch(`/tweets/${tweetId}/retweet`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrfToken }}' // si nécessaire pour Adonis
            }
        });

        const data = await res.json();

        if (res.ok) {
            // Mettre à jour le compteur en direct
            const countEl = document.getElementById(`retweet-count-${tweetId}`);
            let currentCount = parseInt(countEl.innerText);

            if (data.message.includes('supprimé')) {
                // Retweet supprimé → décrémenter
                countEl.innerText = Math.max(currentCount - 1, 0);
            } else {
                // Retweet créé → incrémenter
                countEl.innerText = currentCount + 1;
            }
        } else {
            console.error(data.message || 'Erreur lors du retweet');
        }
    } catch (err) {
        console.error(err);
    }
}