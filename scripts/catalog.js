const catalog = document.querySelector('.catalog');
const categoryButtons = catalog.querySelectorAll('.category-button');
const projectList = catalog.querySelector('.project-list');
let projectItems = [];
let catalogLoaded = false;
const categoryTitle = catalog.querySelector('#category-title');
const emptyCategory = catalog.querySelector('.catalog-empty');
const showMoreButton = catalog.querySelector('.show-more');
const serviceFilter = catalog.querySelector('.service-filter');
serviceFilter.value = 'all';
const cardsPerPage = 6;
let selectedCategory = 'all';
let visibleLimit = cardsPerPage;

function matchesFilters(item) {
    return (selectedCategory === 'all' || item.dataset.category === selectedCategory)
        && (serviceFilter.value === 'all' || item.dataset.service === serviceFilter.value);
}

function renderCards() {
    if (!catalogLoaded) return;
    let matchingCount = 0;
    projectItems.forEach((item) => {
        const matches = matchesFilters(item);
        if (matches) matchingCount += 1;
        item.hidden = !matches || matchingCount > visibleLimit;
    });
    emptyCategory.hidden = matchingCount > 0;
    emptyCategory.textContent = 'По выбранной категории и услуге проектов не найдено.';
    showMoreButton.hidden = matchingCount <= visibleLimit;
}

function selectCategory(selectedButton) {
    selectedCategory = selectedButton.dataset.category;
    visibleLimit = cardsPerPage;

    categoryButtons.forEach((button) => {
        const active = button === selectedButton;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
    });

    categoryTitle.textContent = selectedButton.textContent;
    renderCards();
}

categoryButtons.forEach((button) => {
    button.addEventListener('click', () => selectCategory(button));
});

serviceFilter.addEventListener('change', () => {
    visibleLimit = cardsPerPage;
    renderCards();
});

showMoreButton.addEventListener('click', () => {
    const firstNewItem = Array.from(projectItems).find((item) =>
        item.hidden && matchesFilters(item));
    visibleLimit += cardsPerPage;
    renderCards();
    firstNewItem?.querySelector('.project-card').focus({ preventScroll: true });
});

selectCategory(categoryButtons[0]);

async function loadCatalog() {
    emptyCategory.hidden = false;
    emptyCategory.textContent = 'Загрузка проектов…';
    try {
        const response = await fetch('data/projects.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const projects = await response.json();
        if (!Array.isArray(projects)) throw new Error('Expected a project array');
        const fragment = document.createDocumentFragment();
        projects.forEach((project) => {
            const item = document.createElement('li');
            item.dataset.category = project.category;
            item.dataset.service = project.parameters.defaultLocalization;
            const card = document.createElement('article');
            card.className = 'project-card';
            card.tabIndex = 0;
            card.setAttribute('role', 'button');
            card.setAttribute('aria-haspopup', 'dialog');
            card.setAttribute('aria-label', `Подробнее: ${project.title}`);
            const image = document.createElement('img');
            image.src = project.image;
            image.alt = project.title;
            image.loading = 'lazy';
            const title = document.createElement('h3');
            title.textContent = project.title;
            card.append(image, title);
            [project.description, ...project.details].filter(Boolean).forEach((text) => {
                const paragraph = document.createElement('p');
                paragraph.textContent = text;
                card.append(paragraph);
            });
            card.addEventListener('click', () => openProjectModal(project, card));
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openProjectModal(project, card);
                }
            });
            item.append(card);
            fragment.append(item);
        });
        projectList.replaceChildren(fragment);
        projectItems = projectList.querySelectorAll(':scope > li');
        catalogLoaded = true;
        emptyCategory.textContent = 'В этой категории пока нет проектов';
        renderCards();
    } catch (error) {
        emptyCategory.textContent = 'Не удалось загрузить проекты. Обновите страницу';
        emptyCategory.hidden = false;
        showMoreButton.hidden = true;
        console.error('Catalog loading failed:', error);
    } finally {
        projectList.setAttribute('aria-busy', 'false');
    }
}

loadCatalog();
