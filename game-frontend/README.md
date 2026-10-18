# Game Frontend

Angular client for the [Game Backend API](link).

## Screens
Leaderboard (public) · Register / Log in · Submit score · My scores (paged) · My save (JSON editor)

## Tech stack
Angular 21 · TypeScript · RxJS · signals · reactive forms

## Notable parts
- **HTTP interceptor** adds the JWT to API calls only, and logs the user out when the API answers 401.
- **Route guard** redirects anonymous users to the login page (convenience only; the API enforces real authorization).
- **Typed models** mirror the API's DTOs.
- Every page handles loading, empty, error and API-unreachable states.

## Run locally
1. Start the API and check its URL.
2. Set `API_URL` in `src/app/api.config.ts` to that URL.
3. `npm install` then `ng serve`, and open http://localhost:4200.

The API must allow this origin in its CORS policy.

## Trade-offs
The JWT is kept in `localStorage`, which is simple but readable by any script injected into the page. An HttpOnly cookie would be safer but needs backend changes.