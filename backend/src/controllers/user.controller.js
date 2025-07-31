import User from '../models/User.js';  
import FriendRequest from '../models/FriendRequest.js'; // Import the FriendRequest model

export async function getRecommendedUsers(req, res) {
    try{

        const currentUserId = req.user.id; // Assuming user ID is stored in req.user
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and : [
                { _id: { $ne: currentUserId } }, // Exclude current user
                { _id: { $nin: currentUser.friends } } // Exclude friends
            ]
    });
        return res.status(200).json(recommendedUsers);
}catch (error) {
        console.error("Error fetching recommended users:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getMyFriends(req, res) {
    try {   
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends", "Fullname profilePic nativeLanguage learningLanguage"); // Populate friends (not only with ids but with selected fields)
        
        return res.status(200).json(user.friends);
    }catch (error) {
        console.error("Error fetching friends:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function sendFriendRequest(req, res) {
    try{
        const myId = req.user.id; // Assuming user ID is stored in req.user
        const recipientId = req.params.id; // Get recipient ID from request parameters

        if(myId === recipientId) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself." });
        }

        const recipient = await User.findById(recipientId);

        if(!recipient) {
            return res.status(400).json({ message: "Recipient not found" });
        }

        if(recipient.friends.includes(myId)) {
            return res.status(400).json({ message: "You are already friends with this user." });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ]
        });

        if(existingRequest) {
            return res.status(400).json({ message: "Friend request already exists." });
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        });

        console.log("Friend request created:", friendRequest);

        res.status(201).json({
            message: "Friend request sent successfully",
            friendRequest
        });

    }catch (error) {
        console.error("Error sending friend request:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function acceptFriendRequest(req, res) {
    try{
        const {id : requestId} = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if(!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        // Check if the current user is the recipient of the friend request
        if(friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this friend request" });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

         // Add each user to the other's friends list
         await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient },
         });

         await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender },
         });

         res.status(200).json({ message: "Friend request accepted successfully"});

    }catch (error) {
        console.error("Error accepting friend request:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getFriendRequests(req, res) {
    try{
        console.log("Getting friend requests for user:", req.user.id);
        
        const incomingReqs = await FriendRequest.find({ 
            recipient: req.user.id, 
            status: "pending" 
        }).populate("sender", "Fullname profilePic nativeLanguage learningLanguage");

        const acceptedReqs = await FriendRequest.find({ 
            recipient: req.user.id, 
            status: "accepted" 
        }).populate("sender", "Fullname profilePic");

        console.log("Found incoming requests:", incomingReqs.length);
        console.log("Found accepted requests:", acceptedReqs.length);

        res.status(200).json({
            incomingReqs,
            acceptedReqs
        });

    }catch(error){
        console.error("Error fetching friend requests:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getOutgoingFriendRequests(req, res) {
    try{
        const outgoingReqs = await FriendRequest.find({ 
            sender: req.user.id, 
            status: "pending" 
        }).populate("recipient", "Fullname profilePic nativeLanguage learningLanguage");

        res.status(200).json(outgoingReqs);

    }catch(error){
        console.error("Error fetching outgoing friend requests:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateProfile(req, res) {
    try {
        const { profilePic, bio } = req.body;
        const userId = req.user.id;

        const updateData = {};
        if (profilePic !== undefined) updateData.profilePic = profilePic;
        if (bio !== undefined) updateData.bio = bio;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, select: "-Password" }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            user: updatedUser
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}