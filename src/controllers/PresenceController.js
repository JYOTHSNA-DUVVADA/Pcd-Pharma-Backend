import Presence from "../models/Presence.js";
import mongoose from "mongoose";

// Create presence
export const createPresence = async (req, res) => {
    try {
        const { name, state, region, partners, therapies, isHq, status } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: "City name is required." });
        }

        const newPresence = await Presence.create({
            name: name.trim(),
            state: state?.trim() || "",
            region: region?.trim() || "",
            partners: partners || 0,
            therapies: Array.isArray(therapies) ? therapies : [],
            isHq: isHq || false,
            status: status || "Active"
        });

        return res.status(201).json({ success: true, message: "Presence created successfully.", data: newPresence });

    } catch (error) {
        console.error("Create Presence Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Update presence
export const updatePresence = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Presence ID." });
        }

        const presence = await Presence.findById(id);
        if (!presence) {
            return res.status(404).json({ success: false, message: "Presence not found." });
        }

        const { name, state, region, partners, therapies, isHq, status } = req.body;

        if (name !== undefined) presence.name = name.trim();
        if (state !== undefined) presence.state = state.trim();
        if (region !== undefined) presence.region = region.trim();
        if (partners !== undefined) presence.partners = partners;
        if (therapies !== undefined) presence.therapies = Array.isArray(therapies) ? therapies : [];
        if (isHq !== undefined) presence.isHq = isHq;
        if (status !== undefined) presence.status = status;

        await presence.save();

        return res.status(200).json({ success: true, message: "Presence updated successfully.", data: presence });

    } catch (error) {
        console.error("Update Presence Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Delete presence
export const deletePresence = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Presence ID." });
        }

        const presence = await Presence.findById(id);
        if (!presence) {
            return res.status(404).json({ success: false, message: "Presence not found." });
        }

        await Presence.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: "Presence deleted successfully." });

    } catch (error) {
        console.error("Delete Presence Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// List presences
export const listPresences = async (req, res) => {
    try {
        const search = req.query.search || "";
        const status = req.query.status || "";

        let filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { state: { $regex: search, $options: "i" } },
                { region: { $regex: search, $options: "i" } }
            ];
        }
        if (status) filter.status = status;

        const presences = await Presence.find(filter).sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: presences });

    } catch (error) {
        console.error("List Presences Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
