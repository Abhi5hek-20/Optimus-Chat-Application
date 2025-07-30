import express from 'express';  // to build api (web framework)
import dotenv from 'dotenv';  // to load environment variables from .env file
import authRoutes from './routes/auth.route.js';  // import auth routes 
import userRoutes from './routes/user.route.js';  // import user routes
import chatRoutes from './routes/chat.route.js';  // import chat routes
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';  // to enable CORS (Cross-Origin Resource Sharing)
dotenv.config();  // to read .env file we need to use config method
import path from 'path';  // to work with file and directory paths


const app = express();  // create an instance of express
const PORT = process.env.PORT

const __dirname = path.resolve();

app.use(cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true
}));

app.use(express.json());  // to parse JSON data from incoming requests
app.use(cookieParser());  // to parse cookies from incoming requests

app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);

app.use("/api/chat", chatRoutes);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);  
    connectDB();
});      // start the server on port 3000

 