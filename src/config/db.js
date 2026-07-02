import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import Region from "../models/Region.js";
import Therapy from "../models/Therapy.js";
import Presence from "../models/Presence.js";
import bcrypt from "bcryptjs";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Seed default admin
        const adminExists = await Admin.findOne({ user_id: "admin" });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await Admin.create({ user_id: "admin", password: hashedPassword });
            console.log("👥 Default Admin seeded (admin / admin123)");
        }

        // Seed initial regions
        const regionCount = await Region.countDocuments();
        if (regionCount === 0) {
            await Region.insertMany([
                { name: "North Region", description: "Northern part of India", statesCount: 5, presences: 50, distributors: 18, status: "Active", statesList: ["Delhi", "Haryana", "Uttar Pradesh", "Uttarakhand", "Punjab"] },
                { name: "South Region", description: "Southern part of India", statesCount: 4, presences: 35, distributors: 12, status: "Active", statesList: ["Karnataka", "Tamil Nadu", "Andhra Pradesh", "Kerala"] },
                { name: "West Region", description: "Western part of India", statesCount: 4, presences: 20, distributors: 8, status: "Active", statesList: ["Maharashtra", "Gujarat", "Rajasthan", "Goa"] },
                { name: "East Region", description: "Eastern part of India", statesCount: 3, presences: 15, distributors: 5, status: "Active", statesList: ["West Bengal", "Bihar", "Odisha"] },
                { name: "Central Region", description: "Central part of India", statesCount: 2, presences: 10, distributors: 2, status: "Active", statesList: ["Madhya Pradesh", "Chhattisgarh"] },
                { name: "North East Region", description: "North Eastern part of India", statesCount: 2, presences: 8, distributors: 1, status: "Active", statesList: ["Assam", "Sikkim"] }
            ]);
            console.log("🗺️ Initial regions seeded successfully.");
        }

        // Seed initial therapies
        const therapyCount = await Therapy.countDocuments();
        if (therapyCount === 0) {
            await Therapy.insertMany([
                { icon: "Shield",   therapy: "Antibiotics & Anti-Infectives", shortName: "Antibiotics",  slug: "antibiotics",     description: "Anti bacterial & anti-infective medicines",   presences: 20, usedIn: "20 Presences", status: "Active" },
                { icon: "Activity", therapy: "Gastro",                        shortName: "Gastro",       slug: "gastro",          description: "Gastrointestinal health & digestive care",    presences: 18, usedIn: "18 Presences", status: "Active" },
                { icon: "Heart",    therapy: "Cardiac / Diabetic",            shortName: "Cardiac",      slug: "cardiac-diabetic",description: "Cardiovascular & diabetic care",              presences: 14, usedIn: "14 Presences", status: "Active" },
                { icon: "Wind",     therapy: "Respiratory",                   shortName: "Respiratory",  slug: "respiratory",     description: "Respiratory & breathing disorders",           presences: 16, usedIn: "16 Presences", status: "Active" },
                { icon: "Layers",   therapy: "Orthopedic",                    shortName: "Orthopedic",   slug: "orthopedic",      description: "Bone, joint & muscle care",                  presences: 15, usedIn: "15 Presences", status: "Active" },
                { icon: "Smile",    therapy: "Pediatric",                     shortName: "Pediatric",    slug: "pediatric",       description: "Child healthcare & pediatric medicines",      presences: 12, usedIn: "12 Presences", status: "Active" },
                { icon: "Cpu",      therapy: "Multivitamins",                 shortName: "Multivitamins",slug: "multivitamins",   description: "Nutritional supplements & vitamins",         presences: 10, usedIn: "10 Presences", status: "Active" },
                { icon: "Sun",      therapy: "Dermatology",                   shortName: "Dermatology",  slug: "dermatology",     description: "Skin care & dermatological treatments",      presences: 8,  usedIn: "8 Presences",  status: "Active" }
            ]);
            console.log("💊 Initial therapies seeded successfully.");
        }

        // Seed initial presences
        const presenceCount = await Presence.countDocuments();
        if (presenceCount === 0) {
            await Presence.insertMany([
                { name: "Delhi",      state: "Delhi",       region: "North Region", partners: 12, therapies: ["Antibiotics", "Gastro", "Cardiac / Diabetic"], isHq: true,  status: "Active" },
                { name: "Mumbai",     state: "Maharashtra", region: "West Region",  partners: 18, therapies: ["Antibiotics", "Respiratory", "Dermatology"],   isHq: true,  status: "Active" },
                { name: "Chandigarh", state: "Chandigarh",  region: "North Region", partners: 6,  therapies: ["Orthopedic", "Pediatric"],                     isHq: false, status: "Active" },
                { name: "Ludhiana",   state: "Punjab",      region: "North Region", partners: 8,  therapies: ["Antibiotics", "Multivitamins"],                isHq: false, status: "Active" },
                { name: "Jaipur",     state: "Rajasthan",   region: "West Region",  partners: 7,  therapies: ["Gastro", "Dermatology"],                       isHq: false, status: "Active" },
                { name: "Bangalore",  state: "Karnataka",   region: "South Region", partners: 15, therapies: ["Cardiac / Diabetic", "Respiratory", "Gastro"], isHq: true,  status: "Active" },
                { name: "Chennai",    state: "Tamil Nadu",  region: "South Region", partners: 11, therapies: ["Antibiotics", "Pediatric", "Orthopedic"],       isHq: false, status: "Active" },
                { name: "Kolkata",    state: "West Bengal", region: "East Region",  partners: 9,  therapies: ["Gastro", "Multivitamins", "Dermatology"],       isHq: false, status: "Active" }
            ]);
            console.log("🏙️ Initial presences seeded successfully.");
        }

    } catch (error) {
        console.error(`❌ DB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;