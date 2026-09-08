# BloodConnector Admin

Separate Vite + React app for staff. Public site stays in `frontend/`. API is `backend/`.

## Run

```bash
cd admin
npm install
npm run dev
```

Admin: `http://localhost:5174`

Needs the API on `http://127.0.0.1:4000` (same `/api` proxy as the public app).

## Login

Seeded staff account (created when the API first starts):

- Email: `admin@bloodconnector.com`
- Password: `Admin123!`

Tokens are stored as `bloodconnector-admin-token` and are not shared with the public app.

Optional `admin/.env`:

```
VITE_PUBLIC_URL=http://localhost:5173
```
