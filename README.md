# RoomMateHub (MERN rebuild)

A roommate-matching app for students: sign up, fill in your personal info,
room preferences and your own habits, then browse other students and see a
compatibility score against each one.

This is a rebuild of the original Flask + MySQL app on the **MERN** stack
(MongoDB, Express, React, Node), fixing the issues that were blocking the
original from deploying on Render:

- The uploaded project's `requirements.txt` and `runtime.txt` still had
  **unresolved git merge-conflict markers** (`<<<<<<< HEAD` / `=======` /
  `>>>>>>>`) inside them — `pip install -r requirements.txt` would fail
  immediately on Render for this reason alone.
- It depended on **MySQL** via `mysql-connector-python`, but Render has no
  built-in MySQL database — you'd need to stand up (and pay for) a separate
  MySQL host, then wire up matching env vars by hand.
- Passwords were stored **in plain text** and compared with `==`.
- There was no `Procfile`/start command wired to `gunicorn`, no
  `render.yaml`, and no clear single build step, so Render didn't know how to
  build or start it.
- Profile-picture uploads used the local disk directly with no size/type
  guardrails beyond a basic extension check.

This rebuild:

- Uses **MongoDB** (via Mongoose) — a free MongoDB Atlas cluster is the
  natural fit for Render and needs no server setup.
- Hashes passwords with **bcrypt** and authenticates with **JWTs**.
- Ships as **one deployable service**: Express serves both the JSON API
  (`/api/...`) and the built React app, so Render only needs one web service,
  one build command, one start command.
- Includes a ready-to-use `render.yaml` blueprint.
- Adds a **match-scoring endpoint** (the original had `recommendation.html`
  as a placeholder page with no logic behind it) — see `server/utils/compatibility.js`.

## Stack

- **Backend:** Node.js, Express, Mongoose, JWT auth, Multer for file uploads
- **Frontend:** React (Vite), React Router, Axios
- **Database:** MongoDB (MongoDB Atlas free tier recommended)
- **Deploy target:** Render, single web service

## Project structure

```
roommatehub-mern/
├── render.yaml              # Render blueprint (optional one-click deploy)
├── package.json             # convenience scripts for local dev
├── server/                  # Express API
│   ├── index.js             # entry point — API + serves client/dist
│   ├── config/db.js
│   ├── models/User.js
│   ├── controllers/
│   ├── routes/
│   ├── middleware/          # auth (JWT) + upload (multer)
│   ├── utils/                # token + compatibility scoring
│   └── seed.js               # optional demo data
└── client/                  # React app (Vite)
    └── src/
        ├── pages/            # Signup, Login, onboarding steps, Dashboard, Matches, MyProfile
        ├── components/
        ├── context/AuthContext.jsx
        └── api/axios.js
```

## Running it locally

You'll need Node 18+ and a MongoDB connection string (a free
[MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster works
fine — create a cluster, add a database user, allow access from anywhere
`0.0.0.0/0` for testing, and copy the connection string).

```bash
# 1. Install dependencies for both server and client
npm run install:all

# 2. Configure the server
cd server
cp .env.example .env
# edit .env: paste your MONGODB_URI, and set a JWT_SECRET (any long random string)
cd ..

# 3. Run both server (port 5000) and client (port 5173) together
npm run dev
```

Open **http://localhost:5173** — the Vite dev server proxies `/api` and
`/uploads` requests to the Express server automatically (see
`client/vite.config.js`), so there's no CORS setup needed in dev.

Optional — seed two demo profiles so `/matches` has something to show:

```bash
npm run seed
```

## Deploying to Render

**1. Push this project to a GitHub repo** (root of the repo should be this
`roommatehub-mern` folder).

**2. Create a MongoDB Atlas cluster** (free tier is enough): create a
database user and password, allow network access from anywhere, and copy the
connection string — it looks like
`mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/roommatehub`.

**3. On Render:**

- **Option A — Blueprint (easiest):** New → Blueprint → point it at your
  repo. Render reads `render.yaml` and creates the web service for you. It
  will prompt you to fill in `MONGODB_URI`; `JWT_SECRET` is generated
  automatically.
- **Option B — Manual web service:** New → Web Service → connect your repo,
  then set:
  - **Build Command:** `cd client && npm install && npm run build && cd ../server && npm install`
  - **Start Command:** `node server/index.js`
  - **Environment variables:** `MONGODB_URI` (your Atlas string), `JWT_SECRET`
    (any long random string)

**4. Deploy.** Render builds the React app, installs server dependencies, and
starts Express, which serves the built frontend and the API from the same
URL — no separate frontend deploy, no CORS configuration needed.

## Known limitation worth knowing about

Profile pictures are currently saved to the server's local disk
(`server/uploads`). **Render's filesystem is ephemeral** — it's wiped on every
deploy and on some restarts. Uploads will work fine for a demo/prototype, but
for anything longer-lived, swap `middleware/upload.js` to upload to a proper
object store instead (see extensions below).

## What to extend first

1. **Persistent image storage** — swap the local `multer.diskStorage` for
   direct uploads to Cloudinary or an S3-compatible bucket (Render disks
   don't persist). This is the highest-priority fix if you want profile
   pictures to survive a redeploy.
2. **Email verification / password reset** — signup currently only checks
   for a unique email; there's no verification step.
3. **Pagination on `/api/users` and `/api/matches`** — fine for a class-sized
   dataset now, but both currently load every onboarded user into memory.
4. **Messaging between matched users** — right now users can see each
   other's profile and score but have no way to contact each other in-app
   (the original app didn't have this either, but it's the natural next
   feature for a roommate-matching tool).
5. **Better compatibility scoring** — `server/utils/compatibility.js` is a
   simple weighted-overlap scorer. Worth extending with configurable weights
   per user, or a "dealbreaker" concept (e.g. hard-exclude on gender
   preference rather than just weighting it).
