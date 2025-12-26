import express from "express";
import { getAvailableSlots } from "../controllers/slot.controller.js";
import { createBooking } from "../controllers/booking.controller.js";
import validate from "../middlewares/validate.middleware.js";
import {
  getAvailableSlotsSchema,
  createBookingSchema,
} from "../validators/validation.js";

const router = express.Router();

router.post(
  "/get-available-slots",
  validate(getAvailableSlotsSchema),
  getAvailableSlots
);

router.post("/create-booking", validate(createBookingSchema), createBooking);

export default router;
