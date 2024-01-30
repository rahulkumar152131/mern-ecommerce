import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { ApplicationError } from "../../error-handler/applicationError.js"
import userModel from './user.schema.js';

//creating model from schema.
// const userModel = mongoose.model("users", userShema);
// userModel

export default class userRepository {
    async signUp(user) {
        try {
            const newUser = new userModel(user);
            await newUser.save();
            const { password, ...userWithoutPassword } = newUser.toObject();
            return { success: true, msg: "Registration Successful", res: userWithoutPassword };
        } catch (err) {
            console.log(err);
            throw new ApplicationError("err", 400);
            // if (err instanceof mongoose.Error.ValidationError) {
            //     // console.log(err, "err in mongoose");
            //     throw err
            // } else if (err instanceof mongoose.Error.MongooseServerSelectionError) {
            //     throw err
            // } else {
            //     // console.log("error in user repository", err, "***");
            //     throw new ApplicationError(err, 500);
            // }
        }
    }
    async findByEmail(email) {
        try {
            const user = await userModel.findOne({ email: email }).select('+password').select('+email').lean();
            return user
        } catch (err) {
            console.log("error in signin", err);
            throw new ApplicationError('Something went wrong with database', 500);
        }

    }
    async resetPassword(email, password) {
        try {
            const user = await userModel.findOne({ email: email }).select('+password');
            user.password = password;
            user.save();
            const userWithoutPassword = user.toObject();
            delete userWithoutPassword.password;
            return userWithoutPassword;
        } catch (err) {
            console.log("error in signin", err);
            throw new ApplicationError('Something went wrong with database', 500);
        }

    }
}