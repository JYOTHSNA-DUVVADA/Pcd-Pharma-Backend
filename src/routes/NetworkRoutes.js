import express from "express";
import { createNetwork, deleteNetwork, listNetworks, updateNetwork } from "../controllers/NetworkController.js";
import { protect } from "../middleware/authMiddleware.js";

const networkrouter = express.Router();

networkrouter.post('/create', protect, createNetwork);
networkrouter.put('/update/:id', protect, updateNetwork);
networkrouter.delete('/delete/:id', protect, deleteNetwork);
networkrouter.get('/get', protect, listNetworks);

export default networkrouter;
