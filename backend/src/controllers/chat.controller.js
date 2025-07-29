import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
    try {
        console.log("Getting stream token for user:", req.user.id);
        console.log("Stream API Key:", process.env.STREAM_API_KEY ? "✓ Present" : "✗ Missing");
        console.log("Stream API Secret:", process.env.STREAM_API_SECRET ? "✓ Present" : "✗ Missing");
        
        const userId = req.user.id; // Get userId from authenticated user
        const token = await generateStreamToken(userId);
        
        console.log("Generated token for user:", userId);

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error generating stream token:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}