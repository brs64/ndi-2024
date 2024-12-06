document.addEventListener('DOMContentLoaded', () => {
    // Récupération des points interactifs et du conteneur info-box
    const points = document.querySelectorAll('.point');
    const infoBox = document.getElementById('info-box');
    const infoTitle = document.getElementById('info-title');
    const infoContent = document.getElementById('info-content');
    const infoImage = document.querySelector('.info-image');

    points.forEach(point => {
        point.addEventListener('click', () => {
            // Récupérer les données de l'élément cliqué
            const infoText = point.getAttribute('data-info');
            const imageSrc = point.getAttribute('data-image');
            
            // Mettre à jour la boîte d'information
            infoTitle.textContent = "Informations";
            infoContent.textContent = infoText;
            
            if (imageSrc) {
                infoImage.src = imageSrc;
                infoImage.style.display = 'block'; // Assurez-vous que l'image est visible
            } else {
                infoImage.style.display = 'none'; // Masquer l'image si aucune donnée
            }

            // Afficher la boîte d'information si elle est cachée
            infoBox.style.display = 'block';
        });
    });
});
