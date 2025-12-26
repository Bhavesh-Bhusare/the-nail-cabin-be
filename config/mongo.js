import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function mongoConnection() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    console.log(" Connecting to MongoDB...");

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASS,
        retryWrites: true,
        w: "majority",
      })
      .then((mongoose) => {
        console.log(" MongoDB Connected");
        return mongoose;
      })
      .catch((error) => {
        console.error(" MongoDB Connection Error:", error.message);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
