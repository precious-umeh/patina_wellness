import { sendEmail } from "../config/mail.js";

export async function testEmail(req, res) {
  try {
    const email = await sendEmail({
      to: "preciouschukwuanugoumeh@gmail.com",
      subject: "Patina Email Test",
      html: `
        <h1>Patina Wellness Solutions</h1>
        <p>This is a test email from Patina backend.</p>
        <p>If you are seeing this, Resend is working correctly.</p>
      `,
    });

    return res.status(200).json({
      message: "Test email sent successfully.",
      email,
    });
  } catch (error) {
    console.error("Email Error:", error);

    return res.status(500).json({
      message: "Failed to send test email.",
    });
  }
}
