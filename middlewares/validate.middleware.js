import httpErrors from "http-errors";

export default function validate(schema, property = "body") {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map((d) => d.message).join(", ");
      return next(httpErrors.UnprocessableEntity(message));
    }

    req[property] = value;
    next();
  };
}
