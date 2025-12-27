import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/admin.controller.js";
import { requireAdmin } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Example protected route
// router.get("/me", requireAdmin, (req, res) => {
//   res.send({ admin: req.admin });
// });

export default router;
