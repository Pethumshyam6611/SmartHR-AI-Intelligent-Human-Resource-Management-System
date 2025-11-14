# SmartHR AI - Quick Setup Guide

This guide will help you get SmartHR AI up and running in 10 minutes.

## Prerequisites Checklist

- [ ] Node.js v18+ installed
- [ ] MySQL v8.0+ installed and running
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Google Gemini API key

## Step-by-Step Setup

### Step 1: Get Google Gemini API Key (2 minutes)

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Step 2: Create MySQL Database (1 minute)

```bash
# Open MySQL shell
mysql -u root -p

# Create database
CREATE DATABASE smarthr_db;
exit;
```

### Step 3: Configure Environment Variables (2 minutes)

**Backend Configuration:**

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
DATABASE_URL="mysql://root:your_password@localhost:3306/smarthr_db"
JWT_SECRET="your-random-secret-key-min-32-chars"
GEMINI_API_KEY="your-gemini-api-key-from-step-1"
```

**Frontend Configuration:**

```bash
cd frontend
cp .env.example .env
# Default values should work, no changes needed
```

### Step 4: Install Dependencies (3 minutes)

From project root:

```bash
# Install all dependencies at once
npm run install:all

# OR install individually:
cd backend && npm install
cd ../frontend && npm install
```

### Step 5: Setup Database (2 minutes)

```bash
cd backend

# Generate Prisma client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# Seed with sample data
npm run prisma:seed
```

You should see:
```
✅ Created admin user: admin@smarthr.com
✅ Created HR Manager: hr@smarthr.com
✅ Created sample employee: john.doe@smarthr.com
🎉 Database seeding completed!
```

### Step 6: Start the Application (1 minute)

**Option A: Using two terminals (Recommended)**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

**Option B: Using root scripts**

Terminal 1:
```bash
npm run dev:backend
```

Terminal 2:
```bash
npm run dev:frontend
```

### Step 7: Access the Application

1. Open browser and go to: http://localhost:5173
2. Login with test credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@smarthr.com | admin123 |
| HR Manager | hr@smarthr.com | hr123 |
| Employee | john.doe@smarthr.com | emp123 |

## Verification Checklist

After setup, verify these work:

- [ ] Frontend loads at http://localhost:5173
- [ ] Backend API responds at http://localhost:5000/health
- [ ] Can login with test credentials
- [ ] Dashboard displays correctly
- [ ] No console errors in browser

## Troubleshooting

### Issue: Database connection failed

**Solution:**
```bash
# Check MySQL is running
sudo systemctl status mysql  # Linux
brew services list           # macOS

# Test connection
mysql -u root -p -e "SHOW DATABASES;"

# Verify DATABASE_URL in backend/.env
```

### Issue: Prisma migration failed

**Solution:**
```bash
cd backend
rm -rf prisma/migrations
npm run prisma:migrate
```

### Issue: Port already in use

**Solution:**
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Issue: npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Gemini API not working

**Possible causes:**
- Invalid API key
- API quota exceeded
- No internet connection

**Solution:**
1. Verify API key at [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Check API usage quota
3. Test with curl:
```bash
curl -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY"
```

## Next Steps

1. **Explore Features**
   - Try clocking in/out with attendance
   - Apply for leave
   - Browse job postings

2. **Development**
   - Read the main README.md
   - Check the project structure
   - Start implementing missing features

3. **Customization**
   - Update office GPS coordinates in .env
   - Modify database schema as needed
   - Customize UI theme in tailwind.config.js

## Useful Commands

```bash
# View database in browser
cd backend && npm run prisma:studio

# Reset database
cd backend
npx prisma migrate reset

# Build for production
npm run build:all

# Run linter
cd backend && npm run lint
cd frontend && npm run lint
```

## Getting Help

- Check the main [README.md](./README.md)
- Review [API Documentation](./README.md#api-documentation)
- Open an issue on GitHub

---

Congratulations! You're ready to start developing with SmartHR AI!
