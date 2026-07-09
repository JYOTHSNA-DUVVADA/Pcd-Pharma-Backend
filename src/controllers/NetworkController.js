import Network from "../models/Network.js";
import mongoose from "mongoose";

// Create network partner
export const createNetwork = async (req, res) => {
    try {
        const { name, type, contactPerson, contactRole, phone, therapy, region, dateSinceActive, status } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: "Partner name is required." });
        }
        if (!contactPerson || !contactPerson.trim()) {
            return res.status(400).json({ success: false, message: "Contact person name is required." });
        }
        if (!phone || !phone.trim()) {
            return res.status(400).json({ success: false, message: "Phone number is required." });
        }
        if (!region || !region.trim()) {
            return res.status(400).json({ success: false, message: "Region location is required." });
        }

        const newNetwork = await Network.create({
            name: name.trim(),
            type: type || "Stockist",
            contactPerson: contactPerson.trim(),
            contactRole: contactRole?.trim() || "",
            phone: phone.trim(),
            therapy: therapy?.trim() || "Cardio",
            region: region.trim(),
            dateSinceActive: dateSinceActive || new Date().toISOString().split("T")[0],
            status: status || "Active"
        });

        return res.status(201).json({ success: true, message: "Network partner created successfully.", data: newNetwork });

    } catch (error) {
        console.error("Create Network Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Update network partner
export const updateNetwork = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Network ID." });
        }

        const network = await Network.findById(id);
        if (!network) {
            return res.status(404).json({ success: false, message: "Network partner not found." });
        }

        const { name, type, contactPerson, contactRole, phone, therapy, region, dateSinceActive, status } = req.body;

        if (name !== undefined) network.name = name.trim();
        if (type !== undefined) network.type = type;
        if (contactPerson !== undefined) network.contactPerson = contactPerson.trim();
        if (contactRole !== undefined) network.contactRole = contactRole.trim();
        if (phone !== undefined) network.phone = phone.trim();
        if (therapy !== undefined) network.therapy = therapy.trim();
        if (region !== undefined) network.region = region.trim();
        if (dateSinceActive !== undefined) network.dateSinceActive = dateSinceActive;
        if (status !== undefined) network.status = status;

        await network.save();

        return res.status(200).json({ success: true, message: "Network partner updated successfully.", data: network });

    } catch (error) {
        console.error("Update Network Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Delete network partner
export const deleteNetwork = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Network ID." });
        }

        const network = await Network.findById(id);
        if (!network) {
            return res.status(404).json({ success: false, message: "Network partner not found." });
        }

        await Network.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: "Network partner deleted successfully." });

    } catch (error) {
        console.error("Delete Network Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// List network partners (with search and status filter)
export const listNetworks = async (req, res) => {
    try {
        const search = req.query.search || "";
        const status = req.query.status || "";

        let filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { contactPerson: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { therapy: { $regex: search, $options: "i" } },
                { region: { $regex: search, $options: "i" } }
            ];
        }
        if (status) filter.status = status;

        const networks = await Network.find(filter).sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: networks });

    } catch (error) {
        console.error("List Networks Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
