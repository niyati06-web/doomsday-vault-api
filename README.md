# 🌌💀 The Doomsday Vault API

A backend REST API built for **Project 2: Backend API Development** —
DecodeLabs Full Stack Development Training Kit.

## What it does

Three fun features, all built on core REST API concepts:

- **Time-locked vault** — lock a message for your future self. It stays
  sealed until the unlock date arrives.
- **Anonymous confessions** — post a secret, get a random one back.
- **Apocalypse generator** — get a random (fictional) doomsday scenario.

## Tech stack

- Node.js
- Express.js
- REST API principles (proper HTTP methods + status codes)

## How to run it

1. Clone this repo:
   ```
   git clone https://github.com/niyati06-web/doomsday-vault-api.git
   cd doomsday-vault-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   node server.js
   ```

4. Open in browser: `http://localhost:3000`

## Endpoints

| Method | Endpoint         | Description                              |
|--------|------------------|-------------------------------------------|
| GET    | `/`              | Welcome message + list of endpoints       |
| GET    | `/doomsday`      | Returns a random apocalypse scenario      |
| POST   | `/vault`         | Locks a message until a future date       |
| GET    | `/vault/:id`     | Tries to open a vault (locked or unlocked)|
| POST   | `/confessions`   | Posts an anonymous confession             |
| GET    | `/confessions`   | Returns a random confession               |

### Example: locking a vault message

**Request**
```
POST /vault
Content-Type: application/json

{
  "message": "Hi future me, did you finish the project?",
  "unlockDate": "2027-01-01"
}
```

**Response**
```json
{
  "success": true,
  "message": "Your message has been sealed in the vault 🔒",
  "data": { "id": 1, "unlockDate": "2027-01-01" }
}
```

Trying to open it before the unlock date returns a `403 Forbidden`
with a "still sealed" message. Trying to open a vault that doesn't
exist returns `404 Not Found`.

## Key concepts demonstrated

- RESTful naming (`/vault`, not `/getVault`)
- GET vs POST semantics (safe reads vs data-creating writes)
- Data validation ("never trust the client")
- Correct HTTP status codes: `200`, `201`, `400`, `403`, `404`
- JSON as the data-exchange format

## Author

Built by [niyati06-web](https://github.com/niyati06-web) as part of the
DecodeLabs Full Stack Development Industrial Training Kit, Batch 2026.
