import { fetchInitialBooks, searchBooks } from './fetchBooks.js';
import { hydrateFavoriteButtons } from '../Lab2/favorites.js';

function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'group cursor-pointer';
    card.setAttribute('data-book-card', '');
    card.dataset.key = book.key;
    card.dataset.title = book.title;
    card.dataset.author = book.author || 'Unknown Author';
    if (book.coverUrl) card.dataset.coverUrl = book.coverUrl;

    card.innerHTML = `
        <div class="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
            <div class="aspect-[3/4] bg-gray-100 flex items-center justify-center">
                ${book.coverUrl ? `<img src="${book.coverUrl}" alt="${book.title}" class="w-full h-full object-cover">` : `
                <div class="text-gray-400 text-sm">No Cover</div>`}
            </div>
        </div>
        <h3 class="mt-3 font-semibold text-gray-900">${book.title}</h3>
        <p class="text-sm text-gray-600">${book.author || 'Unknown Author'}</p>
        <button data-favorite-btn class="w-full bg-gray-100 text-gray-700 py-2 rounded-full flex items-center justify-center gap-2 hover:bg-amber-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>Add to Favorites</span>
        </button>
    `;
    return card;
}

function renderBooks(container, books) {
    container.innerHTML = '';
    const fragment = document.createDocumentFragment();
    books.forEach((b) => fragment.appendChild(createBookCard(b)));
    container.appendChild(fragment);
    hydrateFavoriteButtons(container);
}

async function loadInitial(container, statusEl) {
    try {
        statusEl.textContent = 'Loading...';
        const { books } = await fetchInitialBooks();
        statusEl.textContent = '';
        if (!books || books.length === 0) {
            statusEl.textContent = 'No results found.';
            return;
        }
        renderBooks(container, books);
    } catch (e) {
        statusEl.textContent = 'Failed to load books.';
    }
}

async function handleSearch(container, statusEl, query) {
    try {
        statusEl.textContent = 'Searching...';
        const { books } = await searchBooks({ query, limit: 24 });
        statusEl.textContent = '';
        if (!books || books.length === 0) {
            statusEl.textContent = 'No results found.';
            container.innerHTML = '';
            return;
        }
        renderBooks(container, books);
    } catch (e) {
        statusEl.textContent = 'Search failed.';
    }
}

function wireSearch(inputEl, buttonEl, container, statusEl) {
    const doSearch = () => {
        const q = (inputEl.value || '').trim();
        if (!q) return;
        handleSearch(container, statusEl, q);
    };
    buttonEl.addEventListener('click', doSearch);
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doSearch();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('booksGrid');
    const statusEl = document.getElementById('booksStatus');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    if (!grid || !statusEl) return;
    if (searchInput && searchBtn) wireSearch(searchInput, searchBtn, grid, statusEl);
    loadInitial(grid, statusEl);
});


