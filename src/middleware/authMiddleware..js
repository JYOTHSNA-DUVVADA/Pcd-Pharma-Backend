import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    try {
        const token = req.cookies.token;

        console.log("TOKEN:", token); // DEBUG

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token found"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("DECODED:", decoded); // DEBUG

        req.admin = decoded; // 👈 THIS MUST EXIST

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};