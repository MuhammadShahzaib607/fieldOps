import express from "express"
import { getAllUsers, getMe, login, signup, updateUserStatus } from "../controllers/userControllers.js";
import { verifyToken } from "../utils/verifyToken.js";
import { verifyAdmin } from "../utils/roleMiddlewares.js";

const router = express.Router()

router.post('/signup', signup);
router.post('/login', login);
router.get('/get-me', verifyToken, getMe);
// Admin Routes 
router.get('/all-users', verifyToken, verifyAdmin, getAllUsers);
router.put('/update-status', verifyToken, verifyAdmin, updateUserStatus);

export default router;