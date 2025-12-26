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
        start_time: {
          type: String,
          required: true, // format: HH:mm (24-hour)
        },
        end_time: {
          type: String,
          required: true, // format: HH:mm (24-hour)
        },
        is_available: {
          type: Boolean,
          default: true,
        },
      },
    ],

    is_deleted: {
      type: Boolean,
      default: false,
    },

    created_timestamp: {
      type: Number,
      required: true,
    },

    updated_timestamp: {
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
