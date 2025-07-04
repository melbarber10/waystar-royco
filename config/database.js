import mongoose from "mongoose";

const url = process.env.MONGODB_URI || "mongodb://localhost:27017/waystar_royco_db";

const connectDb = async () => {
    try {
        await mongoose.connect(url);
        console.log("MongoDB is Connected Successfully");
    } catch (err) {
        console.error("MongoDB Connection Error:", err.message);
        process.exit(1); // Exit if cannot connect to database
    }
};

export default connectDb;