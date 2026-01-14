import { Tenant } from "./tenants.model.js";

export const getTenant = async (req, res) => {
  const {id} = req.params
  try {
    const doc = await Tenant.findById(id)

    if(!doc){
      return res.status(404).json({
        success:false,
        error: "ไม่พบข้อมูลผู้เช่า",
      });
    }

    return res.status(200).json({
      success: true,
      data: doc
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error:"โหลดข้อมูลไม่สำเร็จ กรุณารีเฟรชหน้าจออีกครั้ง"
    });
    
  }
};

export const getTenants = async (req, res) => {
    try{
     const tenants = await Tenant.find()
     return res.status(200).json({
      success: true,
      data: tenants
     })
    } catch(error){
      return res.status(500).json({
        success: false,
        error: "เซิร์ฟเวอร์ขัดข้อง กรุณาลองใหม่อีกครั้ง",
      });
    }
};

export const deleteTenant = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Tenant.findByIdAndDelete(id)

    if(!deleted){
      return res.status(404).json({
        success: false,
        error:"ไม่พบผู้ใช้งาน",
      })
    }

    return res.status(200).json({
      success: true,
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error:"เกิดข้อผิดพลาดในการลบข้อมูล กรุณาลองใหม่อีกครั้ง"
    })
    
  }

};    

export const createTenant = async (req, res, next) => {
    const { title, name, phone,idCardNumber,contractStartDate,currentAddress, ...others } = req.body;

     if (!title || !name || !phone || !idCardNumber || !contractStartDate || !currentAddress) {
    return res.status(400).json({
      success: false,
      error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน: คำนำหน้า, ชื่อ, เบอร์โทร, เลขบัตร, วันเริ่มสัญญา และที่อยู่"
    });      
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

export const updateTenant = async (req, res) => { 
  const {id} = req.params
  const body = req.body;

  try {
    const updated = await Tenant.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });

    if(!updated){
      return res.status(404).json({
        success: false,
        error: "ไม่พบข้อมูลผู้เช่า"
      });
    }
    return res.status(200).json({
      success: true,
      data: updated,
    })
  } catch (error) {
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
 }