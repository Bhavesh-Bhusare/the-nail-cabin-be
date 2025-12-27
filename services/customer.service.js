import CustomerModel from "../models/Customer.model.js";

export async function findOrCreateCustomer(
  { customerName, customerMobile, customerEmail },
  session
) {
  let customer = await CustomerModel.findOne({
    customerMobile,
    isDeleted: false,
  }).session(session);

  if (!customer) {
    [customer] = await CustomerModel.create(
      [
        {
          customerName,
          customerMobile,
          customerEmail,
          createdTimestamp: Date.now(),
        },
      ],
      { session }
    );
  }

  return customer;
}
