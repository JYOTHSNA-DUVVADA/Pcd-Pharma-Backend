import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
{
    user_id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

export default mongoose.model("Admin", adminSchema);