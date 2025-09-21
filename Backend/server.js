import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import UserRouter from '../Backend/Routes/UserRoutes.js';
import path from "path";

dotenv.config();
const app = express();

app.use(cors({
    origin:"https://ums-react-frountend.onrender.com",
     credentials: true
}));

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser())
app.use('/',UserRouter)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
