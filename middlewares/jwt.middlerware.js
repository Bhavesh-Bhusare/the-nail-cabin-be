export default class JWTMiddleware {
  async parserJWTPayload(req, res, next) {
    try {
      const PROXY_DATA_HEADER = "x-proxy-data";
      const payloadHeader = req.headers[PROXY_DATA_HEADER];
      if (payloadHeader) req.payload = JSON.parse(payloadHeader);
      next();
    } catch (error) {
      next(error);
    }
  }
}
