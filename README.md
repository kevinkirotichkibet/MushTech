# MushTech – Oyster Mushroom Shop

NestJS API + Next.js storefront + MongoDB.

## Run (Docker)
```bash
docker compose up --build -d                  # mongo + api (:4000) + web (:3000)
docker compose --profile seed run --rm seed   # load sample products (first time)
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

## Deploy
Frontend on Vercel (root directory `frontend`, env `NEXT_PUBLIC_API_URL`), API on Render (Docker, root directory `backend`, env `MONGO_URI`, `CORS_ORIGIN`, `ADMIN_API_KEY`), database on MongoDB Atlas.
Admin routes (create/edit/delete products, list orders) need the header `x-admin-key: <ADMIN_API_KEY>`.
