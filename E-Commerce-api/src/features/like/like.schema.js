import mongoose from "mongoose"
const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    likeable: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'on_model'
    },
    on_model: {
        type: String,
        enum: ["products", "ratings"]
    }

}).pre('save', (next) => {
    console.log("new Like comming in");
    next();
})
    .post('save', (doc) => {
        console.log("like is saved");
        console.log(doc);
    })
    .pre('findOne', (next) => {
        console.log("Retreving like");
        next();
    })
    .post('findOne', (doc) => {
        console.log("like found");
        console.log(doc);
    })
const LikeModel = mongoose.model("likes", likeSchema);
export default LikeModel;