import mongoose from "mongoose";

export const dbConnect = (db_url) => {
  mongoose.connect(db_url).then((mongo_connection) => {
    console.log(
      `Connected to MongoDB on Host ${mongo_connection.connection.host}`
    );
  });
};
