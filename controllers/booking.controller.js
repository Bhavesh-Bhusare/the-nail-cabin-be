import mongoose from "mongoose";
import moment from "moment";
import httpErrors from "http-errors";
import { HttpStatusCode } from "axios";

import DailySlotModel from "../models/Slots.model.js";
import BookingModel from "../models/Bookings.model.js";
import { findOrCreateCustomer } from "../services/customer.service.js";
import { verifyCaptcha } from "../services/captcha.service.js";

export async function createBooking(req, res, next) {
  try {
    const {
      customerName,
      customerMobile,
      customerEmail,
      date,
      dateId,
      slotId,
      captchaToken,
    } = req.body;

    const isHuman = await verifyCaptcha(captchaToken);

    if (!isHuman) {
      throw httpErrors.BadRequest("Bot verification failed");
    }

    if (!customerName || !customerMobile || !date || !dateId || !slotId) {
      throw httpErrors.BadRequest("Missing required fields");
    }

    const m = moment(date, "YYYY-MM-DD", true);
    if (!m.isValid()) throw new Error("Invalid date format");

    // Find Slot deatails
    const dailySlot = await DailySlotModel.findOne({
      _id: dateId,
      date: m.format("YYYY-MM-DD"),
    });

    if (!dailySlot) throw httpErrors.NotFound("Date not found");

    const slot = dailySlot.slots.id(slotId);
    if (!slot || !slot.isAvailable)
      throw httpErrors.Conflict("Slot unavailable");

    // Find or create a customer
    const customer = await findOrCreateCustomer({
      customerName,
      customerMobile,
      customerEmail,
    });

    // create booking
    const [booking] = await BookingModel.create([
      {
        dateId,
        slotId,
        customerId: customer._id,
        bookingDate: m.format("YYYY-MM-DD"),
        startTime: slot.startTime,
        endTime: slot.endTime,
        createdTimestamp: Date.now(),
      },
    ]);

    // Update slot
    slot.isAvailable = false;
    await dailySlot.save();

    res.status(HttpStatusCode.Created).send({
      success: true,
      message: "Booking created successfully",
      bookingId: booking._id,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function getAllBookings(req, res, next) {
  try {
    const bookings = await BookingModel.aggregate([
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },

      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "bookingId",
          as: "payments",
        },
      },
      { $unwind: "$payments" },

      { $sort: { createdTimestamp: -1 } },
    ]);

    res.send({ error: false, data: bookings });
  } catch (error) {
    next(error);
  }
}

export async function getBookingById(req, res, next) {
  try {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId))
      throw new Error("Invalid booking id");

    const booking = await BookingModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(bookingId) } },

      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },

      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "bookingId",
          as: "payments",
        },
      },
    ]);

    if (!booking.length) throw new Error("Booking not found");

    res.send({ error: false, data: booking[0] });
  } catch (error) {
    next(error);
  }
}
