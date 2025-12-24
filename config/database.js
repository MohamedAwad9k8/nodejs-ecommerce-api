import mongoose from "mongoose";

export const dbConnect = async (db_url) => {
  try {
    const mongo_connection = await mongoose.connect(db_url);
    console.log(
      `Connected to MongoDB on Host ${mongo_connection.connection.host}`
    );
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};
