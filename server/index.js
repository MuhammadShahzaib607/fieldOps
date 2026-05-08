import express from "express"
import cors from "cors"
import { sendRes } from "./utils/responseHandler.js"
import mongoose from "mongoose"
import dotenv from "dotenv"
import authRoutes from "./routes/userRoutes.js"
import jobRoutes from "./routes/jobRoutes.js"

const app = express()

dotenv.config()
app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/job", jobRoutes)

app.get("/", (req, res)=> {
sendRes(res, 200, true, "API Hit successfully")
})

app.get("/health-check", (req, res)=> {
sendRes(res, 200, true, "ok")
})

const connectDB = async ()=> {
try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log ("DB connected Successfully")
} catch (error) {
    console.log("DB Error ===>>", error.message)
}
}

connectDB()

if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app;