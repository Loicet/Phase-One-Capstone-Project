// Favorites page rendering and filtering
import { getFavorites, removeFavoriteByKey, hydrateFavoriteButtons } from './favorites.js';

const gridEl = document.getElementById('favoritesGrid');
const statusEl = document.getElementById('favStatus');
const searchInput = document.getElementById('favSearchInput');

function setStatus(message) {
  if (!statusEl) return;
  if (!message) {
    statusEl.classList.add('hidden');
    statusEl.textContent = '';
  } else {
    statusEl.classList.remove('hidden');
    statusEl.textContent = message;
  }
}

function coverImg(coverUrl, title) {
  if (coverUrl) {
    return `<img src="${coverUrl}" alt="${title}" class="w-full h-full object-cover" loading="lazy"/>`;
  }
  const initial = title?.charAt(0)?.toUpperCase() || 'B';
  return `<div class="w-full h-full flex items-center justify-center text-white text-4xl font-bold bg-gradient-to-br from-gray-700 to-gray-900">${initial}</div>`;
}

function cardHtml(book) {
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
      <button class="mt-2 favorite-btn w-full bg-amber-100 text-amber-700 py-2 rounded-full flex items-center justify-center gap-2 hover:bg-amber-200 transition" data-favorite-btn>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <span>Added to Favorites</span>
      </button>
    </div>
  `;
}

function renderFavorites(list) {
  if (!gridEl) return;
  const books = Array.isArray(list) ? list : [];
  if (books.length === 0) {
    gridEl.innerHTML = '';
    setStatus('No favorites yet. Add some from Home.');
    return;
  }
  setStatus('');
  gridEl.innerHTML = books.map(cardHtml).join('');
  hydrateFavoriteButtons(gridEl);
}

function filterAndRender() {
  const term = searchInput?.value?.toLowerCase().trim();
  const all = getFavorites();
  const filtered = term
    ? all.filter((b) => b.title.toLowerCase().includes(term) || (b.author || '').toLowerCase().includes(term))
    : all;
  renderFavorites(filtered);
}

// Remove and re-render when a card button is clicked to unfavorite
if (gridEl) {
  gridEl.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-favorite-btn]');
    if (!btn) return;
    const card = btn.closest('[data-book-card]');
    const key = card?.dataset?.key;
    if (!key) return;
    // If it was favorite, clicking will remove; reflect grid
    setTimeout(() => {
      filterAndRender();
    }, 0);
  });
}

if (searchInput) {
  searchInput.addEventListener('input', filterAndRender);
}

// initial render
filterAndRender();
