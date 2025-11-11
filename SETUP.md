# Mind Managed 2 - Development Setup

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mind_managed2
   ```

2. **Install dependencies for both client and server**

   ```bash
   npm run install-all
   ```

3. **Set up environment variables**

   Create a `.env` file in the `server` directory:

   ```bash
   cp server/.env.example server/.env
   ```

   Update the `.env` file with your MongoDB connection string and JWT secret:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mind_managed2
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start MongoDB**

   If using local MongoDB:

   ```bash
   mongod
   ```

   Or use MongoDB Atlas by updating the MONGODB_URI in your .env file.

5. **Run the application**

   ```bash
   npm run dev
   ```

   This will start both the React frontend (port 3000) and Express backend (port 5000).

## Available Scripts

### Root Directory

- `npm run dev` - Run both client and server in development mode
- `npm run client` - Run only the React frontend
- `npm run server` - Run only the Express backend
- `npm run install-all` - Install dependencies for both client and server
- `npm run build` - Build the React app for production

### Client Directory (cd client)

- `npm start` - Run React development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Server Directory (cd server)

- `npm start` - Run server in production mode
- `npm run dev` - Run server with nodemon for development

## Project Structure

```
mind_managed2/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── layout/    # Layout components (Navbar, etc.)
│   │   │   └── routing/   # Route components
│   │   ├── context/       # React Context providers
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Express backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── package.json
├── .env.example         # Environment variables template
├── .gitignore          # Git ignore rules
├── README.md           # Project documentation
└── package.json        # Root package.json
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/account` - Delete user account

### Tasks

- `GET /api/tasks` - Get all tasks (with filtering)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Dashboard

- `GET /api/dashboard` - Get dashboard statistics
- `GET /api/dashboard/analytics` - Get detailed analytics

## Features

### Current Features

- User registration and authentication
- JWT-based authorization
- Task management (CRUD operations)
- Dashboard with statistics
- Responsive design
- Input validation
- Error handling

### Planned Features

- Goal setting and tracking
- Mental health check-ins
- Progress visualization with charts
- Task categories and tags
- Time tracking
- Notifications
- Dark mode theme
- Mobile app (React Native)

## Database Schema

### User Model

- name, email, password
- preferences (theme, notifications)
- timestamps

### Task Model

- title, description, status, priority, category
- dueDate, completedAt, estimatedTime, actualTime
- tags, user reference
- timestamps

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers
- MongoDB injection protection

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add some feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **MongoDB connection error**

   - Make sure MongoDB is running
   - Check your MONGODB_URI in .env file
   - For Atlas, ensure IP is whitelisted

2. **Port already in use**

   - Change PORT in server/.env file
   - Kill processes using the ports: `lsof -ti:3000 | xargs kill -9`

3. **JWT token errors**

   - Make sure JWT_SECRET is set in .env
   - Clear browser localStorage if needed

4. **CORS errors**
   - Verify CORS_ORIGIN matches your frontend URL
   - Check that proxy is set in client/package.json

## License

This project is licensed under the MIT License.
