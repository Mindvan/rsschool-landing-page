const menuButton = document.querySelector('.burger');
const menuHeader = document.querySelector('.header');
const menuNav = document.querySelector('#main-nav');
const mobileMenu = window.matchMedia('(max-width: 768px)');
const menuBackground = document.querySelectorAll('main, footer');
let menuOpen = false;

function updateMenuHeight() {
    document.documentElement.style.setProperty('--menu-top', `${menuHeader.getBoundingClientRect().bottom}px`);
}

function setMenuOpen(open, restoreFocus = false) {
    menuOpen = open && mobileMenu.matches;
    updateMenuHeight();
    document.documentElement.classList.toggle('menu-open', menuOpen);
    menuButton.setAttribute('aria-expanded', String(menuOpen));
    menuButton.setAttribute('aria-label', menuOpen ? 'Закрыть меню' : 'Открыть меню');
    menuNav.inert = mobileMenu.matches && !menuOpen;
    menuBackground.forEach((element) => { element.inert = menuOpen; });
    if (restoreFocus) menuButton.focus({ preventScroll: true });
}

menuButton.addEventListener('click', () => setMenuOpen(!menuOpen));
menuNav.addEventListener('click', (event) => {
    if (event.target.closest('a') && menuOpen) setMenuOpen(false, true);
});

document.addEventListener('keydown', (event) => {
    if (!menuOpen) return;
    if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false, true);
    }
    if (event.key === 'Tab') {
        const controls = Array.from(menuHeader.querySelectorAll('a[href], button:not([disabled])'));
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }
});

mobileMenu.addEventListener('change', () => {
    const focusWasOnButton = document.activeElement === menuButton;
    setMenuOpen(false);
    if (!mobileMenu.matches && focusWasOnButton) menuNav.querySelector('a').focus();
});
window.addEventListener('resize', updateMenuHeight);
new ResizeObserver(updateMenuHeight).observe(menuHeader);
setMenuOpen(false);
