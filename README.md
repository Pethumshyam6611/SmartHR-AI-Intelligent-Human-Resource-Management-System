# SmartHR AI

An intelligent, full-stack HR management platform built to streamline daily HR operations including attendance, leave approvals, payroll, recruitment workflows, and role-based access.

---

## What This Project Is

SmartHR AI is designed for organizations that need a modern HR system with:

- Clear role-based permissions
- Reliable attendance and payroll workflows
- Structured multi-level leave approvals
- Centralized employee and recruitment management
- Built-in AI-assisted HR utilities

---

## Key Features

### Authentication & Roles
- Secure JWT authentication
- Role-based authorization
- Roles: `ADMIN`, `HR_MANAGER`, `DEPARTMENT_HEAD`, `EMPLOYEE`
- Forgot password and reset password flow

### Attendance Management
- Clock in / clock out
- Working hours and overtime calculation
- GPS office-radius validation
- Employee attendance history
- Team attendance summary for managers
- Calendar-based employee attendance visibility for manager roles

### Leave Management
- Employee leave requests
- Multi-stage approval flow:
  - Employee -> Department Head -> HR/Admin -> Final decision
- Stage/status tracking per request
- In-app notifications on workflow updates

### Payroll Management
- Payroll generation by month/year
- Attendance-aware payroll calculations
- Overtime, allowances, deductions support
- Payslip PDF generation and download
- Restricted visibility (self vs managerial access)

### Employee & Recruitment
- Employee listing and profile management
- Invite-based onboarding flow
- Job posting and job application modules

### Notifications
- In-app notification feed
- Mark single/all as read
- Notification events for leave and payroll actions

### AI Utilities
- AI endpoint group for HR assistance and analysis workflows

---

## Tech Stack

### Frontend
- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Zustand
- Axios

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- MySQL
- JWT
- bcrypt
- Nodemailer
- PDFKit

### Mobile
- React Native
- TypeScript
- Zustand
- Axios

---

## Project Structure

```text
hr_system/
|-- backend/
|   |-- prisma/
|   |   |-- schema.prisma
|   |   `-- seed.ts
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- types/
|   |   `-- utils/
|   `-- README.md
|
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- layouts/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- store/
|   |   `-- types/
|   `-- README.md
|
|-- mobile/
|   |-- src/
|   |   |-- navigation/
|   |   |-- screens/
|   |   |-- services/
|   |   |-- store/
|   |   `-- types/
|   `-- README.md
|
|-- DESIGN_SYSTEM.md
|-- SETUP_GUIDE.md
`-- README.md
```

---

## Quick Start

### 1. Install dependencies

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ../mobile && npm install
```

### 2. Configure backend environment

Create `backend/.env`:

```env
DATABASE_URL="mysql://username:password@localhost:3306/smarthr_db"
JWT_SECRET="your-secure-secret-key"
GEMINI_API_KEY="your-gemini-api-key"
FRONTEND_URL="http://localhost:5173"
OFFICE_LATITUDE=37.7749
OFFICE_LONGITUDE=-122.4194
OFFICE_RADIUS_METERS=100
```

### 3. Setup database

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 4. Run services

```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

Backend: `http://localhost:5000`  
Frontend: `http://localhost:5173`

---

## Demo Credentials

- Admin: `admin@smarthr.com / admin123`
- HR Manager: `hr@smarthr.com / hr123`
- Department Head: `head.engineering@smarthr.com / head123`
- Employee: `john.doe@smarthr.com / emp123`

---

## API Overview

Base URL: `http://localhost:5000/api`

- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /attendance/clock-in`
- `POST /attendance/clock-out`
- `GET /attendance/summary/today`
- `POST /leaves`
- `PUT /leaves/:id/approve`
- `PUT /leaves/:id/reject`
- `POST /payroll/generate`
- `GET /notifications`

For full API details, check [backend/README.md](d:\Pethum\Important\hr_system\backend\README.md).

---

## Documentation

- Backend docs: [backend/README.md](d:\Pethum\Important\hr_system\backend\README.md)
- Frontend docs: [frontend/README.md](d:\Pethum\Important\hr_system\frontend\README.md)
- Mobile docs: [mobile/README.md](d:\Pethum\Important\hr_system\mobile\README.md)
- UI design details: [DESIGN_SYSTEM.md](d:\Pethum\Important\hr_system\DESIGN_SYSTEM.md)

---

## Notes

- If SMTP is not configured, email actions are mocked for development and links are returned in responses.
- Payroll PDFs are generated under `backend/uploads/payroll`.
