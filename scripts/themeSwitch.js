const themeRoot = document.documentElement;
const themeStorageKey = 'studio-theme';

function savedTheme() {
    try {
        return localStorage.getItem(themeStorageKey) === 'dark' ? 'dark' : 'light';
    } catch {
        return 'light';
    }
}

function applyTheme(theme) {
    themeRoot.dataset.theme = theme;
    document.querySelectorAll('.theme-toggle').forEach((button) => {
        const dark = theme === 'dark';
        button.setAttribute('aria-pressed', String(dark));
        button.title = dark ? 'Вкл. светлую тему' : 'Вкл. тёмную тему';
    });
}

applyTheme(savedTheme());

document.addEventListener('DOMContentLoaded', () => {
    applyTheme(themeRoot.dataset.theme);
    document.querySelectorAll('.theme-toggle').forEach((button) => {
        button.addEventListener('click', () => {
            const theme = themeRoot.dataset.theme === 'dark' ? 'light' : 'dark';
            applyTheme(theme);
            try {
                localStorage.setItem(themeStorageKey, theme);
            } catch {
            }
        });
    });
});

window.addEventListener('storage', (event) => {
    if (event.key === themeStorageKey || event.key === null) applyTheme(savedTheme());
});
window.addEventListener('pageshow', () => applyTheme(savedTheme()));
