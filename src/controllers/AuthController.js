import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Detect production based on CLIENT_URL env var (reliable on Render without needing NODE_ENV set)
const isProduction = () => process.env.CLIENT_URL?.startsWith("https://");

// Shared cookie options factory
const cookieOptions = () => ({
    httpOnly: true,
    secure: isProduction(),
    sameSite: isProduction() ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

export const registerAdmin = async (req, res) => {
    try {
        const { user_id, password } = req.body;

        const existingAdmin = await Admin.findOne({ user_id });

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Admin already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await Admin.create({
            user_id,
            password: hashedPassword
        });

        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" } // Matches cookie maxAge
        );

        res.cookie("token", token, cookieOptions());

        res.status(201).json({
            success: true,
            message: "Admin registered successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



export const loginAdmin = async (req, res) => {
    try {
        const { user_id, password } = req.body;

        // 1. Check if admin exists
        const admin = await Admin.findOne({ user_id });

        if (!admin) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID or password"
            });
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID or password"
            });
        }

        // 3. Create JWT token (7d — must match cookie maxAge)
        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 4. Send token in cookie
        res.cookie("token", token, cookieOptions());

        // 5. Response
        res.status(200).json({
            success: true,
            message: "Login successful"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



export const getAdmin = async (req, res) => {
    try {
        const adminId = req.admin?.id;

        const admin = await Admin.findById(adminId).select("-password");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        res.status(200).json({
            success: true,
            data: admin
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const logoutAdmin = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: isProduction(),
            sameSite: isProduction() ? "none" : "lax",
            expires: new Date(0) // Expire immediately
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const checkAuth = async (req, res) => {
    try {
        const adminId = req.admin.id;

        const admin = await Admin.findById(adminId).select("-password");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        res.status(200).json({
            success: true,
            data: admin
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};