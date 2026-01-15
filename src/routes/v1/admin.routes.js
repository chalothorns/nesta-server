import { Router } from "express";
import { getAdminUsers, getMe, registerAdmin } from "../../modules/admin/admin.controller.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authAdmin } from "../../middlewares/auth.js";
import { Admin } from "../../modules/admin/admin.model.js";

export const router = Router()

router.get("/", getAdminUsers);

//เช็ค token
router.get("/auth/cookie/me", authAdmin, async (req , res, next) => {
    try{
        const userId = req.userId

        const adminUser = await Admin.findById(userId)

        if(!adminUser){
            return res.status(401).json({
                error: true,
                message: "Unauthenticated"
            })
        }

        res.status(200).json({
            error: false,
            user:{
                _id: adminUser._id,
                username: adminUser.username,
                email: adminUser.email,
                role:adminUser.role,
            }
        })
        }catch(error){
        next(error);

    }
});

router.get("/me", authAdmin, getMe)

router.post("/register", registerAdmin);

//มีเพื่อยืนยันสิทธิ์+ดึงข้อมูลปัจจุบันโชว์ดึงแม้เว็บจะถูกรีเฟรช สิทธิ์การเข้าถึงจะไม่หายไป
router.post("/auth/cookie/login", async (req, res, next) => { 
    const {email, password}= req.body;

    if(!email || !password){
        return res.status(400).json({
            error: true,
            message: "Email and Password are required...",
        });
    }

    try {
        
        const normalizedEmail = String(email).trim().toLowerCase();
        //หาของใน Admin(DB) ที่เป็น email ที่ตรงกับ normalizedEmail + return password ของ email นั้นออกมา
        const adminUser = await Admin.findOne({email: normalizedEmail}).select("+password");

        if(!adminUser){
            return res.status(401).json({
                error: true,
                message: "User not found...",
            });
        }
        //bcrypt จะมีเครื่องมือที่สามารถไปเอา password ที่ login มา กับ password ใน DB(password mี่เข้าระหสั) มาเปรียบเทียบกัน
        const isMatched = await bcrypt.compare(password, adminUser.password);

        if(!isMatched){
            return res.status(401).json({
                error: true,
                message: "Invalid password...",
            });
        }

        //Generate JSON Web Token เรากำหนด payload = id + JWT_SECRET
        //header กำหนดไม่ได้  ส่วนตรงนี้คือ payload(เรากำหนด) userId: adminUser._id, role: adminUser.role และJWT_SECRET = signature
            
        const token = jwt.sign({
            userId: adminUser._id,
            role: adminUser.role
        }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        const isProd = process.env.NODE_ENV  === "production"

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            path: "/",
            maxAge: 60 * 60 * 1000, //1 hour
        });

        res.status(200).json({
            error: false,
            message: "Login successful!",
            user: {
                _id: adminUser._id,
                username: adminUser.username,
                email: adminUser.email,
                role: adminUser.role,
            },
        });

    } catch (error) {
        next(error);
    }

 });

 //Logout a user
router.post("/auth/cookie/logout", (req, res) => {
    const isProd = process.env.NODE_ENV === "production";

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/",
    });

    res.status(200).json({
        error: false,
        message:"Logged out successfully!",
    });
});


