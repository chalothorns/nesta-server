import mongoose from "mongoose";

// a data model is create from a data schema

const tenantSchema = new mongoose.Schema(
  {
    title: { type: String, enum: ["นาย", "นาง", "นางสาว"], required: true },
    name: { type: String, required: true},
    nickname: { type: String},
    phone: { type: String, required: true},
    idCardNumber: { type: String, required: true},
    birthDate: { type: Date},
    contractStartDate: { type: Date, required: true},
    depositAmount: { type: Number},
    currentAddress: { type: String, required: true},
    
    email: { type: String, lowercase: true, trim: true},
    facebook: { type: String},
    lineId: { type: String},
    workplace: { type: String},
    department: { type: String},
    position: { type: String},
    
    emergencyContactName: { type: String},
    emergencyContactPhone: { type: String},
    emergencyContactRelationship: { type: String},
    
    vehicleType: { type: String},
    licensePlate: { type: String},
    vehicleDetails: { type: String},
    profile: { type: String, default: "man" },
    
  },
  {
    timestamps: true,
  }
);


//mongodb will automatically create tenants collection
//ตัวแปรที่เป็น class ใช้ pascal case
export const Tenant = mongoose.model("Tenant", tenantSchema)