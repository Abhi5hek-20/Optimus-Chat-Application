import express from 'express';  // to build api (web framework)
import dotenv from 'dotenv';  // to load environment variables from .env file
import authRoutes from './routes/auth.route.js';  // import auth routes 
import userRoutes from './routes/user.route.js';  // import user routes
import chatRoutes from './routes/chat.route.js';  // import chat routes
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';  // to enable CORS (Cross-Origin Resource Sharing)
dotenv.config();  // to read .env file we need to use config method

const app = express();  // create an instance of express
const PORT = process.env.PORT

app.use(cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true
}));

app.use(express.json());  // to parse JSON data from incoming requests
app.use(cookieParser());  // to parse cookies from incoming requests

app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);

app.use("/api/chat", chatRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);  
    connectDB();
});      // start the server on port 3000

 