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

    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customers",
      required: true,
      index: true,
    },

    bookingDate: {
      type: String,
      required: true,
      index: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    bookingStatus: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed",
      index: true,
    },

    notes: {
      type: String,
      default: null,
    },

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

    cancelledTimestamp: {
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
