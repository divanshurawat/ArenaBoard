# ArenaBoard

Full-stack game leaderboard and cloud-save platform: an ASP.NET Core 8 API with SQL Server, and an Angular client.

**Live demo:** https://arena-board-flax.vercel.app
**API docs (Swagger):** https://gamebackend.runasp.net/swagger

> The API runs on a free hosting plan that stops idle apps after about 30 minutes, so the first request after a quiet period can take a few seconds.

## Features
- Register and log in (BCrypt-hashed passwords, JWT bearer tokens)
- Submit scores per game mode (the player comes from the token, not the request body)
- Public leaderboard: best score per player, ranked, top-N
- Paged personal score history
- Per-player save data (JSON, create-or-update)

## Tech stack
ASP.NET Core 8, C#, EF Core 8, SQL Server, JWT, BCrypt, xUnit, Angular, TypeScript, RxJS

## Architecture
Angular (Vercel) -> HTTPS -> ASP.NET Core API (IIS hosting) -> SQL Server

## Repository layout
- `Player_Leaderboard_and_saves/` - the API and its tests
- `game-frontend/` - the Angular app

## API endpoints
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /Auth/register | - | Create a player (409 if the username is taken) |
| POST | /Auth/login | - | Returns a JWT |
| POST | /Scores | JWT | Submit a score for the logged-in player |
| GET | /Leaderboard?mode=&top= | - | Best score per player, ranked |
| GET | /Players/me/scores?page=&pageSize= | JWT | Own scores, newest first, paged |
| GET | /Players/me/save | JWT | Own save data (404 if none) |
| PUT | /Players/me/save | JWT | Create or update own save (400 if not valid JSON) |

## Design decisions
- **Identity from the token:** the player id is read from the JWT claim, so a client can't submit scores as someone else.
- **DTOs** keep the API shape separate from the database entities, so password hashes never leave the server.
- **Leaderboard in SQL:** `GroupBy`/`Max` runs in the database, backed by a composite index on (GameMode, Value).
- **Unique index on Username**, enforced by the database as well as by a check in code.
- **Global exception handler** returns a clean `ProblemDetails` 500 and logs the details.
- **Input limits:** `top` and `pageSize` are clamped, scores are range-validated, game modes come from an allow-list.

## Run locally
Prerequisites: .NET 8 SDK, SQL Server LocalDB, Node.js.
1. API: set the signing key with `dotnet user-secrets set "Jwt:Key" "<32+ random characters>"`, create the database with `dotnet ef database update`, then run the project.
2. Frontend: in `game-frontend`, run `npm install` and `ng serve`, then open http://localhost:4200.

## Tests
`dotnet test` runs [N] tests covering auth, scores, leaderboard, save data and request validation. They call controllers directly with an in-memory EF Core database, so they don't cover the HTTP pipeline (`[Authorize]`, automatic 400s) or real SQL translation. HTTP-level tests with `WebApplicationFactory` would be the next step.

## Known limitations
- Tokens last 30 minutes, with no refresh tokens.
- The JWT is stored in `localStorage`, which is simple but readable by injected scripts. An HttpOnly cookie would be safer.
- Concurrent first-time saves for one player could race on the primary key.
