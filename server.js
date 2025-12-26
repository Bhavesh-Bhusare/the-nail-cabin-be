import http from "http";
import "dotenv/config";
import "./config/mongo.js";
import app from "./app.js";

const server = http.createServer(app);

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Express is live on ${PORT}`);
});

process.on("SIGTERM", () => {
  setTimeout(() => process.exit(0), 1000);
});

process.on("uncaughtException", (error) => {
  console.log(error.message);
});
