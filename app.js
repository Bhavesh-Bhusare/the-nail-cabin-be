import { mongoConnection } from "./config/mongo.js";
await mongoConnection();

import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import connectTimeout from "connect-timeout";

import fs from "fs";

import bookingRoutes from "./routes/booking.js";
import JWTMiddleware from "./middlewares/jwt.middlerware.js";
import {
  notFoundHandler,
  commonErrorHandler,
} from "./middlewares/error.middlerware.js";

const app = express();

// Core Middlewares
app.use(helmet());
app.use(
  compression({
    level: 6,
    threshold: 5000,
    filter: (req, res) =>
      req.headers["request-no-compression"]
        ? false
        : compression.filter(req, res),
  })
);

app.use(express.json({ limit: "512mb" }));
app.use(express.urlencoded({ extended: true, limit: "512mb" }));
app.use(cookieParser("the-nail-cabin"));

app.use(cors({ credentials: true, origin: ["*"] }));
app.set("trust proxy", true);

// JWT Middleware
const jwtMiddleware = new JWTMiddleware();
app.use(jwtMiddleware.parserJWTPayload);

// Logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(
  morgan("combined", {
    stream: fs.createWriteStream("/logs", { flags: "a" }),
  })
);

// Routes
app.use("/api/v1/bookings", connectTimeout("10s"), bookingRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(commonErrorHandler);

export default app;
