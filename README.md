# Book Explorer – Phase One Capstone

A responsive, interactive, API-powered web app built through a sequence of labs. You’ll browse books from the Open Library API, search by title, and manage a favorites list persisted in your browser.

## Features
- Responsive multi-page layout built with Tailwind CSS
- Browse popular books (via Open Library Search API)
- Search for books by keywords/title
- Add/remove favorites with dynamic UI updates
- Favorites persisted in `localStorage`
- Pages: `Home`, `Favorites`, `About`

## Tech Stack
- HTML5 + CSS + Tailwind (via CDN)
- Vanilla JavaScript (ES Modules)
- Open Library Search API (`https://openlibrary.org/search.json`)
- `localStorage` for persistence

## Project Structure
```
Lab1/
  index.html         # Homepage (search + grid populated via JS)
  about.html         # About page
  Bookhub logo1.png  # Logo asset
  Logo12.png         # Favicon

Lab2/
  favorites.html     # Favorites page
  favorites.js       # Favorites module (add/remove, hydrate buttons)
  favoritesPage.js   # Renders favorites list and removal UI

Lab3/
  fetchBooks.js      # API client (search + initial fetch)
  home.js            # Homepage controller: search, render grid, hydrate favorites
```

## How to Run Locally
No build step is required. Open the HTML files directly in your browser:
- `Lab1/index.html` – Main browsing and search page
- `Lab2/favorites.html` – Your favorites list
- `Lab1/about.html` – Project info

Tip: For best results with ES modules, open via a lightweight local server (optional):
```bash
# Python 3
python -m http.server 5500
# Then visit http://localhost:5500/Lab1/index.html
```

## Labs and Learning Outcomes

### Lab 1: Responsive Multi-Page Layouts (Tailwind)
- Navbar, hero, and footer
- Responsive grid scaffolding (cards)
- Mobile-first layout via Tailwind utilities

Pages involved: `Lab1/index.html`, `Lab1/about.html`

### Lab 2: DOM Interactivity & ES Modules
- `favorites.js` exports helpers to add/remove and read favorites
- Click handlers to update UI dynamically
- `localStorage` persistence

Pages involved: `Lab2/favorites.html`, `Lab2/favoritesPage.js`, `Lab2/favorites.js`

### Lab 3: Async JavaScript & API Integration
- `fetchBooks.js` uses `fetch` + `async/await` to call the Open Library API
- Homepage grid populated from live API data
- Search functionality with loading/empty states

Pages involved: `Lab3/fetchBooks.js`, `Lab3/home.js`, and `Lab1/index.html`

## Key Modules
- `Lab3/fetchBooks.js`
  - `searchBooks({ query, title, limit, page })`
  - `fetchInitialBooks()`

- `Lab2/favorites.js`
  - `getFavorites()`, `addFavorite(book)`, `removeFavoriteByKey(key)`
  - `hydrateFavoriteButtons(scope)` to wire buttons inside rendered cards

- `Lab3/home.js`
  - Wires search input/button, renders books into `#booksGrid`, shows status in `#booksStatus`

- `Lab2/favoritesPage.js`
  - Renders saved favorites into `#favoritesGrid`, shows status in `#favoritesStatus`

## Branching and Pushing to GitHub
The project simulates collaboration by pushing each lab to its own branch. From the project root in PowerShell:

### Lab 1 → branch `Lab-1`
```bash
git checkout Lab-1
git add Lab1/about.html
git commit -m "Lab 1: About page structure fixed; Tailwind and nav consistent"
git push -u origin Lab-1
```

### Lab 2 → branch `Lab-2`
```bash
git checkout main
git pull
git checkout -b Lab-2
git add Lab2/favorites.html Lab2/favorites.js Lab2/favoritesPage.js
git commit -m "Lab 2: Favorites module + page; DOM events + localStorage"
git push -u origin Lab-2
```

### Lab 3 → branch `Lab-3`
```bash
git checkout main
git pull
git checkout -b Lab-3
git add Lab3/fetchBooks.js Lab3/home.js Lab1/index.html
git commit -m "Lab 3: Open Library API integration + dynamic homepage search/grid"
git push -u origin Lab-3
```

If your default branch isn’t `main`, replace it accordingly.

## Usage Notes
- On Home, use the search bar to look up books. Cards include an “Add to Favorites” button.
- On Favorites, you can remove items; the list persists via `localStorage`.
- If an API search returns no results, you’ll see a “No results found.” message.

## Troubleshooting
- If modules don’t load when double-clicking HTML files, try serving via a local server and load the page at `http://localhost:PORT/...`.
- If images don’t appear, ensure `Bookhub logo1.png` and `Logo12.png` are present in `Lab1/`.

## License
MIT (or your preferred license). Update this section if needed.
