# Mind Managed 2

A modern MERN stack application for personal mind management and productivity.

## Features

- User authentication and authorization
- Task and goal management
- Mental health tracking
- Progress visualization
- Responsive design

## Tech Stack

- **Frontend**: React.js with modern hooks
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Styling**: CSS3 with responsive design

## Project Structure

```
mind_managed2/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── server/                 # Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── package.json
├── .env.example
├── .gitignore
└── package.json
```

## Quick Start

1. Clone the repository
2. Install dependencies: `npm run install-all`
3. Create `.env` file in server directory with your MongoDB URI
4. Start development servers: `npm run dev`

## Environment Variables

Create a `.env` file in the `server` directory with:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mind_managed2
JWT_SECRET=your_jwt_secret_here
```

## Development

- Frontend runs on `http://localhost:3000`
- Backend runs on `http://localhost:5000`
- Both servers start with hot reload using `npm run dev`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
