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
let selectedProject = null;

function updateProjectSelection() {
    const typeId = projectOptions.querySelector('[name="project-localization"]:checked').value;
    const quantity = Number(projectOptions.querySelector('[name="project-quantity"]:checked').value);
    const type = selectedProject.parameters.localization.find((option) => option.id === typeId);
    const formatter = new Intl.NumberFormat('ru-RU', {
        style: 'currency', currency: selectedProject.currency, maximumFractionDigits: 0
    });
    const description = document.createElement('span');
    description.textContent = `${selectedProject.title} - ${type.label}. ${selectedProject.parameters.quantity.label}: ${quantity}.`;
    const calculation = document.createElement('span');
    calculation.className = 'project-price-calculation';
    calculation.textContent = `${formatter.format(type.price)} * ${quantity}`;
    const total = document.createElement('strong');
    total.className = 'project-price-total';
    total.textContent = `Итого: ${formatter.format(type.price * quantity)}`;
    selectionSummary.replaceChildren(description, calculation, total);
}

function createOption(name, value, caption, checked) {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = name;
    input.value = value;
    input.checked = checked;
    const text = document.createElement('span');
    text.textContent = caption;
    label.append(input, text);
    return label;
}

function resetProjectOptions(project) {
    const parameters = project.parameters;
    quantityLabel.textContent = parameters.quantity.label;
    localizationOptions.replaceChildren(...parameters.localization.map((option) =>
        createOption('project-localization', option.id, option.label, option.id === parameters.defaultLocalization)));
    projectOptions.querySelector('.quantity-options').replaceChildren(...parameters.quantity.values.map((value) =>
        createOption('project-quantity', value, value, value === parameters.quantity.default)));
    updateProjectSelection();
}

projectOptions.addEventListener('change', updateProjectSelection);

function openProjectModal(project, card) {
    if (projectModal.open) return;
    selectedProject = project;
    modalImage.src = project.image;
    modalImage.alt = project.title;
    modalTitle.textContent = project.title;
    modalDescription.replaceChildren(...[project.description, ...project.details].filter(Boolean).map((text) => {
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        return paragraph;
    }));
    modalTrigger = card;
    resetProjectOptions(project);
    projectModal.showModal();
    projectModal.scrollTop = 0;
    document.documentElement.classList.add('modal-open');
}
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

projectModal.addEventListener('close', () => {
    document.documentElement.classList.remove('modal-open');
    modalTrigger?.focus({ preventScroll: true });
});
