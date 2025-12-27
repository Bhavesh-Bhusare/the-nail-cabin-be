import httpErrors from "http-errors";
import jwt from "jsonwebtoken";

export function requireAdmin(req, res, next) {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer "))
      throw httpErrors.Unauthorized("Token missing");

    const token = auth.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = decoded;
    next();
  } catch (error) {
    next(httpErrors.Unauthorized("Invalid or expired token"));
  }
}
