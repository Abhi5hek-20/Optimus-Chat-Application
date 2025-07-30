import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    Fullname : {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true,
        minlength:6
    },

    bio: {
        type: String,   
        default: '',
    },
    profilePic: {
        type: String,
        default: '',
    },

    nativeLanguage: {
        type: String,
        default: "",
    },

    learningLanguage: {
        type: String,
        default: "",
    },

    location: {
        type: String,
        default: "",
    },
    
    friends: [{
        type: mongoose.Schema.Types.ObjectId,  // if there are our friends they will be saved in this array
        ref: 'User'
    }],


}, {timestamps: true}
);


// pre hook

userSchema.pre('save', async function(next) {
    if (!this.isModified('Password')) return next(); // if password is not modified, skip hashing
    
    try {
        const salt = await bcrypt.genSalt(10);
        // console.log("Salt generated:", salt);
        this.Password = await bcrypt.hash(this.Password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});

userSchema.methods.matchPassword = async function(enteredPassword) {

    const isPasswordCorrect =  await bcrypt.compare(enteredPassword, this.Password);
    return isPasswordCorrect;
};

const User = mongoose.model('User', userSchema);

export default User;