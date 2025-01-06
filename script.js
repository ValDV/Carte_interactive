var convaContext; // Contexte du canvas utilisé pour le dessin
var translations = {}; // Objet pour stocker les traductions

// Exécute cette fonction une fois que le DOM est entièrement chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    myInit();
});

// Raccourci pour récupérer un élément par son ID
function byId(e) { return document.getElementById(e); }

// Dessine un polygone sur le canvas à partir d'une chaîne de coordonnées
function drawPoly(coOrdStr) {
    const mCoords = coOrdStr.split(',');

    convaContext.beginPath();
    convaContext.moveTo(mCoords[0], mCoords[1]);

    for (let i = 2; i < mCoords.length; i += 2) {
        convaContext.lineTo(mCoords[i], mCoords[i + 1]);
    }

    convaContext.lineTo(mCoords[0], mCoords[1]); // Ferme le polygone
    convaContext.stroke(); // Trace les contours
}

// Dessine un rectangle sur le canvas à partir d'une chaîne de coordonnées
function drawRect(coOrdStr) {
    const mCoords = coOrdStr.split(',');

    const left = mCoords[0];
    const top = mCoords[1];
    const right = mCoords[2];
    const bot = mCoords[3];

    convaContext.strokeRect(left, top, right - left, bot - top); // Trace le rectangle
}

// Gère l'événement de survol d'une zone interactive
function myHover(element) {
    const coordStr = element.getAttribute('coords'); // Coordonnées de la zone
    const areaType = element.getAttribute('shape'); // Type de la zone (cercle, rectangle, polygone)

    switch (areaType) {
        case 'circle':
            drawCircle(coordStr); // Dessine un cercle
            break;

        case 'polygon':
        case 'poly':
            drawPoly(coordStr); // Dessine un polygone
            break;

        case 'rect':
            drawRect(coordStr); // Dessine un rectangle
            break;
    }
}

// Efface les dessins du canvas lorsque la souris quitte une zone
function myLeave() {
    const canvas = byId('myCanvas');
    convaContext.clearRect(0, 0, canvas.width, canvas.height); // Efface tout le contenu du canvas
}

// Initialise l'application
function myInit() {
    const img = byId('map'); // Image principale associée à la carte

    const x = img.offsetLeft; // Position horizontale de l'image
    const y = img.offsetTop; // Position verticale de l'image
    const w = img.clientWidth; // Largeur de l'image
    const h = img.clientHeight; // Hauteur de l'image

    const imgParent = img.parentNode;
    const canva = byId('myCanvas');
    imgParent.appendChild(canva);

    canva.style.zIndex = 1;

    canva.style.left = x + 'px';
    canva.style.top = y + 'px';

    canva.setAttribute('width', w + 'px');
    canva.setAttribute('height', h + 'px');

    convaContext = canva.getContext('2d');

    convaContext.fillStyle = 'red'; // Couleur de remplissage
    convaContext.strokeStyle = 'red'; // Couleur des contours
    convaContext.lineWidth = 2; // Épaisseur des contours

    // Charge les traductions depuis un fichier JSON
    fetch('translations.json')
        .then(response => response.json())
        .then(data => {
            translations = data;
            console.log('Translations loaded:', translations);
            changeLanguage('fr'); // Définit la langue par défaut sur le français
        })
        .catch(error => console.error('Error loading translations:', error));
}

// Change la langue de l'application
function changeLanguage(lang) {
    console.log('Changing language to:', lang);
    document.documentElement.lang = lang; // Définit la langue du document HTML
    document.title = translations[lang].title; // Change le titre de la page

    // Met à jour les éléments traduisibles
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        let translation = translations[lang];
        key.split('.').forEach(part => {
            translation = translation[part]; // Récupère la traduction correspondante
        });
        element.textContent = translation; // Met à jour le contenu de l'élément
    });

    // Met à jour les titres des zones interactives
    document.querySelectorAll('map area').forEach(area => {
        const key = area.getAttribute('alt').toLowerCase().replace(' ', '');
        area.setAttribute('title', translations[lang][key].title);
    });

    // Met à jour les descriptions des illustrations
    for (let i = 0; i < translations[lang].internat2.illustrations.length; i++) {
        const illustration = document.getElementById(`illustration${i + 1}`);
        if (illustration) {
            illustration.querySelector('p').textContent = translations[lang].internat2.illustrations[i].alt;
        }
    }
}

// Affiche une modale
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        $('.carousel').not('.slick-initialized').slick({
            dots: true,
            infinite: true,
            speed: 300,
            slidesToShow: 3,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    }
}

// Ferme une modale
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Ferme la modale si l'utilisateur clique à l'extérieur
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
};
