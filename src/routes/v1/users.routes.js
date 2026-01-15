import { Router } from "express";
import { createTenant, deleteTenant, getTenant, getTenants, updateTenant} from "../../modules/tenants/tenants.controller.js";
import { authAdmin } from "../../middlewares/auth.js";

export const router = Router()


//จำเป็นต้องรับ req, res ทุกครั้งถงึแม้จะใช้หรือไม่ก็ตาม

router.get("/:id", authAdmin, getTenant);

router.get("/", authAdmin, getTenants);

router.post("/", authAdmin, createTenant);

// The function inside is called Route Handler / Controller
router.delete("/:id", authAdmin, deleteTenant);

router.patch("/:id", authAdmin, updateTenant);