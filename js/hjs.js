function expandAndRedirect(page, section) {
    const topHalf = document.getElementById('topHalf');
    const bottomHalf = document.getElementById('bottomHalf');

    // Désactiver les clics
    topHalf.style.pointerEvents = "none";
    bottomHalf.style.pointerEvents = "none";

    // Cible de l'animation
    const target = section === 'top' ? topHalf : bottomHalf;

    // Étapes intermédiaires
    let currentStep = 1; // Étape de départ
    const totalSteps = 10; // Nombre total d'étapes
    const scaleIncrement = 0.1; // Incrémentation de la taille par étape

    // Fonction pour gérer chaque étape
    const animateStep = () => {
        if (currentStep <= totalSteps) {
            const scaleValue = 1 + currentStep * scaleIncrement; // Calcul de la taille
            target.style.transform = `scale(${scaleValue})`; // Appliquer le style
            currentStep++; // Passer à l'étape suivante
            setTimeout(animateStep, 100); // Attendre avant la prochaine étape
        } else {
            // Redirection après la dernière étape
            window.location.href = page;
        }
    };

    // Lancer l'animation
    animateStep();
}
