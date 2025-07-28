import express from "express";
import { saveOrUpdateUser } from "../controllers/userController";


const router = express.Router();

router.post("/", saveOrUpdateUser);

export default router;
