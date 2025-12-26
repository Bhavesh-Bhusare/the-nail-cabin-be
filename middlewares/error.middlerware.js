import httpErrors from "http-errors";
import { HttpStatusCode } from "axios";

export function notFoundHandler(req, res, next) {
  next(httpErrors.NotFound(`Route not Found for [${req.method}] ${req.url}`));
}

export function commonErrorHandler(err, req, res, next) {
  const responseStatus = err.status || HttpStatusCode.InternalServerError;
  const responseMessage =
    err.message || `Cannot resolve request [${req.method}] ${req.url}`;

  if (err?.isJoi === true) err.status = HttpStatusCode.UnprocessableEntity;

  if (!res.headersSent) {
    res.status(responseStatus).send({
      error: {
        status: responseStatus,
        message: responseMessage,
      },
    });
  }
}
