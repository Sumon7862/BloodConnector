# BloodConnector mobile app

React Native (Expo + TypeScript) client for the existing BloodConnector backend. It reuses the same REST APIs and JWT auth as the website. It does not replace `frontend/`, `backend/`, or `admin/`.

## Setup

```bash
cd mobile-app
npm install
cp .env.example .env
```

Set `EXPO_PUBLIC_API_URL` in `.env`:

| Environment | Value |
|---|---|
| Production API | `https://bloodconnector-4a5q.onrender.com/api` |
| Android emulator + local API | `http://10.0.2.2:4000/api` |
| Physical phone + local API | `http://YOUR_LAN_IP:4000/api` |

Only this public API base URL is required. Do not put MongoDB credentials, JWT secrets, or admin keys in the app.

## Run

```bash
cd mobile-app
npm start
```

Then press `a` for Android (emulator or a device with Expo Go).

```bash
npm run android
npm run typecheck
```

The default fallback API URL is production, so Expo Go works without a local backend. Render's free tier may sleep; the first request can take a minute.

## Android build

Install EAS CLI, then:

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview     # APK
eas build -p android --profile production  # AAB for Play Store
```

App name: **BloodConnector**  
Android application ID: **com.bloodconnector.app**

## Auth

JWT is stored in Expo SecureStore under `bloodconnector-token`, the same token name the website uses in localStorage. Admin accounts are rejected in this app — use the admin panel instead.
