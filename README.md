# Burgero Restaurant

Burgero is a full-stack restaurant ordering and admin management project split into three apps:

- `burgero/` - customer-facing React frontend
- `admin-frontend/` - React admin dashboard
- `burgero-backend/` - Node.js API backend

## Repository Structure

```text
.
├── admin-frontend/    # Admin dashboard
├── burgero/           # Customer website
├── burgero-backend/   # Backend API
├── LICENSE
├── README.md
└── REMEDIATION_SUMMARY.md
```

## Prerequisites

- Node.js 18+ for the backend
- Node.js 24.x and npm 10.x are declared in both frontend apps

## Environment Setup

Copy each example file before running locally:

- `burgero/.env.example`
- `admin-frontend/.env.example`
- `burgero-backend/.env.example`

The frontend apps expect `REACT_APP_API_URL` to point to the backend API, for example:

```bash
REACT_APP_API_URL=http://localhost:5000/api
```

## Local Development

### 1. Backend

```bash
cd burgero-backend
npm install
npm start
```

### 2. Customer Frontend

```bash
cd burgero
npm install
npm start
```

### 3. Admin Frontend

```bash
cd admin-frontend
npm install
npm start
```

## Deployment Notes

- `burgero/` and `admin-frontend/` include `vercel.json`
- `burgero-backend/` includes `render.yaml`
- Generated frontend `build/` output is intentionally not kept in source control
- Backend upload artifacts under `public/uploads/` should also remain untracked

## Notes

- Root-level cleanup in this repository is intentionally conservative and does not change application behavior
- Some backend files appear to belong to an older MySQL-based codepath and were left in place for manual review

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
