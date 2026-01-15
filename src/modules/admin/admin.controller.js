import { Admin } from "./admin.model.js";


export const getMe = async (req, res, next) => {
  try {
    // req.userId มาจาก Middleware ที่ถอดรหัส Token
    const admin = await Admin.findById(req.userId); 
    if (!admin) return next(new Error("Admin not found"));

    res.status(200).json({         
    success: true, 
    data: {
    username: admin.username,
    email: admin.email,
    role: admin.role
        }
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminUsers = async (req, res, next) => {
  try {
    //การใส่เครื่องหมายลบ (-) หน้าชื่อฟิลด์ในคำสั่ง .select() ของ Mongoose เป็นสัญลักษณ์ที่ใช้บอกว่า "ไม่เอา" (Exclude) หรือให้ "ตัดฟิลด์นี้ออก
    const allAdminUsers = await Admin.find().select("-password");

    return res.status(200).json({
      success: true,
      data: allAdminUsers,
    });
  } catch (error) {
    // error.name = error.name || "DatabaseError";
    // error.status = 500; ใส่หรือไม่ก็ได้
    return next(error);
  }
};


export const registerAdmin = async (req, res, next) => {
    const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    const error = new Error("username, email, and password are required");
    error.name = "ValidationError";
    error.status = 400;
    return next(error);
  }

  try {
    const doc = await Admin.create({ username, email, password, role });
    const safe = doc.toObject();
    delete safe.password;

    return res.status(201).json({
      success: true,
      data: safe,
    });
  } catch (error) {
    if (error.code === 11000) {
      error.status = 409;
      error.name = "DuplicateKeyError";
      error.message = "Email already in use";
    }

    error.status = 500;
    error.name = error.name || "DatabaseError";
    error.message = error.message || "Failed to create a user";
    return next(error);
  
}
};
