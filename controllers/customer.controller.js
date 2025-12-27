import { findOrCreateCustomer } from "../services/customer.service.js";
import { HttpStatusCode } from "axios";

export async function createOrGetCustomer(req, res, next) {
  try {
    const customer = await findOrCreateCustomer(req.body);
    res.status(HttpStatusCode.Ok).send({ error: false, data: customer });
  } catch (error) {
    next(error);
  }
}
