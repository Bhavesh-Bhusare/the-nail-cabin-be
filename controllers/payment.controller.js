import PaymentModel from "../models/Payments.model.js";
import BookingModel from "../models/Bookings.model.js";
import { HttpStatusCode } from "axios";
import httpErrors from "http-errors";

export async function addPayment(req, res, next) {
  try {
    const { bookingId, amount, paymentMode } = req.body;

    if (!bookingId || !amount || !paymentMode)
      throw httpErrors.BadRequest("Missing required fields");

    const booking = await BookingModel.findById(bookingId);
    if (!booking) throw httpErrors.NotFound("Booking not found");

    const payment = await PaymentModel.create({
      bookingId,
      amount,
      paymentMode,
      createdTimestamp: Date.now(),
    });

    res.status(HttpStatusCode.Created).send({
      error: false,
      message: "Payment added successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
}
