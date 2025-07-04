import { Schema, model } from "mongoose";

const leaveSchema = new Schema({
  reason: { type: String, required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  days: { type: Number, required: true },
  leaveType: { type: String, required: true },
  subject: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "denied"], default: "pending" },
  finalStatus: { type: String, enum: ["pending", "approved", "denied"], default: "pending" },
  approved: { type: Boolean, default: false },
  denied: { type: Boolean, default: false },
  approvedBy: { type: Schema.Types.ObjectId, ref: "DH" },
  approvedAt: { type: Date },
  rejectedBy: { type: Schema.Types.ObjectId, ref: "DH" },
  rejectedAt: { type: Date },
  employeeLeave: { type: Schema.Types.ObjectId, ref: "Employee", required: true }
}, { 
  timestamps: true,
  validateBeforeSave: false // This will prevent validation on updates
});

const Leave = model('Leave', leaveSchema);
export default Leave;
