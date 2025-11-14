# SmartHR AI - Intelligent Human Resource Management System

A modern, full-stack web application designed to automate and intelligently manage core human resource (HR) functions within an organization. SmartHR AI simplifies employee management, attendance tracking, leave scheduling, payroll generation, and recruitment processes while integrating artificial intelligence for smart decision support.

## Features

### Core HR Functionalities

- **GPS-Based Attendance Tracking**
  - Clock in/out with GPS location verification
  - Automatic calculation of working hours and overtime
  - Real-time attendance monitoring
  - Location-based office radius verification

- **AI-Powered Leave Management**
  - Employee leave application system
  - AI-powered leave recommendations based on attendance history and workload
  - Interactive calendar for HR managers
  - Automated leave approval workflow

- **Automated Payroll System**
  - Automatic salary calculation based on attendance and overtime
  - Monthly payroll generation with deductions and allowances
  - PDF salary slip generation
  - AI salary analyzer for trends and insights

- **Intelligent Recruitment**
  - Job posting and management
  - Resume submission portal
  - AI-powered resume screening with fit scores
  - Automated candidate matching using Gemini API

- **Analytics Dashboard**
  - Key performance indicators (KPIs)
  - Attendance rate visualization
  - Leave pattern analysis
  - Payroll summaries with charts

- **AI HR Assistant**
  - Powered by Google Gemini API
  - Natural language query support
  - Automated report generation
  - HR insights and recommendations

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Leaflet** - Map integration for GPS features
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM for database
- **MySQL** - Relational database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Google Gemini API** - AI capabilities
- **PDFKit** - PDF generation
- **Multer** - File upload handling
- **Nodemailer** - Email notifications

## Project Structure

```
hr_system/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files (database, gemini)
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, error handling
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Helper functions
│   │   └── server.ts        # Application entry point
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Database seeding script
│   ├── uploads/             # File storage
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── layouts/         # Layout components
│   │   ├── services/        # API service functions
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # State management (Zustand)
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Application entry point
│   ├── public/              # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env.example
│
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn** package manager
- **Google Gemini API Key** ([Get it here](https://makersuite.google.com/app/apikey))

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd hr_system
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file and add your configuration:
# - Database connection string
# - JWT secret key
# - Gemini API key
# - Office GPS coordinates
# - Email configuration (optional)
```

**Important:** Update the `.env` file with your actual credentials:

```env
DATABASE_URL="mysql://username:password@localhost:3306/smarthr_db"
JWT_SECRET="your-secure-secret-key"
GEMINI_API_KEY="your-gemini-api-key"
OFFICE_LATITUDE=37.7749
OFFICE_LONGITUDE=-122.4194
```

#### 3. Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

#### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env if needed (default should work with backend on port 5000)
```

### Running the Application

#### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

#### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## Test Credentials

After seeding the database, you can log in with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@smarthr.com | admin123 |
| HR Manager | hr@smarthr.com | hr123 |
| Employee | john.doe@smarthr.com | emp123 |

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh JWT token

### Employee Endpoints

- `GET /api/employees` - Get all employees (Admin/HR)
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee (Admin/HR)
- `DELETE /api/employees/:id` - Delete employee (Admin only)

### Attendance Endpoints

- `POST /api/attendance/clock-in` - Clock in with GPS
- `POST /api/attendance/clock-out` - Clock out with GPS
- `GET /api/attendance/my-attendance` - Get own attendance
- `GET /api/attendance/employee/:employeeId` - Get employee attendance (HR/Admin)
- `GET /api/attendance/report` - Get attendance report (HR/Admin)

### Leave Endpoints

- `POST /api/leaves` - Apply for leave
- `GET /api/leaves/my-leaves` - Get own leaves
- `GET /api/leaves` - Get all leaves (HR/Admin)
- `PUT /api/leaves/:id/approve` - Approve leave (HR/Admin)
- `PUT /api/leaves/:id/reject` - Reject leave (HR/Admin)

### Payroll Endpoints

- `POST /api/payroll/generate` - Generate monthly payroll (HR/Admin)
- `GET /api/payroll/my-payroll` - Get own payroll
- `GET /api/payroll/employee/:employeeId` - Get employee payroll (HR/Admin)
- `GET /api/payroll/:id/download` - Download salary slip PDF

### Job & Application Endpoints

- `GET /api/jobs` - Get all jobs (public)
- `POST /api/jobs` - Create job posting (HR/Admin)
- `PUT /api/jobs/:id` - Update job (HR/Admin)
- `POST /api/applications` - Submit application (public)
- `GET /api/applications/job/:jobId` - Get applications for job (HR/Admin)

### AI Endpoints

- `POST /api/ai/recommend-leave` - Get AI leave recommendations
- `POST /api/ai/analyze-resume` - AI resume analysis (HR/Admin)
- `POST /api/ai/salary-analysis` - AI salary insights (HR/Admin)
- `POST /api/ai/hr-assistant` - AI HR assistant queries (HR/Admin)
- `GET /api/ai/attendance-insights` - AI attendance insights (HR/Admin)

## Database Schema

The application uses the following main entities:

- **Users** - Authentication and role management
- **Employees** - Employee profile information
- **Attendance** - Clock in/out records with GPS data
- **Leaves** - Leave applications and approvals
- **Payroll** - Monthly salary calculations
- **JobPostings** - Job vacancy listings
- **Applications** - Job applications with AI analysis
- **Notifications** - User notifications

See `backend/prisma/schema.prisma` for complete schema definition.

## Key Features Implementation Status

- [x] Project structure setup
- [x] Database schema design
- [x] Authentication system (JWT)
- [x] Role-based access control
- [ ] GPS-based attendance tracking
- [ ] Leave management with AI recommendations
- [ ] Payroll calculation and PDF generation
- [ ] Job posting and application system
- [ ] AI resume screening
- [ ] Analytics dashboard
- [ ] AI HR Assistant
- [ ] Email notifications

## Environment Variables

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | MySQL connection string | Yes |
| JWT_SECRET | Secret key for JWT tokens | Yes |
| JWT_EXPIRES_IN | Token expiration time | No (default: 7d) |
| PORT | Backend server port | No (default: 5000) |
| GEMINI_API_KEY | Google Gemini API key | Yes (for AI features) |
| OFFICE_LATITUDE | Office GPS latitude | Yes |
| OFFICE_LONGITUDE | Office GPS longitude | Yes |
| OFFICE_RADIUS_METERS | Allowed radius from office | No (default: 100) |
| SMTP_* | Email configuration | No (optional) |
| FRONTEND_URL | Frontend URL for CORS | No (default: localhost:5173) |

### Frontend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_API_URL | Backend API URL | Yes |
| VITE_MAP_CENTER_LAT | Map center latitude | No |
| VITE_MAP_CENTER_LNG | Map center longitude | No |

## Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use ESLint for code linting
- Write meaningful commit messages
- Keep components small and focused

### Git Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "Add feature"`
3. Push to remote: `git push origin feature/your-feature`
4. Create pull request

## Troubleshooting

### Common Issues

**Database Connection Failed**
- Check if MySQL is running
- Verify DATABASE_URL in .env
- Ensure database exists

**Prisma Migration Failed**
- Delete migrations folder
- Run `npx prisma migrate dev --name init`

**Frontend Can't Connect to Backend**
- Ensure backend is running on port 5000
- Check VITE_API_URL in frontend .env
- Verify CORS settings in backend

**Gemini API Not Working**
- Verify GEMINI_API_KEY is correct
- Check API quota limits
- Ensure internet connectivity

## Security Considerations

- JWT tokens are used for authentication
- Passwords are hashed using bcrypt
- Input validation on all endpoints
- Role-based access control
- GPS verification for attendance
- File upload size limits
- SQL injection prevention via Prisma

## Future Enhancements

- Mobile application (React Native)
- Real-time notifications (WebSocket)
- Advanced analytics and reporting
- Performance review system
- Training and development module
- Document management system
- Multi-language support
- Dark mode theme

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**SmartHR AI** - Transforming HR Management with Artificial Intelligence
