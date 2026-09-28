const projectModal = document.querySelector('.project-modal');
const modalImage = projectModal.querySelector('.project-modal-image');
const modalTitle = projectModal.querySelector('#project-modal-title');
const modalDescription = projectModal.querySelector('.project-modal-description');
let modalTrigger = null;
let pointerStartedOutside = false;

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
