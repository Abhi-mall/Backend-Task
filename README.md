# Backend Technical Assignment (Node.js / Express / MongoDB)

Features:
- JWT-based authentication (access + refresh tokens).
- Refresh token stored as an HttpOnly cookie (using cookie-parser).
- Role-based authorization and region-based access controls in middleware.
- Locations (create/list/get/nearby).
- Inspections (submit and list).


## Setup
1. Copy files into a directory.
2. `npm install`
3. Create `.env` from `.env.example` and set secrets and `MONGO_URI`.
4. `npm start`.

## API endpoints
- `POST /auth/login` — login with `{ email, password }`. Returns `accessToken` and sets `refreshToken` cookie.
- `GET /auth/me` — returns current user (requires Authorization: Bearer <accessToken>).
- `POST /locations` — create location (STATE_MANAGER only).
- `GET /locations` — list locations according to user scope.
- `GET /locations/:id` — get single location (checks access).
- `GET /locations/nearby?lat=&lng=&radiusKm=` — proximity search (user scope applies).
- `POST /inspections` — create inspection (inspectors only; location must be in their region).
- `GET /inspections?locationId=...` — list inspections in scope.

## Notes & Assumptions
- Using MongoDB + Mongoose for simplicity and flexible schemas.
- Authentication middleware expects `Authorization: Bearer <accessToken>`.
- Refresh token stored server-side on user document for token rotation and invalidation.
- Authorization decisions are implemented as middleware (see `src/middleware`).


