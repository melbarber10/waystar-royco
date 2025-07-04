import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const dhSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  department: { type: String, required: true },
  image: { type: String },
  leaves: [{ type: mongoose.Schema.Types.ObjectId, ref: "Leave" }]
}, { timestamps: true });

dhSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

dhSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Dh = mongoose.model('Dh', dhSchema);
export default Dh;
