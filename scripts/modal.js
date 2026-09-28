const projectModal = document.querySelector('.project-modal');
const modalImage = projectModal.querySelector('.project-modal-image');
const modalTitle = projectModal.querySelector('#project-modal-title');
const modalDescription = projectModal.querySelector('.project-modal-description');
let modalTrigger = null;
let pointerStartedOutside = false;
const projectOptions = projectModal.querySelector('.project-options');
const localizationOptions = projectModal.querySelector('.localization-options');
const quantityLabel = projectModal.querySelector('#quantity-label');
const selectionSummary = projectModal.querySelector('.project-selection');
const localizationTypes = ['Дубляж', 'Одноголосый закадр', 'Двухголосый закадр', 'Многоголосый закадр', 'Субтитры'];
// Демонстрационные тарифы в рублях за одну выбранную единицу.
const localizationRates = {
    'Дубляж': 15000,
    'Одноголосый закадр': 5000,
    'Двухголосый закадр': 8000,
    'Многоголосый закадр': 11000,
    'Субтитры': 2000
};
const priceFormatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency', currency: 'RUB', maximumFractionDigits: 0
});

function updateProjectSelection() {
    const type = projectOptions.querySelector('[name="project-localization"]:checked').value;
    const quantity = Number(projectOptions.querySelector('[name="project-quantity"]:checked').value);
    const rate = localizationRates[type];
    const description = document.createElement('span');
    description.textContent = `${modalTitle.textContent} - ${type}. ${quantityLabel.textContent}: ${quantity}.`;
    const calculation = document.createElement('span');
    calculation.className = 'project-price-calculation';
    calculation.textContent = `${priceFormatter.format(rate)} * ${quantity}`;
    const total = document.createElement('strong');
    total.className = 'project-price-total';
    total.textContent = `Итого: ${priceFormatter.format(rate * quantity)}`;
    selectionSummary.replaceChildren(description, calculation, total);
}

function resetProjectOptions(card) {
    const category = card.closest('[data-category]').dataset.category;
    quantityLabel.textContent = category === 'advertising' ? 'Кол-во роликов'
        : category === 'games' ? 'Кол-во фрагментов'
        : category === 'films' ? 'Кол-во частей' : 'Кол-во эпизодов';
    const metadata = Array.from(card.querySelectorAll('p'), (p) => p.textContent.split('|')[0].trim());
    const initialType = localizationTypes.find((type) => metadata.includes(type)) || localizationTypes[0];
    localizationOptions.replaceChildren(...localizationTypes.map((type) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'project-localization';
        input.value = type;
        input.checked = type === initialType;
        const text = document.createElement('span');
        text.textContent = type;
        label.append(input, text);
        return label;
    }));
    projectOptions.querySelector('[name="project-quantity"][value="1"]').checked = true;
    updateProjectSelection();
}

projectOptions.addEventListener('change', updateProjectSelection);

function openProjectModal(card) {
    if (projectModal.open) return;
    const image = card.querySelector('img');
    modalImage.hidden = !image;
    if (image) {
        modalImage.src = image.getAttribute('src');
        modalImage.alt = image.alt;
    } else {
        modalImage.removeAttribute('src');
        modalImage.alt = '';
    }
    modalTitle.textContent = card.querySelector('h3').textContent;
    modalDescription.replaceChildren(...Array.from(card.querySelectorAll('p'), (paragraph) => paragraph.cloneNode(true)));
    modalTrigger = card;
    resetProjectOptions(card);
    projectModal.showModal();
    document.documentElement.classList.add('modal-open');
}

document.querySelectorAll('.project-card').forEach((card) => {
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-haspopup', 'dialog');
    card.setAttribute('aria-label', `Подробнее: ${card.querySelector('h3').textContent}`);
    card.addEventListener('click', () => openProjectModal(card));
    card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openProjectModal(card);
        }
    });
});

projectModal.querySelector('.project-modal-close').addEventListener('click', () => projectModal.close());

function isOutsidePanel(event) {
    const bounds = projectModal.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right
        || event.clientY < bounds.top || event.clientY > bounds.bottom;
}

projectModal.addEventListener('pointerdown', (event) => {
    pointerStartedOutside = event.target === projectModal && isOutsidePanel(event);
});
projectModal.addEventListener('click', (event) => {
    if (pointerStartedOutside && event.target === projectModal && isOutsidePanel(event)) projectModal.close();
    pointerStartedOutside = false;
});

// Escape closes the native dialog and triggers the same cleanup.
projectModal.addEventListener('close', () => {
    document.documentElement.classList.remove('modal-open');
    modalTrigger?.focus({ preventScroll: true });
});
