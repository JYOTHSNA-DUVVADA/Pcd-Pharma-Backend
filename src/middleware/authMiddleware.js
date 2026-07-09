import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    try {
        let token = req.cookies.token;

        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader?.startsWith("Bearer ")) {
                token = authHeader.slice(7);
            }
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token found"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.admin = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};