# BloodConnector

Free public network for patients, blood donors, and volunteer doctors.

- Public site: `frontend/`
- Admin panel: `admin/`
- API: `backend/` (Express + MongoDB)

## Go live (free)

Use **MongoDB Atlas** (database), **Render** (API), and **Vercel** (public site + admin). All have free tiers.

### 1. Database

Atlas is already in use. Keep `MONGODB_URI` from `backend/.env`. In Atlas Network Access, allow `0.0.0.0/0` so Render can connect.

Dummy directory records and non-admin users can be wiped from `backend/`:

```bash
cd backend
npm run clean-dummy
```

The seeded admin account is kept. Public donor/doctor/bank lists start empty until you add real people in admin.

### 2. API on Render

1. Push this repo to GitHub.
2. [Create a Web Service](https://dashboard.render.com/) from the repo.
3. Root directory: `backend`. Build: `npm install`. Start: `npm start`.
4. Set environment variables:

```
NODE_ENV=production
MONGODB_URI=<your Atlas URI>
JWT_SECRET=<long random string>
ADMIN_EMAIL=admin@bloodconnector.com
ADMIN_PASSWORD=<change this>
CORS_ORIGIN=https://YOUR-PUBLIC.vercel.app,https://YOUR-ADMIN.vercel.app
```

Or apply `render.yaml` from the Render dashboard (Blueprint). Copy the service URL, for example `https://bloodconnector-api.onrender.com`.

Render’s free web service sleeps after idle time. The first request after sleep can take about a minute.

### 3. Public site and admin on Vercel

Create **two** Vercel projects from the same GitHub repo.

**Public site**

- Root directory: `frontend`
- Environment variables (set before the first production build):

```
VITE_API_URL=https://YOUR-API.onrender.com/api
VITE_ADMIN_URL=https://YOUR-ADMIN.vercel.app
VITE_SITE_URL=https://YOUR-PUBLIC.vercel.app
```

**Admin**

- Root directory: `admin`
- Environment variables:

```
VITE_API_URL=https://YOUR-API.onrender.com/api
VITE_PUBLIC_URL=https://YOUR-PUBLIC.vercel.app
```

`vercel.json` in each app already rewrites unknown paths to `index.html` so React Router works.

After the public URL exists, update Render `CORS_ORIGIN` and rebuild the frontend if `VITE_SITE_URL` changed.

### 4. Google Search

1. Open [Google Search Console](https://search.google.com/search-console).
2. Add the public Vercel URL as a URL-prefix property.
3. Verify (HTML meta tag or DNS if you later add a custom domain).
4. Submit `https://YOUR-PUBLIC.vercel.app/sitemap.xml`.

The public app includes indexable meta tags, `robots.txt`, and a sitemap when `VITE_SITE_URL` is set at build time. Dashboard, login, and signup are disallowed. The admin app is `noindex`.

Indexing is not instant. Search for `site:YOUR-PUBLIC.vercel.app` after Google crawls.

## Local run

```bash
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
cd admin && npm install && npm run dev
```

- Public: http://localhost:5173
- Admin: http://localhost:5174
- API: http://127.0.0.1:4000
