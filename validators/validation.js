import Joi from "joi";

// Validate Get Available Slots API
export const getAvailableSlotsSchema = Joi.object({
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "Date must be in YYYY-MM-DD format",
      "string.empty": "Date is required",
      "any.required": "Date is required",
    }),
}).unknown();

// Validate Create Booking API
export const createBookingSchema = Joi.object({
  customerName: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Customer name is required",
  }),

  customerMobile: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid Indian mobile number",
      "string.empty": "Customer mobile is required",
    }),

  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "Date must be in YYYY-MM-DD format",
      "string.empty": "Date is required",
    }),

  dateId: Joi.string().hex().length(24).required().messages({
    "string.length": "Invalid dateId",
    "string.hex": "Invalid dateId",
  }),

  slotId: Joi.string().hex().length(24).required().messages({
    "string.length": "Invalid slotId",
    "string.hex": "Invalid slotId",
  }),
}).unknown();
