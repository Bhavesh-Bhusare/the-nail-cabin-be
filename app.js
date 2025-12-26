import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import connectTimeout from "connect-timeout";
import expressHttpContext from "express-http-context";
import fs from "fs";

import routes from "./routes/routes.js";
import JWTMiddleware from "./middlewares/jwt.middlerware.js";
import {
  notFoundHandler,
  commonErrorHandler,
} from "./middlewares/error.middlerware.js";

const app = express();

app.use(expressHttpContext.middleware);

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
app.use("/v1", connectTimeout("10s"), routes);

// Error Handling
app.use(notFoundHandler);
app.use(commonErrorHandler);

export default app;
