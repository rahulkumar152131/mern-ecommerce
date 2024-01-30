import mongoose from "mongoose";
import bcrypt, { hash } from 'bcrypt';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
    },
    email: {
        type: String,
        select: false,
    },
    password: {
        type: String,
        unique: false,
        select: false
    },
    type: {
        type: String,
    },
    profileImage: {
        type: String,
    }
})

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

const userModel = mongoose.model("users", userSchema);
export default userModel;