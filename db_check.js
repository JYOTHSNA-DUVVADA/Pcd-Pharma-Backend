import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import Region from "./src/models/Region.js";
import Therapy from "./src/models/Therapy.js";
import Presence from "./src/models/Presence.js";
import Admin from "./src/models/Admin.js";

dotenv.config();

const check = async () => {
    try {
        console.log("Connecting to MONGO_URI:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected successfully!");

        const admins = await Admin.countDocuments();
        const regions = await Region.countDocuments();
        const therapies = await Therapy.countDocuments();
        const presences = await Presence.countDocuments();

        console.log("STATS:");
        console.log("- Admins:", admins);
        console.log("- Regions:", regions);
        console.log("- Therapies:", therapies);
        console.log("- Presences:", presences);

        const sampleRegions = await Region.find().limit(2);
        console.log("Sample Regions:", JSON.stringify(sampleRegions, null, 2));

        const samplePresences = await Presence.find().limit(2);
        console.log("Sample Presences:", JSON.stringify(samplePresences, null, 2));

        await mongoose.disconnect();
    } catch (err) {
        console.error("❌ Error:", err);
    }
};

check();
