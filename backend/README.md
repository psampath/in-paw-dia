# In-Paw-Dia Backend API

Express.js + MongoDB backend for the pet breed encyclopedia application.

## Features

- JWT-based authentication
- Role-based access control (viewer, editor, admin)
- RESTful API for pet/breed management
- MongoDB with Mongoose ODM
- TypeScript for type safety

## Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
- Set `MONGODB_URI` to your MongoDB connection string
- Change JWT secrets for production

### Running the Server

**Development mode** (with hot reload):
```bash
npm run dev
```

**Production build**:
```bash
npm run build
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get tokens
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout (invalidate refresh token)
- `GET /api/auth/me` - Get current user (protected)

### Pets/Breeds (`/api/pets`)

- `GET /api/pets` - Get all pets (public)
- `GET /api/pets/:id` - Get single pet (public)
- `POST /api/pets` - Create pet (editor/admin only)
- `PUT /api/pets/:id` - Update pet (editor/admin only)
- `DELETE /api/pets/:id` - Delete pet (admin only)

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── server.ts        # Entry point
├── .env                 # Environment variables
├── package.json
└── tsconfig.json
```

## Testing

Test the API using:
- **curl**
- **Postman**
- **Insomnia**
- **Thunder Client** (VS Code extension)

Example test:
```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `5000` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:8080` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/in-paw-dia` |
| `JWT_ACCESS_SECRET` | JWT access token secret | (required in production) |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | (required in production) |
| `JWT_ACCESS_EXPIRY` | Access token expiry | `15m` |
| `JWT_REFRESH_EXPIRY` | Refresh token expiry | `7d` |

## Security

- Passwords hashed with bcrypt
- JWT tokens for authentication
- CORS configured for frontend
- Helmet.js for security headers
- Role-based access control

## License

MIT
