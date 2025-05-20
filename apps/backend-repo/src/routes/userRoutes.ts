import { API_ENDPOINTS } from "@repo/shared-types/constants";
import { Router } from "express";
import { UserController } from "../controller/api";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const userController = UserController.getInstance();

router.get(API_ENDPOINTS.FETCH_USER, authMiddleware, userController.fetchUserDataController);
router.put(API_ENDPOINTS.UPDATE_USER, authMiddleware, userController.updateUserDataController);

export default router;