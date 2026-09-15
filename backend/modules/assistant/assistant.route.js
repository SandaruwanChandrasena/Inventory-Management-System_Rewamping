import { Router } from "express";
import { chatWithAssistant } from "./assistant.controller.js";
import requireAuth from "../../middleware/auth.middleware.js";
import authorizeRoles from "../../middleware/role.middleware.js";

const router = Router();

router.post("/chat", requireAuth, authorizeRoles("admin"), chatWithAssistant);

export default router;