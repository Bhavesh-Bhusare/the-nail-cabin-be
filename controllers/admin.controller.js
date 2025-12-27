import bcrypt from "bcrypt";
import httpErrors from "http-errors";
import { HttpStatusCode } from "axios";
import AdminModel from "../models/Admin.model.js";
import { generateToken } from "../services/jwt.service.js";

// Register Admin (run once manually)
export async function registerAdmin(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      throw httpErrors.BadRequest("Missing required fields");

    const existing = await AdminModel.findOne({ email });
    if (existing) throw httpErrors.Conflict("Admin already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await AdminModel.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(HttpStatusCode.Created).send({
      success: true,
      message: "Admin created",
    });
  } catch (error) {
    next(error);
  }
}

// Login
export async function loginAdmin(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw httpErrors.BadRequest("Missing credentials");

    const admin = await AdminModel.findOne({ email });
    if (!admin) throw httpErrors.Unauthorized("Invalid credentials");

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw httpErrors.Unauthorized("Invalid credentials");

    // ⏱️ 5 hours expiry
    const expiresInSeconds = 5 * 60 * 60; // 18000 seconds
    const expiresAt = Date.now() + expiresInSeconds * 1000;

    const token = generateToken(admin);

    res.send({
      success: true,
      token,
      expiresIn: expiresInSeconds,
      expiresAt,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (error) {
    next(error);
  }
}
