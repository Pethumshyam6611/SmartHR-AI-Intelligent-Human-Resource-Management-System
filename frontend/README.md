# SmartHR AI - Frontend

Frontend application for SmartHR AI built with React, Vite, TypeScript, and Tailwind CSS.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Recharts** - Charts
- **Leaflet** - Maps (GPS features)

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── layouts/        # Layout components
│   ├── services/       # API services
│   ├── hooks/          # Custom hooks
│   ├── store/          # State management
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
└── package.json
```

## Available Scripts

```bash
# Development
npm run dev       # Start dev server (http://localhost:5173)

# Production
npm run build     # Build for production
npm run preview   # Preview production build

# Code Quality
npm run lint      # Run ESLint
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_MAP_CENTER_LAT=37.7749
VITE_MAP_CENTER_LNG=-122.4194
```

## Pages

- `/login` - Login page
- `/dashboard` - Main dashboard with KPIs
- `/attendance` - GPS-based attendance tracking
- `/leaves` - Leave management
- `/payroll` - Salary and payroll information
- `/jobs` - Job postings
- `/applications` - Job applications (HR/Admin)
- `/employees` - Employee management (HR/Admin)
- `/profile` - User profile

## Key Features

### Authentication
- JWT-based authentication
- Role-based access control
- Persistent login with localStorage

### GPS Attendance
- Browser geolocation API
- Map visualization with Leaflet
- Clock in/out with location tracking

### AI Integration
- Leave recommendations
- Resume screening results
- HR assistant queries

### Responsive Design
- Mobile-first approach
- Tailwind CSS utilities
- Adaptive sidebar navigation

## Development

1. Install dependencies: `npm install`
2. Setup environment: Copy `.env.example` to `.env`
3. Start dev server: `npm run dev`
4. Open http://localhost:5173

## Styling

The project uses Tailwind CSS with custom configurations:

- Custom color palette (primary blues)
- Custom component classes (.btn-primary, .card, etc.)
- Responsive breakpoints
- Dark mode support (coming soon)

## State Management

Using Zustand for simple, scalable state management:

- `authStore` - Authentication state
- Persisted to localStorage

## API Integration

All API calls go through the centralized `services/api.ts`:

- Automatic token injection
- Error handling
- Response interceptors
- Automatic logout on 401

## Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
