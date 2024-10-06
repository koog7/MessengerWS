import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userMessages = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    message: {
        type: String,
    },
})

const Messages = mongoose.model('Message' , userMessages)

export default Messages;