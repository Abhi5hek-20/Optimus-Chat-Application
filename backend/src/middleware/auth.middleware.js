// this mathod is used to valiate JWT token and protect routes
import jwt from "jsonwebtoken";
import User from "../models/User.js";1

export const protectedRoute = async (req, res, next) => {
    try{

    
        const token = req.cookies.jwt; // get the token from cookies

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify the token
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-Password"); // find the user by id
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user; // attach the user to the request object
        next(); // call the next middleware or route handler
    } catch (error) {
        console.error("Error in protectedRoute middleware:", error);
        return res.status(500).json({ message: "Server error" });
    }

}