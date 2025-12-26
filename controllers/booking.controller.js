import httpErrors from "http-errors";
import moment from "moment";
import DailySlotModel from "../models/Slots.model.js";
import BookingModel from "../models/Bookings.model.js";
import { HttpStatusCode } from "axios";

export async function createBooking(req, res, next) {
  try {
    const { customerName, customerMobile, date, dateId, slotId } = req.body;

    if (!customerName || !customerMobile || !date || !dateId || !slotId)
      throw httpErrors.BadRequest("Missing required fields");

    const m = moment(date, "YYYY-MM-DD", true);
    if (!m.isValid()) throw new Error("Invalid date format");

    const session = await DailySlotModel.startSession();
    session.startTransaction();

    const dailySlot = await DailySlotModel.findOne({
      _id: dateId,
      date: m.format("YYYY-MM-DD"),
    }).session(session);

    const slot = dailySlot?.slots?.id(slotId);
    if (!slot || !slot.is_available)
      throw httpErrors.Conflict("Slot unavailable");

    await BookingModel.create(
      [
        {
          dateId,
          slotId,
          booking_date: m.format("YYYY-MM-DD"),
          start_time: slot.start_time,
          end_time: slot.end_time,
          customer_name: customerName,
          customer_mobile: customerMobile,
          created_timestamp: Date.now(),
        },
      ],
      { session }
    );

    slot.is_available = false;
    await dailySlot.save({ session });

    await session.commitTransaction();

    res
      .status(HttpStatusCode.Created)
      .send({ error: false, message: "Booking confirmed" });
  } catch (error) {
    next(error);
  }
}
