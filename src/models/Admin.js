import mongoose from "mongoose";

const passwordRegex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

const adminSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
        validate: {
            validator: function (value) {
                return passwordRegex.test(value);
            },
            message:
              "Password must contain uppercase, lowercase, number, and special character"
        }
    },

    isActive: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
});

export default mongoose.model("Admin", adminSchema);