var convaContext;
var translations = {};

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    myInit();
});

function byId(e) { return document.getElementById(e); }

function drawPoly(coOrdStr) {
    const mCoords = coOrdStr.split(',');

    convaContext.beginPath();
    convaContext.moveTo(mCoords[0], mCoords[1]);

    for (let i = 2; i < mCoords.length; i += 2) {
        convaContext.lineTo(mCoords[i], mCoords[i + 1]);
    }

    convaContext.lineTo(mCoords[0], mCoords[1]);
    convaContext.stroke();
}

function drawRect(coOrdStr) {
    const mCoords = coOrdStr.split(',');

    const left = mCoords[0];
    const top = mCoords[1];
    const right = mCoords[2];
    const bot = mCoords[3];

    convaContext.strokeRect(left, top, right - left, bot - top);
}

function myHover(element) {
    const coordStr = element.getAttribute('coords');
    const areaType = element.getAttribute('shape');

    switch (areaType) {
        case 'circle':
            drawCircle(coordStr);
            break;

        case 'polygon':
        case 'poly':
            drawPoly(coordStr);
            break;

        case 'rect':
            drawRect(coordStr);
            break;
    }
}

function myLeave() {
    const canvas = byId('myCanvas');
    convaContext.clearRect(0, 0, canvas.width, canvas.height);
}

function myInit() {
    const img = byId('map');

    const x = img.offsetLeft;
    const y = img.offsetTop;
    const w = img.clientWidth;
    const h = img.clientHeight;

    const imgParent = img.parentNode;
    const canva = byId('myCanvas');
    imgParent.appendChild(canva);

    canva.style.zIndex = 1;

    canva.style.left = x + 'px';
    canva.style.top = y + 'px';

    canva.setAttribute('width', w + 'px');
    canva.setAttribute('height', h + 'px');

    convaContext = canva.getContext('2d');

    convaContext.fillStyle = 'red';
    convaContext.strokeStyle = 'red';
    convaContext.lineWidth = 2;

    fetch('translations.json')
        .then(response => response.json())
        .then(data => {
            translations = data;
            console.log('Translations loaded:', translations);
            changeLanguage('fr');
        })
        .catch(error => console.error('Error loading translations:', error));
}

function changeLanguage(lang) {
    console.log('Changing language to:', lang);
    document.documentElement.lang = lang;
    document.title = translations[lang].title;
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        let translation = translations[lang];
        key.split('.').forEach(part => {
            translation = translation[part];
        });
        element.textContent = translation;
    });

    document.querySelectorAll('map area').forEach(area => {
        const key = area.getAttribute('alt').toLowerCase().replace(' ', '');
        area.setAttribute('title', translations[lang][key].title);
    });

    for (let i = 0; i < translations[lang].internat2.illustrations.length; i++) {
        const illustration = document.getElementById(`illustration${i + 1}`);
        if (illustration) {
            illustration.querySelector('p').textContent = translations[lang].internat2.illustrations[i].alt;
        }
    }
}

// Affiche la modale
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

// Ferme la modale
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Ferme la modale lorsqu'on clique en dehors
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
};
