import jwt from "jsonwebtoken"
import User from "../models/user.js"

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1] // Bearer sfgvbsvsbmh

        if(!token) {
            return res.status(401).json({message: "Unauthorized"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId)

        if(!user) {
            return res.status(401).json({message: "Unauthorized"})
        }

        req.user = user
        next() // gives control to next middleware or functions(controllers)

    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error"})
    }
}

export default authMiddleware