import express from "express";
import { checkAuth, getAdmin, loginAdmin, logoutAdmin, registerAdmin } from "../controllers/AuthController.js";
import { protect } from "../middleware/authMiddleware.js";

const authrouter = express.Router();

// 🔐 Register Admin
authrouter.post("/register", registerAdmin);

authrouter.post('/login', loginAdmin)

authrouter.get('/getadmin',protect,getAdmin)


authrouter.post("/logout", logoutAdmin);


authrouter.get("/me", protect, checkAuth);



export default authrouter;