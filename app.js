import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authrouter from "./src/routes/authroutes.js";
import regionrouter from "./src/routes/RegionRoutes.js";
import therapyrouter from "./src/routes/TherapyRoutes.js";
import presencerouter from "./src/routes/PresenceRoutes.js";
import networkrouter from "./src/routes/NetworkRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://niteshg2.sg-host.com",
        process.env.CLIENT_URL
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(morgan("dev"));

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/auth', authrouter);
app.use('/region', regionrouter);
app.use('/therapy', therapyrouter);
app.use('/presence', presencerouter);
app.use('/network', networkrouter);

// Health check
app.get("/", (req, res) => {
    res.send("Pharma API is running...");
});

export default app;
