import { Tenant } from "./tenants.model.js";

export const getTenant = async (req, res, next) => {
  const {id} = req.params
  try {
    const doc = await Tenant.findById(id)

    if(!doc){
      const error = new Error("User not found");
      return next(error);
    }

    return res.status(200).json({
      success: true,
      data: doc
    });
  } catch (error) {
    error.status = 500;
    error.name = error.name || "DatabaseError";
    error.message = error.message || "Failed to get a user";
    return next(error);
    
  }
};

export const getTenants = async (req, res, next) => {
    try{
     const tenants = await Tenant.find()
     return res.status(200).json({
      success: true,
      data: tenants
     })
    } catch(error){
      return next(error);
    }
};

export const deleteTenant = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deleted = await Tenant.findByIdAndDelete(id)

    if(!deleted){
      const error = new Error("User not found");
      return next(error);
    }

    return res.status(200).json({
      success: true,
      data: null,
    });
  } catch (error) {
    return next(error);
    
  }

};    

export const createTenant = async (req, res, next) => {
    const { title, name, phone,idCardNumber,contractStartDate,currentAddress, ...others } = req.body;

     if (!title || !name || !phone || !idCardNumber || !contractStartDate || !currentAddress) {
    const error = new Error("All field are required");
    error.name = "ValidationError";
    error.status = 400;

    return next();   
  };
  try {
    const doc = await Tenant.create({ title, name, phone,idCardNumber,contractStartDate,currentAddress, ...others });

    return res.status(201).json({
      success: true,
      message: "เพิ่มข้อมูลผู้เช่าเรียบร้อยแล้ว",
      data: doc
    });
  } catch (error) {
    // กรณีข้อมูลซ้ำ (เช่น Email หรือ ID Card ที่ตั้ง unique ไว้)
    if (error.code === 11000) {
      error.status = 409;
      error.name = "DuplicateKeyError";
      error.message = "อีเมล หรือ เลขบัตรประชาชนนี้มีอยู่ในระบบแล้ว";
    }

    error.status = 500;
    error.name = error.name || "DatabaseError";
    error.message = error.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูลผู้เช่า";
    return next(error)
  
}
};

export const updateTenant = async (req, res, next) => { 
  const {id} = req.params
  const body = req.body;

  try {
    const updated = await Tenant.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });

    if(!updated){
      const error = new Error("User not found...");
      return next(error);
    }
    return res.status(200).json({
      success: true,
      data: updated,
    })
  } catch (error) {
     if (error.code === 11000) {
      return next(error);
    }

    return next(error);

  }
 }