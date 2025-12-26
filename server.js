import "dotenv/config";
import http from "http";
import app from "./app.js";
import { mongoConnection } from "./config/mongo.js";

await mongoConnection();

const PORT = process.env.PORT || 3500;

http.createServer(app).listen(PORT, () => {
  console.log(`Express is live on ${PORT}`);
});

process.on("SIGTERM", () => {
  setTimeout(() => process.exit(0), 1000);
});

process.on("uncaughtException", (error) => {
  console.log(error.message);
});
