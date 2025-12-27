import jwt from "jsonwebtoken";

export function generateToken(admin) {
  const expiresInSeconds = 5 * 60 * 60; // 18000 seconds

  return jwt.sign(
    { adminId: admin._id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: expiresInSeconds }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
