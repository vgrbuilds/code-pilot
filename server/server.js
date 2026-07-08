import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/core/connect_db.js';
import userRouter from './src/routers/user.router.js';
import repoRouter from './src/routers/repo.router.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', userRouter);
app.use('/repos', repoRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
