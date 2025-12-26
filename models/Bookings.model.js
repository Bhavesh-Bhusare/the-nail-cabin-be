import mongoose from "mongoose";
const { Schema } = mongoose;

const BookingSchema = new Schema(
  {
    dateId: {
      type: Schema.Types.ObjectId,
      ref: "DailySlot",
      required: true,
      index: true,
    },

    slotId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    booking_date: {
      type: String,
      required: true,
      index: true,
    },

    start_time: {
      type: String,
      required: true,
    },

    end_time: {
      type: String,
      required: true,
    },

    customer_name: {
      type: String,
      required: true,
      trim: true,
    },

    customer_mobile: {
      type: String,
      required: true,
      trim: true,
    },

    customer_email: {
      type: String,
      default: null,
      trim: true,
    },

    booking_status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed",
      index: true,
    },

    notes: {
      type: String,
      default: null,
    },

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

    cancelled_timestamp: {
      type: Number,
      default: null,
    },
  },
  {
    versionKey: false,
  }
);

BookingSchema.index({ dateId: 1, slotId: 1 }, { unique: true });

const BookingModel = mongoose.model("Booking", BookingSchema);
export default BookingModel;
