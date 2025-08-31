import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import morgan from "morgan"

import routes from "./routes/index.js" 

dotenv.config()

const app = express()


app.use(cors({
    origin: process.env.FRONTEND_URL, // allow api request from frontend only
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(morgan("dev")) // Morgan is an HTTP request logger middleware for Express.js. It logs details about every incoming request (method, URL, status, response time, etc. hence useful for debugging APIs

mongoose.connect(process.env.MONGODDB_URI).then(() => console.log("DB connecting successfully")).catch((err) => console.log(err))
app.use(express.json())


app.get("/", async(req, res) => {
    res.status(200).json({
        message: "Welcome to TaskTribe API"
    })
})

app.use("/api-v1", routes)


app.use((req, res, next) => {
  console.log("➡️ Incoming:", req.method, req.url);
  next();
});


// error middleware
app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err) // log full error
    res.status(500).json({
        message: err.message || "Internal Server Error",
    })
})

// not found middleware
app.use((req, res) => {
    res.status(404).json({message: "Not Found"})
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})