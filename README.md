# TempMail Frontend

React SPA frontend for the Temp Mail disposable email service.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

The app runs on `http://localhost:3000` and proxies API requests to the backend at `http://localhost:5000`.

## Configuration

Edit `.env` to change the backend URL:

```
VITE_API_URL=http://localhost:5000
```

## Backend API Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /email/get | Get or assign temp email (body: `{ session_id }`) |
| POST | /email/change | Change current email (body: `{ session_id }`) |
| GET | /inbox?email= | Fetch inbox messages |

## Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder.
