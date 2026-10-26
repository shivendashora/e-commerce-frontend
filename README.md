# E-Shop — e-commerce frontend

A React + TypeScript storefront for a FastAPI backend. Users can sign up, log in, browse and search products, open a product page, and list their own products for sale.

Built with **React 19**, **Vite**, **Tailwind CSS v4** and **React Router 7**.

## Features

- **Login and signup**, with the access token stored in a cookie and sent as `Authorization: Bearer <token>` on every API request
- **Protected pages**: logged-out visitors are sent back to the login page
- **Product listing** on the home page with debounced search and "Load more" paging
- **Product page** with the image (click to view full screen), price, quantity, description, specifications and rating
- **List a product** form with image upload and preview
- A shared full-screen loader for login, signup, product listing and product loading

## Getting started

### Prerequisites

- Node.js 20.19 or newer (required by Vite)
- The backend API running at `http://127.0.0.1:8000`

### Install and run

```bash
npm install
npm run dev
```

Open the address Vite prints (usually http://localhost:5173).

### Scripts

| Command           | What it does                                |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Start the development server                |
| `npm run build`   | Type-check and build for production (`dist/`) |
| `npm run preview` | Serve the production build locally          |
| `npm run lint`    | Run ESLint                                  |

## Connecting to the backend

The app calls the API through `/api`. In development, Vite forwards every `/api/*` request to the backend and removes the `/api` prefix (see `vite.config.ts`):

```
/api/auth/login  →  http://127.0.0.1:8000/auth/login
```

This avoids CORS errors, because the backend does not allow requests from other origins. To use a different backend address, change `target` in `vite.config.ts`.

> The proxy only exists in the dev server. For a production deployment, either serve the frontend and the API from the same domain, or enable CORS on the backend and point `BASE_URL` in `src/api/client.ts` at the API.

### Endpoints used

| Method | Endpoint            | Used for                                       |
| ------ | ------------------- | ---------------------------------------------- |
| POST   | `/auth/signup`      | Create an account (then logs in automatically) |
| POST   | `/auth/login`       | Log in; returns the access token               |
| GET    | `/auth/me`          | Current user (`getMe()`)                       |
| GET    | `/fetchAllProducts` | Product list, with `offset`, `limit`, `search` |
| POST   | `/list-product`     | List a new product (multipart form with image) |

## Authentication

- After login, the token is saved in the `access_token` cookie. It expires when the token does.
- `apiFetch()` in `src/api/client.ts` reads the cookie and adds the `Authorization` header. **Use `apiFetch` for every API call** so the token is always sent.
- Logout deletes the cookie and returns to the login page.

The cookie is set from JavaScript, so it is not `HttpOnly`. A fully `HttpOnly` setup would need the backend to set the cookie itself.

## Pages

| Route           | Page                                   | Login required |
| --------------- | -------------------------------------- | -------------- |
| `/`             | Login / Signup                         | No (logged-in users go to `/home`) |
| `/home`         | Product grid with search               | Yes            |
| `/product/:id`  | Product details                        | Yes            |
| `/list-product` | List a new product                     | Yes            |
| `/about`        | About                                  | Yes            |
| `/contacts`     | Contacts                               | Yes            |

## Project structure

```
context/
  loading-context.tsx      LoadingProvider and useLoading() for the shared loader
src/
  api/
    client.ts              apiFetch(): base URL, Bearer token, error messages
    cookies.ts             save / read / remove the token cookie
    auth.ts                login, signup, getMe, logout
    products.ts            product types, fetchProducts, fetchProductById, listProduct, useDebounce
  components/
    Auth/                  login and signup forms, switched by auth.tsx
    home/                  home page and product cards
    products/              product details page
    list-product/          "List a new product" form
    navbar/                sticky top navbar
    layout/
      main-layout.tsx      shows the loader overlay above every page
      protected-layout.tsx login check + navbar for logged-in pages
    about/, contacts/
  App.tsx                  routes
  main.tsx                 app entry, wraps the app in LoadingProvider
```

## Not implemented yet

- **Add to Cart** and **Buy Now** on the product page are UI only. Clicking them shows a "coming soon" note. Connect them in `handleAddToCart` and `handleBuyNow` in `src/components/products/product.tsx`.
- The backend has no endpoint for a single product, so `fetchProductById` searches the product list page by page. A `GET /products/{id}` endpoint would make this one request.
- Products have one image each. The product page gallery already accepts a list, so more images can be added later.
