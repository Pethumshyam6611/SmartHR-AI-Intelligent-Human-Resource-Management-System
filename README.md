# SmartHR AI

SmartHR AI is a full-stack HR management system with role-based access, attendance tracking, leave workflows, payroll generation, recruitment management, and AI-assisted HR tools.

## What's New

- Added `DEPARTMENT_HEAD` role.
- Added multi-stage leave approval flow:
  - Employee -> Department Head -> HR/Admin -> Final decision.
- Added in-app notifications for leave and payroll events.
- Added forgot/reset password flow:
  - `POST /api/auth/forgot-password`
  - `POST /api/auth/reset-password`
- Added manager attendance summary and employee attendance calendar view.
- Improved payroll generation and access rules.

## Roles

- `ADMIN`
- `HR_MANAGER`
- `DEPARTMENT_HEAD`
- `EMPLOYEE`

## Quick Start

### 1. Install dependencies

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ../mobile && npm install
```

### 2. Configure backend env

Create `backend/.env` (example values):

```env
DATABASE_URL="mysql://username:password@localhost:3306/smarthr_db"
JWT_SECRET="your-secure-secret-key"
GEMINI_API_KEY="your-gemini-api-key"
FRONTEND_URL="http://localhost:5173"
OFFICE_LATITUDE=37.7749
OFFICE_LONGITUDE=-122.4194
OFFICE_RADIUS_METERS=100
```

### 3. Prepare database

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 4. Run apps

```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

## Test Accounts

After seeding:

- Admin: `admin@smarthr.com / admin123`
- HR Manager: `hr@smarthr.com / hr123`
- Department Head: `head.engineering@smarthr.com / head123`
- Employee: `john.doe@smarthr.com / emp123`

## Project Structure

- `backend` - Express + Prisma API
- `frontend` - React + Vite web app
- `mobile` - React Native app (basic auth + attendance views)

## Notes

- If SMTP is not configured, email actions log as mock output and reset/invite links are returned in API responses for development.
- Uploaded payroll PDFs are stored under `backend/uploads`.
