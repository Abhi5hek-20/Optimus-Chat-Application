import { StreamChat } from "stream-chat";
import "dotenv/config";
import { User } from "lucide-react";


const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret) {
    console.error("STREAM_API_KEY and STREAM_API_SECRET is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret); // using streamClient we can interact with Stream application

export const upsertStreamUser = async(userData) => {  // this function is used to add or update a user in Stream
    try{
        await streamClient.upsertUsers([userData]); // upsertUsers will take an array of user objects and will add or update them in Stream
        return userData;
    }catch(error){
        console.error("Error upserting user:", error);
    }   
}

// this function is used to get a user from Stream
export const generateStreamToken = async(userId)=> {
    try{
        const userIdStr =  userId.toString();
        return streamClient.createToken(userIdStr); // createToken will generate a token for the user
    }catch(error){
        console.error("Error getting stream user:", error);
        throw error; // rethrow the error to be handled by the caller
    }
};

