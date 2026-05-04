# SmartHR AI - Backend

Backend API for SmartHR AI built with Node.js, Express, TypeScript, and Prisma.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **MySQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Google Gemini API** - AI capabilities

## Project Structure

```
backend/
├── src/
│   ├── config/           # Database and API configurations
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── server.ts         # Application entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding
├── uploads/              # File uploads
└── package.json
```

## Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Production
npm run build            # Compile TypeScript
npm start                # Start production server

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:seed      # Seed database with sample data

# Code Quality
npm run lint             # Run ESLint
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/smarthr_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# Google Gemini AI
GEMINI_API_KEY="your-gemini-api-key"

# Office Location (GPS)
OFFICE_LATITUDE=37.7749
OFFICE_LONGITUDE=-122.4194
OFFICE_RADIUS_METERS=100

# Email (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Frontend URL
FRONTEND_URL="http://localhost:5173"
```

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/invite` - Invite new employee (Admin/HR)
- `PUT /api/auth/profile` - Update own profile

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `PATCH /api/employees/:id/toggle-status` - Activate/Deactivate employee
- `DELETE /api/employees/:id` - Delete employee

### Attendance
- `POST /api/attendance/clock-in` - Clock in with GPS
- `POST /api/attendance/clock-out` - Clock out
- `GET /api/attendance/my-attendance` - Get own attendance

### Leaves
- `POST /api/leaves` - Apply for leave
- `GET /api/leaves/my-leaves` - Get own leaves
- `PUT /api/leaves/:id/approve` - Approve leave
- `PUT /api/leaves/:id/reject` - Reject leave

### Payroll
- `POST /api/payroll/generate` - Generate payroll
- `GET /api/payroll/my-payroll` - Get own payroll
- `GET /api/payroll/:id/download` - Download salary slip

### Jobs & Applications
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job posting
- `POST /api/applications` - Submit application

### AI Features
- `POST /api/ai/recommend-leave` - AI leave recommendations
- `POST /api/ai/analyze-resume` - AI resume analysis
- `POST /api/ai/hr-assistant` - AI HR assistant

## Database Schema

See `prisma/schema.prisma` for complete schema definition.

Main entities:
- Users
- Employees
- Attendance
- Leaves
- Payroll
- JobPostings
- Applications
- Notifications

## Development

1. Install dependencies: `npm install`
2. Setup database: `npm run prisma:migrate`
3. Seed data: `npm run prisma:seed`
4. Start dev server: `npm run dev`

## Testing

Test credentials after seeding:
- Admin: admin@smarthr.com / admin123
- HR: hr@smarthr.com / hr123
- Employee: john.doe@smarthr.com / emp123
