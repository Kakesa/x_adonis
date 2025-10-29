/**
 * Configure les fonctionnalités des tiroirs (drawers) et des modales (modals).
 */
function setupDrawersAndModals() {
    const btnOpenProfile = document.getElementById('btnOpenProfile'); // Bouton qui ouvre le tiroir
    const profileDrawer = document.getElementById('profileDrawer');
    const btnCloseProfileBottom = document.getElementById('btnCloseProfileBottom');
    const overlay = document.getElementById('overlay');

    const btnOpenAccountOptions = document.getElementById('btnOpenAccountOptions'); // Bouton dans le tiroir mobile (le "+")
    const btnOpenAccountOptionsDesktop = document.getElementById('btnOpenAccountOptionsDesktop'); // Bouton dans la sidebar desktop (si existe)
    const accountOptionsModal = document.getElementById('accountOptionsModal');
    const btnCloseAccountOptions = document.getElementById('btnCloseAccountOptions');


    if (!overlay) {
        console.error("L'élément 'overlay' est introuvable. Veuillez vous assurer qu'il est présent dans votre HTML.");
        return; // Arrête la fonction si l'overlay n'est pas là
    }

    // Fonction générique pour fermer le tiroir
    const closeProfileDrawer = () => {
        if (profileDrawer) { // Vérifier si profileDrawer existe avant d'essayer de le manipuler
            profileDrawer.classList.remove('translate-x-0');
            profileDrawer.classList.add('-translate-x-full');
        }
        overlay.classList.remove('opacity-100', 'pointer-events-auto');
        overlay.classList.add('opacity-0', 'pointer-events-none');
        document.body.classList.remove('overflow-hidden');
    };

    // Fonction générique pour fermer la modale des options de compte
    const closeAccountOptionsModal = () => {
        if (accountOptionsModal) { // Vérifier si accountOptionsModal existe avant d'essayer de le manipuler
            accountOptionsModal.classList.remove('translate-y-0');
            accountOptionsModal.classList.add('translate-y-full');
        }
        overlay.classList.remove('opacity-100', 'pointer-events-auto');
        overlay.classList.add('opacity-0', 'pointer-events-none');
        document.body.classList.remove('overflow-hidden');
    };


    // Toggle Profile Drawer (Ouverture)
    if (btnOpenProfile && profileDrawer) { // btnCloseProfile n'est plus vérifié ici
        btnOpenProfile.addEventListener('click', () => {
            profileDrawer.classList.remove('-translate-x-full');
            profileDrawer.classList.add('translate-x-0');
            overlay.classList.remove('opacity-0', 'pointer-events-none');
            overlay.classList.add('opacity-100', 'pointer-events-auto');
            document.body.classList.add('overflow-hidden'); // Empêche le défilement du corps
        });
    }

    // Fermeture du tiroir via le bouton en bas (si présent)
    if (btnCloseProfileBottom) {
        btnCloseProfileBottom.addEventListener('click', closeProfileDrawer);
    }


    // Ferme le tiroir et/ou la modale si on clique sur l'overlay
    overlay.addEventListener('click', () => {
        // Si le tiroir est ouvert, le fermer
        if (profileDrawer && !profileDrawer.classList.contains('-translate-x-full')) {
            closeProfileDrawer();
        }
        // Si la modale est ouverte, la fermer
        if (accountOptionsModal && !accountOptionsModal.classList.contains('translate-y-full')) {
            closeAccountOptionsModal();
        }
    });


    // Toggle Account Options Modal (Ouverture)
    const openAccountOptions = () => {
        if (accountOptionsModal) { // Vérifier l'existence de la modale
            accountOptionsModal.classList.remove('translate-y-full');
            accountOptionsModal.classList.add('translate-y-0');
            overlay.classList.remove('opacity-0', 'pointer-events-none');
            overlay.classList.add('opacity-100', 'pointer-events-auto');
            document.body.classList.add('overflow-hidden'); // Empêche le défilement du corps
        }

        // Si le tiroir de profil est ouvert, le fermer en même temps
        if (profileDrawer && !profileDrawer.classList.contains('-translate-x-full')) {
            profileDrawer.classList.remove('translate-x-0');
            profileDrawer.classList.add('-translate-x-full');
            // L'overlay est géré par l'ouverture de la modale des comptes, donc pas besoin de le modifier ici
        }
    };

    if (btnOpenAccountOptions) {
        btnOpenAccountOptions.addEventListener('click', openAccountOptions);
    }
    if (btnOpenAccountOptionsDesktop) {
        btnOpenAccountOptionsDesktop.addEventListener('click', openAccountOptions);
    }

    // Fermeture de la modale des options de compte
    if (btnCloseAccountOptions && accountOptionsModal) { // overlay n'est pas nécessaire ici, il est géré par la fonction close
        btnCloseAccountOptions.addEventListener('click', closeAccountOptionsModal);
    }
}