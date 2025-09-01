import mongoose, { Schema } from "mongoose";

const taskModel = new Schema({
    title: {type: String, required: true, trim: true},
    description: {type: String, trim: true},
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    status: {
        type: String,
        enum: ["To Do", "In Progress", "Review", "Done"],
        default: "To Do"
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: ["Medium"]
    },
    assignee: {type: Schema.Types.ObjectId, ref: "User"},
    assignees: [{type: Schema.Types.ObjectId, ref: "User"}],
    watchers: [{type: Schema.Types.ObjectId, ref: "User"}],
    dueDate: {type: Date},
    completedAt: {type: Date},
    estimatedHours: {type: Number, min: 0},
    actualHours: {type: Number, min: 0},
    tags: [{type: String}],
    subTasks: [{
        title: {type: String, required: true},
        completed: {type: Boolean, default: false},
        createdAt: {type: Date, default: Date.now}
    }],
    comments: [{type: String, required: true}],
    attachments: [{
        filename: {type: String, required: true},
        fileUrl: {type: String, required: true},
        fileType: {type: String},
        fileSize: {type: Number},
        uploadedBy: {type: Schema.Types.ObjectId, ref: "User"},
        uploadedAt: {type: Date, default: Date.now},
    }],
    createdBy: {type: Schema.Types.ObjectId, ref: "User"},
    isArchived: {type: Boolean, default: false}
}, {timestamps: true})

const Task = mongoose.model("Task", taskModel)
export default Task