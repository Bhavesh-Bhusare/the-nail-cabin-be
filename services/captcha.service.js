import https from "https";
import querystring from "querystring";

export const verifyCaptcha = (token) => {
  return new Promise((resolve) => {
    if (!token) return resolve(false);

    const postData = querystring.stringify({
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: token,
    });

    const req = https.request(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(postData),
        },
      },
      (res) => {
        console.log(res);
        let data = "";

        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            console.log("Captcha result:", parsed);
            resolve(parsed.success && parsed.score >= 0.5);
          } catch {
            resolve(false);
          }
        });
      }
    );

    req.on("error", () => resolve(false));
    req.write(postData);
    req.end();
  });
};
