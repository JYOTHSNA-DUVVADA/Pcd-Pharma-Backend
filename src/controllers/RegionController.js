import Region from "../models/Region.js";
import mongoose from "mongoose";

export const createRegion = async (req, res) => {
    try {
        const { name, description, statesList, status } = req.body;

        // Required field validation
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Region name is required."
            });
        }

        // Validate states List
        if (!statesList || !Array.isArray(statesList) || statesList.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please select at least one state."
            });
        }

        // Check duplicate region (case-insensitive)
        const existingRegion = await Region.findOne({
            name: { $regex: new RegExp(`^${name.trim()}$`, "i") }
        });

        if (existingRegion) {
            return res.status(409).json({
                success: false,
                message: "Region already exists."
            });
        }

        // Remove duplicate states if any
        const uniqueStates = [...new Set(statesList.map(state => state.trim()))];

        // Create region
        const region = await Region.create({
            name: name.trim(),
            description: description?.trim() || "",
            statesList: uniqueStates,
            status: status || "Active"
        });

        return res.status(201).json({
            success: true,
            message: "Region created successfully.",
            data: region
        });

    } catch (error) {
        console.error("Create Region Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


//update region

export const updateRegion = async (req, res) => {
    try {

        const { id } = req.params;
        const { name, description, statesList, status } = req.body;

        // Check if region exists
        const region = await Region.findById(id);

        if (!region) {
            return res.status(404).json({
                success: false,
                message: "Region not found."
            });
        }

        // Check duplicate name (excluding current region)
        if (name) {
            const existingRegion = await Region.findOne({
                _id: { $ne: id },
                name: { $regex: new RegExp(`^${name.trim()}$`, "i") }
            });

            if (existingRegion) {
                return res.status(409).json({
                    success: false,
                    message: "Region name already exists."
                });
            }
        }

        // Validate statesList if provided
        if (statesList) {

            if (!Array.isArray(statesList) || statesList.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Please select at least one state."
                });
            }

            region.statesList = [...new Set(statesList.map(state => state.trim()))];
        }

        // Update fields only if provided
        if (name) region.name = name.trim();

        if (description !== undefined)
            region.description = description.trim();

        if (status)
            region.status = status;

        await region.save();

        return res.status(200).json({
            success: true,
            message: "Region updated successfully.",
            data: region
        });

    } catch (error) {

        console.log(error)
        console.error("Update Region Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


//delete region

export const deleteRegion = async (req, res) => {
    try {

        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Region ID"
            });
        }

        // Check if region exists
        const region = await Region.findById(id);

        if (!region) {
            return res.status(404).json({
                success: false,
                message: "Region not found."
            });
        }

        // Delete region
        await Region.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Region deleted successfully."
        });

    } catch (error) {

        console.error("Delete Region Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// list regions

export const listRegions = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const status = req.query.status || "";

        const skip = (page - 1) * limit;

        let filter = {};

        // Search by region name
        if (search) {
    filter.name = {
        $regex: search,
        $options: "i"
    };
}

if (status) {
    filter.status = status;
}

        // Total count
        const totalRegions = await Region.countDocuments(filter);

        // Fetch regions
        const regions = await Region.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(totalRegions / limit),
            totalRegions,
            data: regions
        });

    } catch (error) {

        console.error("List Region Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};