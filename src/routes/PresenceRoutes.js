import express from "express";
import { createPresence, deletePresence, listPresences, updatePresence } from "../controllers/PresenceController.js";
import { protect } from "../middleware/authMiddleware.js";

const presencerouter = express.Router();

presencerouter.post('/create', protect, createPresence);
presencerouter.put('/update/:id', protect, updatePresence);
presencerouter.delete('/delete/:id', protect, deletePresence);
presencerouter.get('/get', protect, listPresences);

export default presencerouter;
