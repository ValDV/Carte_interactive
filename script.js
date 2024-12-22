// stores the device context of the canvas we use to draw the outlines
var convaContext;
var translations = {};

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
    // get the target image
    const img = byId('map');

    // get it's position and width+height
    const x = img.offsetLeft;
    const y = img.offsetTop;
    const w = img.clientWidth;
    const h = img.clientHeight;

    // move the canvas, so it's contained by the same parent as the image
    const imgParent = img.parentNode;
    const canva = byId('myCanvas');
    imgParent.appendChild(canva);

    // place the canvas in front of the image
    canva.style.zIndex = 1;

    // position it over the image
    canva.style.left = x + 'px';
    canva.style.top = y + 'px';

    // make same size as the image
    canva.setAttribute('width', w + 'px');
    canva.setAttribute('height', h + 'px');

    // get it's context
    convaContext = canva.getContext('2d');

    // set the 'default' values for the colour/width of fill/stroke operations
    convaContext.fillStyle = 'red';
    convaContext.strokeStyle = 'red';
    convaContext.lineWidth = 2;

    // Load translations
    fetch('translations.json')
        .then(response => response.json())
        .then(data => {
            translations = data;
            changeLanguage('fr');
        });
}

function changeLanguage(lang) {
    document.documentElement.lang = lang;
    document.title = translations[lang].title;
    document.querySelectorAll('[data-translate]').forEach(element => {
        element.textContent = translations[lang][element.getAttribute('data-translate')];
    });
}

// Affiche la modale
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
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
