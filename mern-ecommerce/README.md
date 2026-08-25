# MERN Seller-Customer E-commerce App

Full-stack e-commerce app with two roles: **Seller** and **Customer**. Built with React (Vite) + Tailwind CSS on the frontend, and Node/Express + MongoDB + JWT on the backend.

## Project Structure
```
backend/    Express REST API, MongoDB models, JWT auth, Multer uploads
frontend/   React (Vite) app, Tailwind CSS, Axios, React Router
```

## 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # then edit MONGO_URI / JWT_SECRET if needed
npm run dev             # or: npm start
```

Runs on `http://localhost:5000`. Requires a running MongoDB instance (local or Atlas) at the URI set in `.env`.

## 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL should point to backend /api
npm run dev
```

Runs on `http://localhost:5173`.

## Usage

1. Register as a **Seller** or **Customer** from the Sign Up page.
2. **Sellers**: go to "Products" to add/edit/delete products (with image upload), and "Orders" to accept/reject/update incoming orders. Accepting an order reduces stock.
3. **Customers**: browse/search products on the home page, view details, add to cart or buy now, adjust quantity (capped at stock), checkout with delivery details, and track order status under "My Orders".

## Notes
- JWT is stored in `localStorage`; login persists across refresh.
- Roles are enforced both by frontend route guards and backend middleware.
- Uploaded product images are served statically from `backend/uploads`.
