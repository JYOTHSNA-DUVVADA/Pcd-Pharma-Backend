import express from "express";
import { createTherapy, deleteTherapy, listTherapies, updateTherapy } from "../controllers/TherapyController.js";
import { protect } from "../middleware/authMiddleware.js";

const therapyrouter = express.Router();

therapyrouter.post('/create', protect, createTherapy);
therapyrouter.put('/update/:id', protect, updateTherapy);
therapyrouter.delete('/delete/:id', protect, deleteTherapy);
therapyrouter.get('/get', protect, listTherapies);

export default therapyrouter;
