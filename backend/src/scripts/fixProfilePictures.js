import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const fixProfilePictures = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Find users with broken profile pictures (containing spaces or .png)
    const usersToFix = await User.find({
      $or: [
        { profilePic: { $regex: /\s/ } }, // Contains spaces
        { profilePic: { $regex: /\.png$/ } }, // Ends with .png
        { profilePic: { $eq: '' } }, // Empty string
        { profilePic: { $exists: false } } // Doesn't exist
      ]
    });

    console.log(`Found ${usersToFix.length} users with broken profile pictures`);

    for (const user of usersToFix) {
      const idx = Math.floor(Math.random() * 100) + 1;
      const newAvatar = `https://avatar.iran.liara.run/public/${idx}`;
      
      await User.findByIdAndUpdate(user._id, { profilePic: newAvatar });
      console.log(`Fixed profile picture for user: ${user.Fullname} (${user.email})`);
    }

    console.log('All profile pictures fixed!');
  } catch (error) {
    console.error('Error fixing profile pictures:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

fixProfilePictures();
