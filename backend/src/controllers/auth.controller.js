import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { upsertStreamUser } from '../lib/stream.js'; // function to upsert user in Stream


// login controller

export async function login(req, res) {
    try{
        const { email, Password } = req.body;
        // console.log(req.body);

        if(!email || !Password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        const isPasswordCorrect = await user.matchPassword(Password); // matchPassword coming from User model User.js

        if(!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // create a JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }

        );
        console.log("Token generated:", token);

        res.cookie('jwt', token, {
            httpOnly: true, // prevent XSS attacks
            secure: process.env.NODE_ENV === 'production', // use secure cookies in production
            sameSite: 'strict', // prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000 ,// 7 days
        });


        res.status(201).json({
            success:true,user:user
        });   

    }
 catch (error) {
        console.log("Error during login:", error);
        return res.status(500).json({ message: "Server error" });
    }   
}

// signup controller

export async function signup(req, res) {
    const { Fullname, email, Password } = req.body;
    console.log(req.body)
    try{
        if(!Fullname || !email || !Password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if(Password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // pattern to validate email format
        if(!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({email});
        if(existingUser) {
            // console.log("Email already exists");
            return res.status(400).json({ message: "Email already exists" });
        }

        const idx = Math.floor(Math.random() * 100) + 1; // generate a random number between 1 and 100
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}`; // generate a random avatar URL

        const newUser = await User.create({
            Fullname,   
            email,
            Password,
            profilePic: randomAvatar
        }); // create method automatically calls pre hook to hash the password in User.js
       


        // upsert the user in Stream
        try{
            await upsertStreamUser({
                id: newUser._id,
                name: newUser.Fullname,
                image: newUser.profilePic || "",
            });
            console.log("User upserted in Stream successfully");
        }catch(error){
            console.error("Error upserting user in Stream:", error);
        }
        


        // create a JWT token
        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('jwt', token, {
            httpOnly: true, // prevent XSS attacks
            secure: process.env.NODE_ENV !== 'production', // use secure cookies in production
            sameSite: 'strict', // prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000 ,// 7 days
        });
       
        res.status(201).json({
            success:true,
            user:newUser
        });   


    }catch (error) {
        console.log("Error during signin:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

// logout controller
export function logout(req, res) {
    res.clearCookie('jwt'); // clear the cookie
    res.status(200).json({ message: "Logged out successfully" });       
}