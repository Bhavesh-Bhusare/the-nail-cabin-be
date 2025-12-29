import moment from "moment";
import { verifyCaptcha } from "../services/captcha.service.js";
import DailySlotModel from "../models/Slots.model.js";
import { HttpStatusCode } from "axios";
import { createDailySlots } from "../services/slot.service.js";

export async function getAvailableSlots(req, res, next) {
  try {
    const { date, captchaToken } = req.body;

    // 1️⃣ Verify captcha
    const isHuman = await verifyCaptcha(captchaToken);
    if (!isHuman) {
      return res.status(HttpStatusCode.Forbidden).json({
        success: false,
        message: "Bot verification failed",
      });
    }

    // 2️⃣ Validate date
    const m = moment(date, "YYYY-MM-DD", true);
    if (!m.isValid()) {
      return res.status(HttpStatusCode.BadRequest).json({
        success: false,
        message: "Invalid date format",
      });
    }

    const formattedDate = m.format("YYYY-MM-DD");

    // 3️⃣ Fetch or create slots
    let existingSlots = await DailySlotModel.findOne({
      date: formattedDate,
      isDeleted: false,
    });

    if (!existingSlots) {
      existingSlots = await createDailySlots(formattedDate);
    }

    return res.status(HttpStatusCode.Ok).json({
      success: true,
      data: existingSlots,
    });
  } catch (error) {
    console.error("getAvailableSlots error:", error);
    next(error);
  }
}
