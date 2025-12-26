# 🎉 Supabase to MongoDB Migration Complete!

This document contains everything you need to know about the migration and how to test the application.

## ✅ What's Been Completed

### Backend (Node.js/Express + MongoDB)
- ✅ Complete Express.js server with TypeScript
- ✅ MongoDB integration with Mongoose ODM
- ✅ Custom JWT authentication (access + refresh tokens)
- ✅ Role-based access control (viewer, editor, admin)
- ✅ All Mongoose models (User, Pet, Species, Question, Trait, UserResponse)
- ✅ Full CRUD API for pets/breeds
- ✅ Authentication endpoints (register, login, refresh, logout, getCurrentUser)
- ✅ Security middleware (Helmet, CORS, error handling)
- ✅ Data migration scripts (export from Supabase, import to MongoDB)

### Frontend (React + Vite + TypeScript)
- ✅ Axios API client with JWT interceptors
- ✅ Automatic token refresh on 401 errors
- ✅ Token management (localStorage)
- ✅ Rewritten AuthContext for JWT authentication
- ✅ Updated all pages to use new API:
  - Home.tsx
  - Breeds.tsx
  - BreedProfile.tsx
  - Admin.tsx
  - AdminBreedForm.tsx
  - Auth.tsx (uses AuthContext)
- ✅ Removed Supabase dependencies
- ✅ Updated environment variables

---

## 🚀 How to Run & Test

### Prerequisites

1. **MongoDB** - Choose one:
   - **Local:** Install MongoDB Community Edition
     ```bash
     # macOS
     brew install mongodb-community
     brew services start mongodb-community

     # Or download from https://www.mongodb.com/try/download/community
     ```
   - **Cloud:** MongoDB Atlas (free tier)
     - Sign up at https://www.mongodb.com/cloud/atlas
     - Create a cluster and get connection string
     - Update `backend/.env` with your connection string

2. **Node.js** (v18 or higher)

### Step 1: Start MongoDB

**If using local MongoDB:**
```bash
mongod --dbpath /path/to/data
```

**If using MongoDB Atlas:**
- Update `backend/.env` with your connection string

### Step 2: Start the Backend

```bash
cd backend
npm install
npm run dev
```

The server should start on `http://localhost:5000`

You should see:
```
🚀 Server is running!
📡 Port: 5000
🌍 Environment: development
🔗 Frontend URL: http://localhost:8080
✅ MongoDB connected successfully
```

### Step 3: (Optional) Migrate Data from Supabase

If you want to migrate existing data:

```bash
# In backend directory

# 1. Add Supabase credentials to backend/.env temporarily
echo "VITE_SUPABASE_URL=your-supabase-url" >> .env
echo "VITE_SUPABASE_PUBLISHABLE_KEY=your-key" >> .env

# 2. Export data from Supabase
npx ts-node src/scripts/export-supabase.ts

# 3. Import data to MongoDB
npx ts-node src/scripts/import-to-mongodb.ts
```

**Note:** Passwords cannot be migrated. All migrated users will have the temporary password: `TempPassword123!`

### Step 4: Start the Frontend

```bash
# In root directory
npm install
npm run dev
```

The frontend should start on `http://localhost:8080`

---

## 🧪 Testing Checklist

### 1. Test Backend API (using curl or Postman)

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Register a New User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

**Get All Pets (Public):**
```bash
curl http://localhost:5000/api/pets
```

**Create a Pet (Protected - Editor/Admin only):**
```bash
# Save the access token from login response
TOKEN="your-access-token-here"

curl -X POST http://localhost:5000/api/pets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Breed",
    "type": "dog",
    "origin": "India",
    "size": "Medium"
  }'
```

### 2. Test Frontend Authentication

1. **Open http://localhost:8080**
2. **Navigate to /auth**
3. **Test Sign Up:**
   - Create a new account
   - Should automatically log you in
   - Should redirect to home page
   - Check browser console for tokens

4. **Test Sign In:**
   - Log out
   - Sign in with your credentials
   - Should redirect to home page

5. **Test Token Refresh:**
   - After 15 minutes (or manually expire token in localStorage)
   - Make any API request
   - Token should automatically refresh
   - Request should succeed

6. **Test Sign Out:**
   - Click logout
   - Should clear tokens
   - Should redirect to home page

### 3. Test Public Pages

- ✅ **Home** (`/`) - Should load breeds from MongoDB
- ✅ **Breeds** (`/breeds`) - Should show all breeds with search/filter
- ✅ **Breed Profile** (`/breeds/:id`) - Should show single breed details

### 4. Test Admin Pages (Protected)

**Note:** Only works if logged in as editor or admin

1. **Admin Dashboard** (`/admin`):
   - Should show list of all breeds
   - Stats should display correctly
   - Delete button only visible for admin role

2. **Create New Breed** (`/admin/breed/new`):
   - Fill out form
   - Submit
   - Should create breed in MongoDB
   - Should redirect to admin dashboard

3. **Edit Breed** (`/admin/breed/:id`):
   - Click edit on any breed
   - Modify fields
   - Submit
   - Should update breed in MongoDB
   - Should redirect to admin dashboard

4. **Delete Breed** (Admin only):
   - Click delete on any breed
   - Confirm
   - Should delete from MongoDB
   - Should refresh list

### 5. Test Role-Based Access Control

**Create users with different roles in MongoDB:**

```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)

db.users.updateOne(
  { email: "editor@example.com" },
  { $set: { role: "editor" } }
)

db.users.updateOne(
  { email: "viewer@example.com" },
  { $set: { role: "viewer" } }
)
```

**Test permissions:**
- **Viewer:** Can view all pages, cannot access admin routes
- **Editor:** Can view and create/update breeds, cannot delete
- **Admin:** Full access, can delete breeds

---

## 📁 Project Structure

### Backend (`/backend`)
```
backend/
├── src/
│   ├── config/          # Database & environment config
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, RBAC, error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── scripts/         # Data migration scripts
│   ├── types/           # TypeScript types
│   ├── utils/           # JWT, password, validators
│   └── server.ts        # Express app entry point
├── .env                 # Environment variables
├── package.json
└── tsconfig.json
```

### Frontend (`/src`)
```
src/
├── api/                 # API client layer
│   ├── client.ts        # Axios with JWT interceptors
│   ├── auth.ts          # Auth API calls
│   ├── pets.ts          # Pet API calls
│   └── types.ts         # API response types
├── contexts/
│   └── AuthContext.tsx  # JWT-based auth context
├── lib/
│   └── tokenManager.ts  # Token storage/retrieval
├── pages/               # All pages updated
└── components/          # UI components
```

---

## 🔧 Configuration Files

### Backend Environment (`backend/.env`)
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:8080
MONGODB_URI=mongodb://localhost:27017/in-paw-dia
JWT_ACCESS_SECRET=dev-access-secret-key-for-development-only
JWT_REFRESH_SECRET=dev-refresh-secret-key-for-development-only
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

### Frontend Environment (`/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🔑 Key Changes

### Authentication Flow
**Before (Supabase):**
- Supabase handled everything
- Session stored by Supabase
- Built-in role management

**After (Custom JWT):**
- JWT tokens (access + refresh)
- Access token: 15min lifetime
- Refresh token: 7 days
- Automatic token refresh on 401
- Roles stored in User model

### Data Structure
**Before (PostgreSQL):**
- UUID primary keys
- Relationships via foreign keys
- Timestamp fields: `created_at`, `updated_at`

**After (MongoDB):**
- ObjectId primary keys (`_id`)
- Embedded documents or ObjectId references
- Timestamp fields: `createdAt`, `updatedAt`

### API Calls
**Before:**
```typescript
const { data } = await supabase.from('pets').select('*')
```

**After:**
```typescript
const data = await getAllPets()
```

---

## ⚠️ Important Notes

1. **Security:**
   - Change JWT secrets in production
   - Use HTTPS for API calls
   - Enable MongoDB access restrictions

2. **Password Migration:**
   - Passwords cannot be migrated from Supabase
   - Implement password reset flow for existing users
   - Or start fresh with new registrations

3. **Development:**
   - Both servers must be running
   - Frontend: http://localhost:8080
   - Backend: http://localhost:5000

4. **Deployment:**
   - Backend: Deploy to Render/Railway/Fly.io
   - Frontend: Update VITE_API_BASE_URL to production
   - Database: Use MongoDB Atlas

---

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify MongoDB connection string in `.env`
- Check port 5000 isn't already in use

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check VITE_API_BASE_URL in frontend `.env`
- Check browser console for CORS errors

### Authentication errors
- Clear localStorage and try again
- Check JWT secrets are set in backend `.env`
- Verify tokens aren't expired

### "Pet not found" errors
- Ensure MongoDB has data
- Run data migration scripts if needed
- Check ObjectId format in URLs

---

## 📚 Additional Resources

- **Backend README:** `/backend/README.md`
- **MongoDB Docs:** https://docs.mongodb.com/
- **Mongoose Docs:** https://mongoosejs.com/
- **JWT Best Practices:** https://jwt.io/introduction

---

## ✨ Next Steps

1. Test all functionality thoroughly
2. Add any custom breeds to MongoDB
3. Update admin roles in MongoDB
4. Deploy to production when ready
5. Set up monitoring and logging
6. Implement password reset flow
7. Add rate limiting for production

---

**Migration completed successfully! 🎉**

All 28 tasks completed. The application is now fully migrated from Supabase to MongoDB with custom JWT authentication.
