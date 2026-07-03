import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import authrouter from "./src/routes/authroutes.js";
import regionrouter from "./src/routes/RegionRoutes.js";
import therapyrouter from "./src/routes/TherapyRoutes.js";
import presencerouter from "./src/routes/PresenceRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/auth', authrouter);
app.use('/region', regionrouter);
app.use('/therapy', therapyrouter);
app.use('/presence', presencerouter);

// ─── Serve React Frontend (Production) ────────────────────────────────────────
if (process.env.NODE_ENV === "production") {
    // Serve static files from the React build folder
    app.use(express.static(path.join(__dirname, "client", "build")));

    // For any route not matched by API, return the React index.html
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });
} else {
    // Dev health check
    app.get("/", (req, res) => {
        res.send("Pharma API is running...");
    });
}

export default app;