# SmartHR AI Backend

Express + TypeScript + Prisma backend for SmartHR AI.

## Stack

- Node.js
- Express
- TypeScript
- Prisma + MySQL
- JWT + bcrypt
- Nodemailer
- PDFKit

## Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
DATABASE_URL="mysql://username:password@localhost:3306/smarthr_db"
JWT_SECRET="your-secret"
PORT=5000
FRONTEND_URL="http://localhost:5173"
GEMINI_API_KEY="your-key"
OFFICE_LATITUDE=37.7749
OFFICE_LONGITUDE=-122.4194
OFFICE_RADIUS_METERS=100
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER=""
SMTP_PASS=""
```

Run DB + seed:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

Start:

```bash
npm run dev
```

## Key Functional Updates

- Added `DEPARTMENT_HEAD` role.
- Leave flow is now multi-stage:
  - `DEPARTMENT_HEAD_REVIEW` -> `HR_REVIEW` -> `COMPLETED`.
- Added password reset endpoints:
  - `POST /api/auth/forgot-password`
  - `POST /api/auth/reset-password`
- Added attendance summary endpoint:
  - `GET /api/attendance/summary/today`
- Added notification creation for leave and payroll events.

## Main API Groups

- `/api/auth`
- `/api/employees`
- `/api/attendance`
- `/api/leaves`
- `/api/payroll`
- `/api/jobs`
- `/api/applications`
- `/api/notifications`
- `/api/ai`

## Test Accounts

- `admin@smarthr.com / admin123`
- `hr@smarthr.com / hr123`
- `head.engineering@smarthr.com / head123`
- `john.doe@smarthr.com / emp123`

## Dev Notes

- If SMTP is missing, emails are mocked (logged), and reset/invite links are still returned for local development.
- Payroll PDFs are stored in `backend/uploads/payroll`.
