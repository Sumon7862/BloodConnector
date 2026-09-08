# BloodConnector API

Express + MongoDB (Mongoose) + JWT.

## Tomar kaj (MongoDB)

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) e free cluster banao **or** local MongoDB Community install koro.
2. Atlas hole: Database Access e user banao, Network Access e `0.0.0.0/0` add koro.
3. Connect string copy koro, password boshao, database name `bloodconnector` rakho.
4. `backend/.env` e `MONGODB_URI` set koro.

Atlas example:

```
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/bloodconnector?retryWrites=true&w=majority
```

Local example:

```
MONGODB_URI=mongodb://127.0.0.1:27017/bloodconnector
```

## Run

```bash
cd backend
npm install
npm run dev
```

API: `http://127.0.0.1:4000`

Vite frontend proxies `/api` here. Admin app (`admin/`) also proxies `/api` here on port **5174**.

Public app: `http://localhost:5173`
Admin app: `http://localhost:5174`

Optional production env:

```
JWT_SECRET=a-long-random-secret
CORS_ORIGIN=https://your-frontend.example,https://your-admin.example
```

## Remove dummy data

Deletes directory donors/doctors/banks, requests, opinions, and every user except admins:

```bash
npm run clean-dummy
```

## Seed admin

First start e automatically create hoy:

- Email: `admin@bloodconnector.com`
- Password: `Admin123!`

Roles: `donor | doctor | admin`. Status: `pending | active | blocked`.
