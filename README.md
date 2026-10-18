# Game Backend API

REST API for a game's players, scores and cloud saves, built with ASP.NET Core 8, EF Core and SQL Server, secured with JWT.

**Frontend:** [link to the Angular repo] · **Live demo:** _(added after deployment)_

## Features
- Register and log in (BCrypt-hashed passwords, JWT bearer tokens)
- Submit scores per game mode (the player comes from the token, not the request body)
- Public leaderboard: best score per player, ranked, top-N
- Paged personal score history
- Per-player save data (JSON, create-or-update)

## Tech stack
ASP.NET Core 8 · EF Core 8 · SQL Server · JWT · BCrypt · xUnit

## Endpoints
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /Auth/register | – | Create a player (409 if the username is taken) |
| POST | /Auth/login | – | Returns a JWT |
| POST | /Scores | JWT | Submit a score for the logged-in player |
| GET | /Leaderboard?mode=&top= | – | Best score per player, ranked |
| GET | /Players/me/scores?page=&pageSize= | JWT | Own scores, newest first, paged |
| GET | /Players/me/save | JWT | Own save data (404 if none) |
| PUT | /Players/me/save | JWT | Create or update own save (400 if not valid JSON) |

## Design decisions
- **Identity from the token:** the player id is read from the JWT claim, so a client can't submit scores as someone else.
- **DTOs** separate the API shape from the database entities, so password hashes never leave the server.
- **Leaderboard in SQL:** `GroupBy`/`Max` runs in the database, backed by a composite index on (GameMode, Value).
- **Unique index on Username**, enforced by the database as well as by a check in code.
- **Global exception handler** returns a clean `ProblemDetails` 500 and logs the details.
- **Input limits:** `top` and `pageSize` are clamped, scores are range-validated, game modes come from an allow-list.

## Run locally
Prerequisites: .NET 8 SDK, SQL Server LocalDB (included with Visual Studio).
1. Set the signing key: `dotnet user-secrets set "Jwt:Key" "<at least 32 random characters>"`
2. Create the database: `dotnet ef database update`
3. Run the API and open `/swagger`.

## Tests
`dotnet test`: [N] tests covering auth, scores, leaderboard, save data and request validation.
Controller tests call actions directly with an in-memory EF Core database, so they don't cover the HTTP pipeline (`[Authorize]`, automatic 400s) or real SQL translation. HTTP-level integration tests with `WebApplicationFactory` would be the next step.

## Known limitations
- Tokens last 30 minutes, with no refresh tokens.
- Concurrent first-time saves for one player could race on the primary key.