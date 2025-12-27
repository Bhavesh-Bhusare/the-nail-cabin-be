import httpErrors from "http-errors";
import { HttpStatusCode } from "axios";
import BookingModel from "../models/Bookings.model.js";
import PaymentModel from "../models/Payments.model.js";

export async function addPayment(req, res, next) {
  try {
    const { bookingId, amount, paymentMode } = req.body;

    if (!bookingId || !amount || !paymentMode)
      throw httpErrors.BadRequest("Missing required fields");

    if (!["cash", "online"].includes(paymentMode))
      throw httpErrors.BadRequest("Invalid payment mode");

    const booking = await BookingModel.findById(bookingId);
    if (!booking) throw httpErrors.NotFound("Booking not found");

    const payment = await PaymentModel.create({
      bookingId,
      amount,
      paymentMode,
      createdTimestamp: Date.now(),
    });

    res.status(HttpStatusCode.Created).send({
      success: true,
      message: "Payment added successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
}
