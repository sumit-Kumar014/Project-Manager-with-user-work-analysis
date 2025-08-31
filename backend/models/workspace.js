import mongoose, {Schema} from "mongoose"
const workspaceModel = new Schema({
    name: {type: String, required: true, trim: true},
    description: {type: String, trim: true},
    color: {type: String, default: "#3B82F6"},
    owner: {type: Schema.Types.ObjectId, ref: "User", required: true},
    members: [
        {
            _id:  { type: Schema.Types.ObjectId, auto: true },
            user: { type: Schema.Types.ObjectId, ref: "User" },
            role: { type: String, enum: ["owner", "member", "admin", "viewer"] , default: "member" },
            joinedAt: { type: Date, default: Date.now }
        }
    ],
    projects: [{type: Schema.Types.ObjectId, ref: "Project"}]
}, { timestamps: true})

const Workspace = mongoose.model("Workspace", workspaceModel)
export default Workspace