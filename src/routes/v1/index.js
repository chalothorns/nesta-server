import { Router } from "express";
import {router as usersRoutes} from "./users.routes.js";
import {router as adminRoutes} from "./admin.routes.js";

export const router = Router();

router.use("/tenants", usersRoutes);
router.use("/admin", adminRoutes);
