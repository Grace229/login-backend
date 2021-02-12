import { Router } from "express";
import authRoutes from "./auth.routes";

const router = new Router();

router.use("/v1", authRoutes);

export default router;