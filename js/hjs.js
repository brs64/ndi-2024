const img1 = document.getElementById('img1');
    const img2 = document.getElementById('img2');

    // Fonction pour étendre une image au-dessus de l'autre
    function toggleFullScreen(clickedImage, otherImage, redirectionURL) {
        clickedImage.classList.toggle('full-screen');
        if (clickedImage.classList.contains('full-screen')) {
            otherImage.classList.remove('full-screen');
            // Redirection après un délai pour voir l'animation
            setTimeout(() => {
                window.location.href = redirectionURL;
            }, 1200); // Délai de 1 seconde (pour que l'animation se termine)
        }
    }

    img1.addEventListener('click', () => {
        toggleFullScreen(img1, img2, 'ocean.html');
    });

    img2.addEventListener('click', () => {
        toggleFullScreen(img2, img1, 'corps.html');
    });