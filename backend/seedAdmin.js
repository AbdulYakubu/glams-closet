// seedAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import userModel from "./models/userModel.js"; // Adjust this if the path is different

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB with proper URI from the .env file
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Check if the admin already exists
    const existingAdmin = await userModel.findOne({ email: "admin@glamscloset.com" });
    if (existingAdmin) {
      console.log("Admin already exists.");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("Admin7319", 10);

    // Create new admin user
    const admin = new userModel({
      name: "Admin",
      email: "admin@glamscloset.com",
      password: hashedPassword,
      isAdmin: true,
    });

    // Save admin to the database
    await admin.save();
    console.log("✅ Admin user created!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

seedAdmin();
