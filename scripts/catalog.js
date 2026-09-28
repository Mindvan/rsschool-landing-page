const catalog = document.querySelector('.catalog');
const categoryButtons = catalog.querySelectorAll('.category-button');
const projectItems = catalog.querySelectorAll('.project-list > li');
const categoryTitle = catalog.querySelector('#category-title');
const emptyCategory = catalog.querySelector('.catalog-empty');
const showMoreButton = catalog.querySelector('.show-more');
const cardsPerPage = 6;
let selectedCategory = 'all';
let visibleLimit = cardsPerPage;

function renderCards() {
    let matchingCount = 0;
    projectItems.forEach((item) => {
        const matches = selectedCategory === 'all' || item.dataset.category === selectedCategory;
        if (matches) matchingCount += 1;
        item.hidden = !matches || matchingCount > visibleLimit;
    });
    emptyCategory.hidden = matchingCount > 0;
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

showMoreButton.addEventListener('click', () => {
    const firstNewItem = Array.from(projectItems).find((item) =>
        item.hidden && (selectedCategory === 'all' || item.dataset.category === selectedCategory));
    visibleLimit += cardsPerPage;
    renderCards();
    firstNewItem?.querySelector('.project-card').focus({ preventScroll: true });
});

selectCategory(categoryButtons[0]);
