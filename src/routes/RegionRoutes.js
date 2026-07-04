import express from "express";
import { createRegion, deleteRegion, listRegions, updateRegion } from "../controllers/RegionController.js";
import { protect } from "../middleware/authMiddleware.js";
const regionrouter = express.Router();

regionrouter.post('/create',protect,createRegion)
regionrouter.put('/update/:id',protect,updateRegion)
regionrouter.delete('/delete/:id',protect,deleteRegion)
regionrouter.get('/get',protect,listRegions)

export default regionrouter;