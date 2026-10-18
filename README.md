# MushTech – Oyster Mushroom Shop

NestJS API + Next.js storefront + MongoDB.

## Run (Docker)
```bash
docker compose up --build -d                  # mongo + api (:4000) + web (:3000)
docker compose --profile seed run --rm --build seed   # load products + admin login (reads ADMIN_EMAIL / ADMIN_PASSWORD from .env)
```
Open http://localhost:3000 · API at http://localhost:4000/products

```bash
docker compose logs -f api      # tail logs
docker compose down             # stop (data kept in the mongo_data volume)
docker compose down -v          # stop and wipe the database
```
Change host ports with `WEB_PORT` / `API_PORT` in a root `.env` file. `API_PORT` is baked into the frontend at build time, so re-run `docker compose up --build` after changing it.

## Local dev without Docker
Run only Mongo: `docker compose up -d mongo` (add `ports: ["27017:27017"]` to the mongo service),
then `npm i && npm run start:dev` in `backend/` and `npm i && npm run dev` in `frontend/`.

## API
| Method | Path | Description |
|---|---|---|
| GET | /products | List products (?variety=pink) |
| GET | /products/:id | Single product |
| POST | /products | Create product |
| PATCH | /products/:id | Update product |
| DELETE | /products/:id | Delete product |
| POST | /orders | Place order (validates and decrements stock) |
| GET | /orders | List orders |
| PATCH | /orders/:id/status | Update order status |

## Auth (JWT)
- `POST /auth/register`, `POST /auth/login` return `{ accessToken, user }`. Send the token as `Authorization: Bearer <token>`.
- Customers must be logged in to place orders and can see their own (`GET /orders/mine`).
- Admin role: manage products (`/products`, `/products/admin/all`) and orders (`GET /orders`, `PATCH /orders/:id/status`).
- Create the admin with the seed script (`ADMIN_EMAIL`, `ADMIN_PASSWORD` in `backend/.env`).

## Environment variables
Secrets live in `backend/.env` locally and in the host dashboards in production. `.env` files are git-ignored; only `.env.example` is committed.

| Where | Variable | Notes |
|---|---|---|
| Render (API) | `MONGO_URI` | Atlas connection string ending in `/mushtech` |
| Render (API) | `JWT_SECRET` | 32+ random characters (`openssl rand -hex 32`) |
| Render (API) | `JWT_EXPIRES_IN` | optional, default `1d` |
| Render (API) | `CORS_ORIGIN` | your Vercel URL, no trailing slash |
| Render (API) | `PORT` | `10000` |
| Vercel (web) | `NEXT_PUBLIC_API_URL` | your Render URL, no trailing slash |

Deploy: Vercel root directory `frontend`; Render runtime Docker, root directory `backend`, health check `/health`.

## Catalogue
Launch products are Oyster and Button mushrooms. Pink, blue, golden and king oyster are marked "coming soon" (visible, not orderable).
Reload the catalogue with `SEED_RESET=true` (compose: `SEED_RESET=true docker compose --profile seed run --rm --build seed`; Atlas: `SEED_RESET=true npm run seed` in `backend`). Users and orders are kept.
Product photos live in `frontend/public/images/`; set a product's photo path in the admin Products page.

## Admin
Log in with the admin account, then open `/admin`: dashboard (KPIs, charts), orders, products, customers.

## First start seeding (no shell needed)
On start-up the API fills in what is missing: the launch products (only if the products collection is empty) and the admin login from `ADMIN_EMAIL` / `ADMIN_PASSWORD` (only if that account does not exist). Existing data and passwords are never changed. Set `AUTO_SEED=false` to turn it off.
This works on Render's free tier and with `docker compose up`, so the manual seed script is only needed to reset data or an admin password.
The shop stores its data in its own collections (`shop_products`, `shop_orders`, `shop_users`), so it can safely share a MongoDB database or cluster with another application without touching that app's data.
