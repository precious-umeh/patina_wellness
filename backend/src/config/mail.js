import { Resend } from "resend";
import { env } from "./env.js";

const resend = new Resend(env.resendApiKey);

export async function sendEmail({ to, subject, html }) {
  const { data, error } = await resend.emails.send({
    from: env.emailFrom,
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
