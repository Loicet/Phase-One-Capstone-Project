// Favorites management with object persistence and graceful back-compat
// Stored shape: [{ key, title, author, coverUrl }]

const STORAGE_KEY = 'favorites';

function readRawFavorites() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (_) {
        return [];
    }
}

function normalizeFavorites(raw) {
    if (!Array.isArray(raw)) return [];
    if (raw.length === 0) return [];
    // Back-compat: if strings, convert to objects
    if (typeof raw[0] === 'string') {
        return raw.map((title) => ({
            key: `title:${title}`,
            title,
            author: 'Unknown Author',
            coverUrl: null,
        }));
    }
    return raw
        .filter((b) => b && typeof b === 'object')
        .map((b) => ({
            key: b.key || `title:${b.title || 'Untitled'}`,
            title: b.title || 'Untitled',
            author: b.author || 'Unknown Author',
            coverUrl: b.coverUrl || null,
        }));
}

export function getFavorites() {
    return normalizeFavorites(readRawFavorites());
}

export function saveFavorites(favorites) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function isFavorite(bookKey) {
    return getFavorites().some((b) => b.key === bookKey);
}

export function addFavorite(book) {
    const favorites = getFavorites();
    if (!book || !book.key) return;
    if (!favorites.some((b) => b.key === book.key)) {
        favorites.push({
            key: book.key,
            title: book.title || 'Untitled',
            author: book.author || 'Unknown Author',
            coverUrl: book.coverUrl || null,
        });
        saveFavorites(favorites);
    }
}

export function removeFavoriteByKey(bookKey) {
    const favorites = getFavorites().filter((b) => b.key !== bookKey);
    saveFavorites(favorites);
}

export function updateFavoriteButtonVisual(buttonEl, isFav) {
    const icon = buttonEl.querySelector('svg');
    const textEl = buttonEl.querySelector('span');
    if (isFav) {
        buttonEl.classList.add('bg-amber-100', 'text-amber-700');
        if (icon) icon.classList.add('text-amber-500');
        if (textEl) textEl.textContent = 'Added to Favorites';
    } else {
        buttonEl.classList.remove('bg-amber-100', 'text-amber-700');
        if (icon) icon.classList.remove('text-amber-500');
        if (textEl) textEl.textContent = 'Add to Favorites';
    }
}

function extractBookFromCard(cardEl) {
    if (!cardEl) return null;
    const { key, title, author, coverUrl } = cardEl.dataset;
    if (!key) return null;
    return {
        key,
        title: title || 'Untitled',
        author: author || 'Unknown Author',
        coverUrl: coverUrl || null,
    };
}

export function hydrateFavoriteButtons(scope = document) {
    const buttons = scope.querySelectorAll('[data-favorite-btn]');
    buttons.forEach((button) => {
        const card = button.closest('[data-book-card]');
        const book = extractBookFromCard(card);
        if (!book) return;
        // initial state
        updateFavoriteButtonVisual(button, isFavorite(book.key));
        // click handler
        button.addEventListener('click', () => {
            const currentlyFav = isFavorite(book.key);
            if (currentlyFav) {
                removeFavoriteByKey(book.key);
                updateFavoriteButtonVisual(button, false);
            } else {
                addFavorite(book);
                updateFavoriteButtonVisual(button, true);
            }
        });
    });
}

// Attach globally for non-module fallbacks
if (typeof window !== 'undefined') {
    window.Favorites = {
        getFavorites,
        saveFavorites,
        isFavorite,
        addFavorite,
        removeFavoriteByKey,
        updateFavoriteButtonVisual,
        hydrateFavoriteButtons,
    };
}
