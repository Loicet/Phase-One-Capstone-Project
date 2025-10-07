// Homepage logic: fetch + render + search + loading states
import { fetchInitialBooks, searchBooks } from './fetchBooks.js';
import { hydrateFavoriteButtons } from './favorites.js';

const gridEl = document.getElementById('booksGrid');
const statusEl = document.getElementById('status');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

function setStatus(message, { loading = false } = {}) {
  if (!statusEl) return;
  if (!message) {
    statusEl.classList.add('hidden');
    statusEl.innerHTML = '';
    return;
  }
  statusEl.classList.remove('hidden');
  statusEl.innerHTML = loading
    ? `<div class="flex items-center gap-3 text-gray-600"><svg class="animate-spin h-5 w-5 text-amber-600" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg><span>${message}</span></div>`
    : `<div class="text-gray-600">${message}</div>`;
}

function coverImg(coverUrl, title) {
  if (coverUrl) {
    return `<img src="${coverUrl}" alt="${title}" class="w-full h-full object-cover" loading="lazy"/>`;
  }
  // fallback gradient with initials
  const initial = title?.charAt(0)?.toUpperCase() || 'B';
  return `<div class="w-full h-full flex items-center justify-center text-white text-4xl font-bold bg-gradient-to-br from-gray-700 to-gray-900">${initial}</div>`;
}

function bookCardHtml(book) {
  const subtitle = book.author || 'Unknown Author';
  return `
    <div class="group" data-book-card data-key="${book.key}" data-title="${book.title?.replace(/"/g, '&quot;')}" data-author="${subtitle?.replace(/"/g, '&quot;')}" data-cover-url="${book.coverUrl || ''}">
      <div class="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
        <div class="aspect-[3/4] bg-gray-100">
          ${coverImg(book.coverUrl, book.title)}
        </div>
      </div>
      <h3 class="mt-3 font-semibold text-gray-900 line-clamp-2">${book.title}</h3>
      <p class="text-sm text-gray-600">${subtitle}</p>
      <button class="mt-2 favorite-btn w-full bg-gray-100 text-gray-700 py-2 rounded-full flex items-center justify-center gap-2 hover:bg-amber-100 transition" data-favorite-btn>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <span>Add to Favorites</span>
      </button>
    </div>
  `;
}

function renderBooks(books) {
  if (!gridEl) return;
  if (!Array.isArray(books) || books.length === 0) {
    gridEl.innerHTML = '';
    setStatus('No results found.');
    return;
  }
  setStatus('');
  gridEl.innerHTML = books.map(bookCardHtml).join('');
  hydrateFavoriteButtons(gridEl);
}

async function loadInitial() {
  try {
    setStatus('Loading books…', { loading: true });
    const { books } = await fetchInitialBooks();
    renderBooks(books);
  } catch (err) {
    setStatus('Failed to load books. Please try again.');
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

async function performSearch() {
  const term = searchInput?.value?.trim();
  if (!term) {
    await loadInitial();
    return;
  }
  try {
    setStatus('Searching…', { loading: true });
    const { books } = await searchBooks({ query: term, limit: 24 });
    renderBooks(books);
  } catch (err) {
    setStatus('Search failed. Please try again.');
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

if (searchBtn) {
  searchBtn.addEventListener('click', performSearch);
}
if (searchInput) {
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') performSearch();
  });
}

// kick off
loadInitial();
