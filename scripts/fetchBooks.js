// Open Library API client using fetch + async/await
// Docs: https://openlibrary.org/dev/docs/api/search

const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org';

/**
 * Build a search URL for Open Library search API.
 * @param {Object} params
 * @param {string} [params.q] General free text query
 * @param {string} [params.title] Search by title
 * @param {number} [params.limit=20] Results per page (<=100)
 * @param {number} [params.page=1] Page number
 * @returns {string}
 */
function buildSearchUrl({ q, title, limit = 20, page = 1 } = {}) {
  const url = new URL(`${OPEN_LIBRARY_BASE_URL}/search.json`);
  if (q && q.trim()) url.searchParams.set('q', q.trim());
  if (title && title.trim()) url.searchParams.set('title', title.trim());
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('page', String(page));
  return url.toString();
}

/**
 * Normalize Open Library doc to a simplified book object
 */
function mapDocToBook(doc) {
  const coverId = doc.cover_i;
  const author = Array.isArray(doc.author_name) && doc.author_name.length > 0 ? doc.author_name[0] : 'Unknown Author';
  return {
    key: doc.key, // e.g. "/works/OL12345W"
    title: doc.title || 'Untitled',
    author,
    firstPublishYear: doc.first_publish_year || null,
    coverUrl: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null,
  };
}

/**
 * Search books via Open Library
 * @param {Object} opts
 * @param {string} [opts.query] Free text query
 * @param {string} [opts.title] Title query
 * @param {number} [opts.limit]
 * @param {number} [opts.page]
 * @returns {Promise<{books: Array, total: number, page: number}>}
 */
export async function searchBooks({ query, title, limit = 20, page = 1 } = {}) {
  const url = buildSearchUrl({ q: query, title, limit, page });
  const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!response.ok) {
    throw new Error(`Open Library request failed: ${response.status}`);
  }
  const data = await response.json();
  const books = Array.isArray(data.docs) ? data.docs.map(mapDocToBook) : [];
  return { books, total: data.numFound || books.length, page };
}

/**
 * Fetch a default browsing set (popular fantasy as a starter)
 */
export async function fetchInitialBooks() {
  return searchBooks({ query: 'fantasy', limit: 24 });
}

// UMD-style exposure for direct script tag usage
// If modules are not supported, attach to window
if (typeof window !== 'undefined') {
  window.BookApi = {
    searchBooks,
    fetchInitialBooks,
  };
}
