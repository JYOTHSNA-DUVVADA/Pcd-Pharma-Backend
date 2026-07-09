import mongoose from "mongoose";

const networkSchema = new mongoose.Schema(
{
    // Partner name
    name: {
        type: String,
        required: true,
        trim: true
    },

    // Network Type (e.g. Stockist, Retailer)
    type: {
        type: String,
        required: true,
        enum: ["Stockist", "Retailer"],
        default: "Stockist"
    },

    // Contact name
    contactPerson: {
        type: String,
        required: true,
        trim: true
    },

    // Contact Representative's Role
    contactRole: {
        type: String,
        trim: true,
        default: ""
    },

    // Phone
    phone: {
        type: String,
        required: true,
        trim: true
    },

    // Therapy
    therapy: {
        type: String,
        required: true,
        trim: true
    },

    // Location / region
    region: {
        type: String,
        required: true,
        trim: true
    },

    // Date Since Active (string "YYYY-MM-DD" from frontend)
    dateSinceActive: {
        type: String,
        required: true
    },

    // Status
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    }
},
{
    timestamps: true
});

export default mongoose.model("Network", networkSchema);
