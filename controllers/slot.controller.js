import moment from "moment";
import { createDailySlots } from "../services/slot.js";
import DailySlotModel from "../models/Slots.model.js";
import { HttpStatusCode } from "axios";

export async function getAvailableSlots(req, res, next) {
  try {
    const m = moment(req.body.date, "YYYY-MM-DD", true);
    if (!m.isValid()) throw new Error("Invalid date format");

    const date = m.format("YYYY-MM-DD");

    const existingSlots = await DailySlotModel.findOne({
      date,
      is_deleted: false,
    });

    if (existingSlots?.slots?.length) {
      return res.status(HttpStatusCode.Ok).send({
        error: false,
        data: existingSlots,
      });
    }

    const createdSlots = await createDailySlots(date);

    res.status(HttpStatusCode.Ok).send({
      error: false,
      data: createdSlots,
    });
  } catch (error) {
    next(error);
  }
}
