import Therapy from "../models/Therapy.js";
import mongoose from "mongoose";

// Create therapy
export const createTherapy = async (req, res) => {
    try {
        const { icon, therapy, shortName, slug, description, presences, status } = req.body;

        if (!therapy || !therapy.trim()) {
            return res.status(400).json({ success: false, message: "Therapy name is required." });
        }
        if (!shortName || !shortName.trim()) {
            return res.status(400).json({ success: false, message: "Short name is required." });
        }
        if (!slug || !slug.trim()) {
            return res.status(400).json({ success: false, message: "Slug is required." });
        }

        // Duplicate check
        const existing = await Therapy.findOne({
            $or: [
                { therapy: { $regex: new RegExp(`^${therapy.trim()}$`, "i") } },
                { slug: slug.trim().toLowerCase() }
            ]
        });
        if (existing) {
            return res.status(409).json({ success: false, message: "Therapy or slug already exists." });
        }

        const usedIn = `${presences || 0} Presences`;

        const newTherapy = await Therapy.create({
            icon: icon || "Shield",
            therapy: therapy.trim(),
            shortName: shortName.trim(),
            slug: slug.trim().toLowerCase(),
            description: description?.trim() || "",
            presences: presences || 0,
            usedIn,
            status: status || "Active"
        });

        return res.status(201).json({ success: true, message: "Therapy created successfully.", data: newTherapy });

    } catch (error) {
        console.error("Create Therapy Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Update therapy
export const updateTherapy = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Therapy ID." });
        }

        const therapy = await Therapy.findById(id);
        if (!therapy) {
            return res.status(404).json({ success: false, message: "Therapy not found." });
        }

        const { icon, therapy: therapyName, shortName, slug, description, presences, status } = req.body;

        // Duplicate name/slug check (excluding self)
        if (therapyName || slug) {
            const query = { _id: { $ne: id }, $or: [] };
            if (therapyName) query.$or.push({ therapy: { $regex: new RegExp(`^${therapyName.trim()}$`, "i") } });
            if (slug) query.$or.push({ slug: slug.trim().toLowerCase() });
            if (query.$or.length > 0) {
                const dup = await Therapy.findOne(query);
                if (dup) {
                    return res.status(409).json({ success: false, message: "Therapy name or slug already exists." });
                }
            }
        }

        if (icon !== undefined) therapy.icon = icon;
        if (therapyName !== undefined) therapy.therapy = therapyName.trim();
        if (shortName !== undefined) therapy.shortName = shortName.trim();
        if (slug !== undefined) therapy.slug = slug.trim().toLowerCase();
        if (description !== undefined) therapy.description = description.trim();
        if (presences !== undefined) {
            therapy.presences = presences;
            therapy.usedIn = `${presences} Presences`;
        }
        if (status !== undefined) therapy.status = status;

        await therapy.save();

        return res.status(200).json({ success: true, message: "Therapy updated successfully.", data: therapy });

    } catch (error) {
        console.error("Update Therapy Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Delete therapy
export const deleteTherapy = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Therapy ID." });
        }

        const therapy = await Therapy.findById(id);
        if (!therapy) {
            return res.status(404).json({ success: false, message: "Therapy not found." });
        }

        await Therapy.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: "Therapy deleted successfully." });

    } catch (error) {
        console.error("Delete Therapy Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// List therapies
export const listTherapies = async (req, res) => {
    try {
        const search = req.query.search || "";
        const status = req.query.status || "";

        let filter = {};
        if (search) filter.therapy = { $regex: search, $options: "i" };
        if (status) filter.status = status;

        const therapies = await Therapy.find(filter).sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: therapies });

    } catch (error) {
        console.error("List Therapies Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
