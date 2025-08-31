import mongoose, { Schema } from "mongoose";

const commentModel = new Schema({
    text: {type: String, required: true, trim: true},
    task: {type: Schema.Types.ObjectId, ref: "Task"},
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    mentions: [{
        user: {type: Schema.Types.ObjectId, ref: "User"},
        offset: {type: Number},
        length: {type: Number}
    }],
    reactions: [{
        emoji: {type: String},
        user: {type: Schema.Types.ObjectId, ref: "User"}
    }],
    attachments: [{
        filename: {type: String},
        fileUrl: {type: String},
        fileType: {type: String},
        fileSize: {type: Number},
    }],
    isEdited: {type: Boolean, default: false},

}, {timestamps: true})

const Comment = mongoose.model("Comment", commentModel)
export default Comment