import Project from "../models/project.js";
import Workspace from "../models/workspace.js";

const createWorkspace = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    const workspace = await Workspace.create({
      name,
      description,
      color,
      owner: req.user._id,
      members: [
        {
          user: req.user._id,
          role: "owner",
          joinedAt: new Date(),
        },
      ],
    });

    return res.status(201).json(workspace);
  } catch (error) {
    console.error("Error creating workspace:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      "members.user": req.user._id,
    });
    return res.status(200).json(workspaces);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getWorkspaceDetails = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user._id, // he / she should be memeber of a worksapce
    }).populate("members.user", "name email profilePicture");
    // Note : In mongoose, .populate() replaces ObjectId references with the actual referenced documents.
    if (!workspace)
      return res.status(400).json({ message: "Workspace not found" });

    return res.status(200).json(workspace);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getWorkspaceProjects = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user._id,
    }).populate("members.user", "name email profilePicture");

    if (!workspace)
      return res.status(400).json({ message: "Workspace not found" });

    // find the projects belonging to that workspace and user is a member of it
    const projects = await Project.find({
      workspace: workspaceId,
      isArchived: false,
    }).sort({ createdAt: -1 });
    console.log(projects);
    return res.status(200).json({projects, workspace});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  getWorkspaceProjects,
  getWorkspaceDetails,
  getWorkspaces,
  createWorkspace,
};
