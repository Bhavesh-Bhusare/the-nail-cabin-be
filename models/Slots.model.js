import mongoose from "mongoose";
const { Schema } = mongoose;

const DailySlotSchema = new Schema(
  {
    date: {
      type: String,
      required: true,
      index: true, // format: YYYY-MM-DD
    },

    slots: [
      {
        startTime: {
          type: String,
          required: true, // format: HH:mm (24-hour)
        },
        endTime: {
          type: String,
          required: true, // format: HH:mm (24-hour)
        },
        isAvailable: {
          type: Boolean,
          default: true,
        },
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
    },

    createdTimestamp: {
      type: Number,
      required: true,
    },

    updatedTimestamp: {
      type: Number,
      default: null,
    },

    deleted_timestamp: {
      type: Number,
      default: null,
    },
  },
  {
    versionKey: false,
  }
);

const DailySlotModel = mongoose.model("DailySlot", DailySlotSchema);

export default DailySlotModel;
