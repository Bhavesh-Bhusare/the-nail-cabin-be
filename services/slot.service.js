import moment from "moment";
import DailySlotModel from "../models/Slots.model.js";

export async function createDailySlots(date) {
  const slots = [];

  let start = moment(date + " 09:00", "YYYY-MM-DD HH:mm");
  const end = moment(date + " 21:00", "YYYY-MM-DD HH:mm");

  while (start.isBefore(end)) {
    const slotEnd = moment(start).add(60, "minutes");
    if (slotEnd.isAfter(end)) break;

    slots.push({
      startTime: start.format("HH:mm"),
      endTime: slotEnd.format("HH:mm"),
      isAvailable: true,
    });

    start = slotEnd;
  }

  return DailySlotModel.create({
    date,
    slots,
    isDeleted: false,
    createdTimestamp: Date.now(),
    updatedTimestamp: null,
    deleted_timestamp: null,
  });
}
