import { Router } from "express";
import { createTenant, deleteTenant, getTenant, getTenants, updateTenant} from "../../modules/tenants/tenants.controller.js";

export const router = Router()


//จำเป็นต้องรับ req, res ทุกครั้งถงึแม้จะใช้หรือไม่ก็ตาม

router.get("/:id", getTenant);

router.get("/", getTenants);

router.post("/", createTenant);

// The function inside is called Route Handler / Controller
router.delete("/:id", deleteTenant);

router.patch("/:id", updateTenant);