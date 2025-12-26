import moment from "moment";
import DailySlotModel from "../models/Slots.model.js";

export async function createDailySlots(date) {
  const slots = [];

  let start = moment(date + " 09:00", "YYYY-MM-DD HH:mm");
  const end = moment(date + " 21:00", "YYYY-MM-DD HH:mm");

  while (start.isBefore(end)) {
    const slotEnd = moment(start).add(90, "minutes");
    if (slotEnd.isAfter(end)) break;

    slots.push({
      start_time: start.format("HH:mm"),
      end_time: slotEnd.format("HH:mm"),
      is_available: true,
    });

    start = slotEnd;
  }

  return DailySlotModel.create({
    date,
    slots,
    is_deleted: false,
    created_timestamp: Date.now(),
    updated_timestamp: null,
    deleted_timestamp: null,
  });
}
