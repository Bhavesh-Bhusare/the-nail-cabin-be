// Import Packages
import mongoose from "mongoose";

// Establish Connection to MongoDB Server
mongoose
  .connect(process.env.MONGO_URI, {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    retryWrites: true,
    w: "majority",
  })
  .catch(async (error) => {
    console.log({
      name: error?.name || "",
      message: `Uncaught Exception Occurred\n${error?.message || ""}`,
      stack: error?.stack || {},
    });

    process.exit(0);
  });

// Create connection Object & Listen for Events
const mongoConnection = mongoose.connection;

mongoConnection.on("connected", async () => {
  console.log({
    message: "Application Connected to MongoDB Server.",
    meta_data: {},
  });
});

mongoConnection.on("disconnected", async () => {
  console.log({
    message: "Application Disconnected from MongoDB Server.",
    meta_data: {},
  });
});

// Disconnect MongoDB Server before quitting Application
process.on("SIGINT", async () => {
  await mongoConnection.close().catch(async (error) => {
    console.log({
      name: error?.name || "",
      message: `Uncaught Exception Occurred\n${error?.message || ""}`,
      stack: error?.stack || {},
    });
  });
});

// Export Connection
export { mongoConnection };
