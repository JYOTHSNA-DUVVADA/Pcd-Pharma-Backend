import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authrouter from "./src/routes/authroutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

// Logger (for debugging API calls)
app.use(morgan("dev"));


// Test Route
app.use('/auth',authrouter)
app.get("/", (req, res) => {
    res.send("Pharma API is running...");
});

// Routes


export default app;