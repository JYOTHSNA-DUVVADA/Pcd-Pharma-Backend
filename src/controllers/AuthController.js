import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
            { expiresIn: "1d" }
        );

        // 🍪 SEND TOKEN IN COOKIE
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,       // Required for cross-origin cookies (HTTPS)
            sameSite: "none",   // Required for cross-origin cookies (different domains)
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

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

        // 1. check if admin exists
        const admin = await Admin.findOne({ user_id });

        if (!admin) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID or password"
            });
        }

        // 2. compare password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID or password"
            });
        }

        // 3. create JWT token
        const token = jwt.sign(
            {
                id: admin._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // 4. send token in cookie 🍪
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,       // Required for cross-origin cookies (HTTPS)
            sameSite: "none",   // Required for cross-origin cookies (different domains)
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // 5. response
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
        // req.admin comes from middleware (JWT decoded)
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
            secure: true,
            sameSite: "none",
            expires: new Date(0) // instantly expire cookie
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