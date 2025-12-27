import PaymentModel from "../models/Payments.model.js";

export async function createPayment(
  { bookingId, amount, paymentMode },
  session
) {
  const [payment] = await PaymentModel.create(
    [
      {
        bookingId,
        amount,
        paymentMode,
        createdTimestamp: Date.now(),
      },
    ],
    { session }
  );

  return payment;
}
