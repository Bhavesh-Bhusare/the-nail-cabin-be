import mongoose from "mongoose";
const { Schema } = mongoose;

const CustomersSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerMobile: {
      type: String,
      required: true,
      trim: true,
    },

    customerEmail: {
      type: String,
      default: null,
      trim: true,
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
  },
  {
    versionKey: false,
  }
);

CustomersSchema.index({ customerMobile: 1 }, { unique: true });

const CustomerModel = mongoose.model("Customers", CustomersSchema);
export default CustomerModel;
