import Project from "../models/project.js"
import Task from "../models/task.js"
import Workspace from "../models/workspace.js"

const createTask = async (req, res) => {
    try {
        const { projectId } = req.params
        const {title, description, status, priority, dueDate, assignees} = req.body
        const project = await Project.findById(projectId)

        if(!project) {
            return res.status(404).json({
                message: "Project Not Found"
            })
        }

        const workspace = await Workspace.findById(project.workspace)

        if(!workspace) {
            return res.status(404).json({
                message: "workspace Not Found"
            })
        }

        const isMember = workspace.members.some(
            (member) => member.user.toString() === req.user._id.toString()
        )

        if(!isMember) {
            return res.status(403).json({
                message: "You are not a member of this workspace",
            })
        }

        const newTask = await Task.create({
            title,
            description, 
            status,
            priority,
            dueDate, 
            assignees,
            project: projectId,
            createdBy: req.user._id
        })

        project.tasks.push(newTask._id)
        await project.save()

        res.status(201).json(newTask)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

export {
    createTask
}