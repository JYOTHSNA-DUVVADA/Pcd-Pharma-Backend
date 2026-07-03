import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authrouter from "./src/routes/authroutes.js";
import regionrouter from "./src/routes/RegionRoutes.js";
import therapyrouter from "./src/routes/TherapyRoutes.js";
import presencerouter from "./src/routes/PresenceRoutes.js";

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
}));
app.use(express.json());

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

// Logger (for debugging API calls)
app.use(morgan("dev"));


// Test Route
app.use('/auth',authrouter)

app.use('/region',regionrouter)

app.use('/therapy',therapyrouter)

app.use('/presence',presencerouter)

app.get("/", (req, res) => {
    res.send("Pharma API is running...");
});

// Routes


export default app;