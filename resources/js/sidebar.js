document.addEventListener("DOMContentLoaded", function () {
    const userInitialsDiv = document.getElementById('user-initials');
    const userName = "{{ auth.user.name }}";
    const initials = userName.charAt(0).toUpperCase() + (userName.split(' ')[1]?.charAt(0).toUpperCase() || '');

    function getRandomColor() {
        const colors = ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    if (userInitialsDiv) {
        userInitialsDiv.textContent = initials;
        userInitialsDiv.classList.add(getRandomColor());
    }

    const trigger = document.getElementById("accountMenuTrigger");
    const menuDesktop = document.getElementById("accountMenuDesktop");
    const menuMobile = document.getElementById("accountMenuMobile");
    const closeMobile = document.getElementById("closeMenuMobile");

    trigger.addEventListener("click", (e) => {
        e.stopPropagation(); // éviter de fermer immédiatement
        if (window.innerWidth >= 768) {
            menuDesktop.classList.toggle("hidden");
        } else {
            menuMobile.classList.toggle("hidden");
        }
    });

    document.addEventListener("click", (e) => {
        if (menuDesktop && !menuDesktop.contains(e.target) && !trigger.contains(e.target)) {
            menuDesktop.classList.add("hidden");
        }
    });

    closeMobile?.addEventListener("click", () => {
        menuMobile.classList.add("hidden");
    });
});