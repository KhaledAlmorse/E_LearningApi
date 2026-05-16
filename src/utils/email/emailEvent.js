import { EventEmitter } from "events";
import { signup } from "./generateHtml.js";
import { sendEmail } from "./sendEmail.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on("sendEmail", async ({ email, otp, subject }) => {
  await sendEmail({
    to: email,
    subject: subject,
    html: signup(otp),
  });
});
