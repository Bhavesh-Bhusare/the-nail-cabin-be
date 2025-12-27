import express from "express";
import { getAvailableSlots } from "../controllers/slot.controller.js";
import {
  createBooking,
  getAllBookings,
  getBookingById,
} from "../controllers/booking.controller.js";
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

router.get("/getallbookings", getAllBookings);

router.get("/getbooking/:bookingId", getBookingById);

export default router;
