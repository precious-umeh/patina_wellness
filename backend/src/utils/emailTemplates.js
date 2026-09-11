import { env } from "../config/env.js";

export const resetPasswordTemplate = function (name, resetUrl) {
  return `
    <div style="margin: 0; padding: 0; background-color: #fcfcfa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #4b5563; -webkit-font-smoothing: antialiased;">

      <!-- OUTER CONTAINER -->
      <table role="presentation" width="100%" cellspacing="0" border="0" style="background-color: #fcfcfa; width: 100%; padding: 40px 16px;">
        <tr>
          <td align="center>

          <!-- MAIN CARD -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 540px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            
              <!-- BRAND HEADER -->
              <tr>
                <td style="background-color: #5f8f1f; padding: 28px 32px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">
                    Patina Wellness Solutions
                  </h1>
                </td>
              </tr>

              <!-- CARD BODY -->
              <tr>
                <td style="padding: 32px; background-color: #ffffff;">
                  
                  <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 20px; font-weight: 700;">
                    Password Reset Request
                  </h2>

                  <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                    Hello <strong>${name}</strong>,
                  </p>

                  <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                    We received a request to reset your admin account password for Patina Wellness Solutions. Click the button below to set up a new password:
                  </p>

                  <!-- CTA BUTTON -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 28px 0;">
                    <tr>
                      <td align="center" style="border-radius: 9999px; background-color: #baff68;">
                        <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 700; color: #1f2937; text-decoration: none; border-radius: 9999px; background-color: #baff68; border: 1px solid #8fd63a;">
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- EXPIRATION NOTICE BOX -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f5ffe8; border-left: 4px solid #5f8f1f; border-radius: 4px; margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 12px 16px;">
                        <p style="margin: 0; font-size: 13px; font-weight: 600; color: #5f8f1f;">
                          This link is temporary and will expire in 15 minutes.
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                    If you did not request a password reset, you can safely ignore this email. Your current password will remain unchanged.
                  </p>

                  <!-- FALLBACK URL -->
                  <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 20px;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af;">
                      Having trouble with the button? Copy and paste this URL into your browser:
                    </p>
                    <p style="margin: 0; font-size: 12px; word-break: break-all;">
                      <a href="${resetUrl}" style="color: #5f8f1f; text-decoration: underline;">
                        ${resetUrl}
                      </a>
                    </p>
                  </div>

                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background-color: #f7f9f8; padding: 20px 32px; border-top: 1px solid #e5e7eb; text-align: center;">
                  <p style="margin: 0; font-size: 12px; color: #6b7280;">
                    &copy; ${new Date().getFullYear()} Patina Wellness Solutions. All rights reserved.
                  </p>
                </td>
              </tr>

          </table>

          </td>
        </tr>
      </table>
    </div>
  
  `;
};

export const verifyEmailTemplate = function (
  name,
  normalizedEmail,
  verificationUrl,
) {
  return `
    <div style="margin: 0; padding: 0; background-color: #fcfcfa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #4b5563; -webkit-font-smoothing: antialiased;">

      <!-- OUTER CONTAINER -->
      <table role="presentation" width="100%" cellspacing="0" border="0" style="background-color: #fcfcfa; width: 100%; padding: 40px 16px;">
        <tr>
          <td align="center">

          <!-- MAIN CARD -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 540px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            
              <!-- BRAND HEADER -->
              <tr>
                <td style="background-color: #5f8f1f; padding: 28px 32px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">
                    Patina Wellness Solutions
                  </h1>
                </td>
              </tr>

              <!-- CARD BODY -->
              <tr>
                <td style="padding: 32px; background-color: #ffffff;">
                  
                  <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 20px; font-weight: 700;">
                    Verify Your New Email
                  </h2>

                  <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                    Hello <strong>${name}</strong>,
                  </p>

                  <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                    We received a request to change the email address associated with your Patina Wellness Solutions account.
                  </p>

                  <!-- NEW EMAIL HIGHLIGHT BOX -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f7f9f8; border: 1px solid #e5e7eb; border-radius: 8px; margin: 16px 0 24px 0;">
                    <tr>
                      <td style="padding: 16px; text-align: center;">
                        <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280; letter-spacing: 0.5px;">
                          New Email Address
                        </p>
                        <p style="margin: 0; font-size: 16px; font-weight: 700; color: #1f2937;">
                          ${normalizedEmail}
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                    Click the button below to confirm this change:
                  </p>

                  <!-- CTA BUTTON -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 28px 0;">
                    <tr>
                      <td align="center" style="border-radius: 9999px; background-color: #baff68;">
                        <a href="${verificationUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 700; color: #1f2937; text-decoration: none; border-radius: 9999px; background-color: #baff68; border: 1px solid #8fd63a;">
                          Verify New Email
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- EXPIRATION NOTICE BOX -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f5ffe8; border-left: 4px solid #5f8f1f; border-radius: 4px; margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 12px 16px;">
                        <p style="margin: 0; font-size: 13px; font-weight: 600; color: #5f8f1f;">
                          This verification link is temporary and will expire in 15 minutes.
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                    If you did not request this change, you can safely ignore this email. Your current account details will remain unchanged.
                  </p>

                  <!-- FALLBACK URL -->
                  <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 20px;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af;">
                      Having trouble with the button? Copy and paste this URL into your browser:
                    </p>
                    <p style="margin: 0; font-size: 12px; word-break: break-all;">
                      <a href="${verificationUrl}" style="color: #5f8f1f; text-decoration: underline;">
                        ${verificationUrl}
                      </a>
                    </p>
                  </div>

                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background-color: #f7f9f8; padding: 20px 32px; border-top: 1px solid #e5e7eb; text-align: center;">
                  <p style="margin: 0; font-size: 12px; color: #6b7280;">
                    &copy; ${new Date().getFullYear()} Patina Wellness Solutions. All rights reserved.
                  </p>
                </td>
              </tr>

          </table>
          
          </td>
        </tr>
      </table>
    </div>
  `;
};

export const bookingNotificationTemplate = function (booking) {
  const adminUrl = `${env.frontendUrl}/admin/bookings`;

  return `
    <div style="margin: 0; padding: 0; background-color: #fcfcfa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #4b5563; -webkit-font-smoothing: antialiased;">

      <!-- OUTER CONTAINER -->
      <table role="presentation" width="100%" cellspacing="0" border="0" style="background-color: #fcfcfa; width: 100%; padding: 40px 16px;">
        <tr>
          <td align="center">

            <!-- MAIN CARD -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 540px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">

              <!-- BRAND HEADER -->
              <tr>
                <td style="background-color: #5f8f1f; padding: 28px 32px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">
                    Patina Wellness Solutions
                  </h1>
                </td>
              </tr>

              <!-- CARD BODY -->
              <tr>
                <td style="padding: 32px; background-color: #ffffff;">

                  <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 20px; font-weight: 700;">
                    New Consultation Booking
                  </h2>

                  <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                    Hello Admin,
                  </p>

                  <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                    A new consultation booking has been submitted through the Patina Wellness Solutions website and requires your attention.
                  </p>

                  <!-- BOOKING DETAILS -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f7f9f8; border: 1px solid #e5e7eb; border-radius: 8px; margin: 16px 0 24px 0;">

                    <tr>
                      <td style="padding: 16px;">

                        <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280; letter-spacing: 0.5px;">
                          Booking Details
                        </p>

                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #4b5563;">
                          <strong style="color: #1f2937;">Booking ID:</strong>
                          ${booking.bookingId}
                        </p>

                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #4b5563;">
                          <strong style="color: #1f2937;">Client:</strong>
                          ${booking.fullName}
                        </p>

                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #4b5563;">
                          <strong style="color: #1f2937;">Email:</strong>
                          ${booking.email}
                        </p>

                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #4b5563;">
                          <strong style="color: #1f2937;">Phone:</strong>
                          ${booking.phoneNumber}
                        </p>

                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #4b5563;">
                          <strong style="color: #1f2937;">Service:</strong>
                          ${booking.selectedService.name}
                        </p>

                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #4b5563;">
                          <strong style="color: #1f2937;">Appointment Type:</strong>
                          ${booking.appointmentType === "virtual" ? "Virtual" : "Physical"}
                        </p>

                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #4b5563;">
                          <strong style="color: #1f2937;">Date:</strong>
                          ${booking.appointmentDate}
                        </p>

                        <p style="margin: 0; font-size: 14px; color: #4b5563;">
                          <strong style="color: #1f2937;">Time:</strong>
                          ${booking.appointmentTime}
                        </p>

                      </td>
                    </tr>
                  </table>

                  <!-- PRIMARY CONCERN -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f5ffe8; border-left: 4px solid #5f8f1f; border-radius: 4px; margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 12px 16px;">
                        <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #5f8f1f; letter-spacing: 0.5px;">
                          Primary Concern
                        </p>

                        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
                          ${booking.primaryConcern}
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- CTA BUTTON -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 28px 0;">
                    <tr>
                      <td align="center" style="border-radius: 9999px; background-color: #baff68;">
                        <a href="${adminUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 700; color: #1f2937; text-decoration: none; border-radius: 9999px; background-color: #baff68; border: 1px solid #8fd63a;">
                          View Booking
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                    Please review the booking from the admin dashboard and follow up with the client as needed.
                  </p>

                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background-color: #f7f9f8; padding: 20px 32px; border-top: 1px solid #e5e7eb; text-align: center;">
                  <p style="margin: 0; font-size: 12px; color: #6b7280;">
                    &copy; ${new Date().getFullYear()} Patina Wellness Solutions. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>
    </div>
  `;
};

export const partnershipNotificationTemplate = function (application) {
  const adminUrl = `${env.frontendUrl}/admin/partnerships`;

  const partnershipType =
    application.partnershipType.charAt(0).toUpperCase() +
    application.partnershipType.slice(1);

  return `
    <div style="margin: 0; padding: 0; background-color: #fcfcfa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #4b5563; -webkit-font-smoothing: antialiased;">

      <!-- OUTER CONTAINER -->
      <table role="presentation" width="100%" cellspacing="0" border="0" style="background-color: #fcfcfa; width: 100%; padding: 40px 16px;">
        <tr>
          <td align="center">

            <!-- MAIN CARD -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 540px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">

              <!-- BRAND HEADER -->
              <tr>
                <td style="background-color: #5f8f1f; padding: 28px 32px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">
                    Patina Wellness Solutions
                  </h1>
                </td>
              </tr>

              <!-- CARD BODY -->
              <tr>
                <td style="padding: 32px; background-color: #ffffff;">

                  <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 20px; font-weight: 700;">
                    New Partnership Application
                  </h2>

                  <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                    Hello Admin,
                  </p>

                  <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                    A new partnership application has been submitted through the Patina Wellness Solutions website and requires your attention.
                  </p>

                  <!-- APPLICANT DETAILS -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f7f9f8; border: 1px solid #e5e7eb; border-radius: 8px; margin: 16px 0 24px 0;">

                    <tr>
                      <td style="padding: 16px;">

                        <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280; letter-spacing: 0.5px;">
                          Applicant Details
                        </p>

                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #4b5563;">
                          <strong style="color: #1f2937;">Application ID:</strong>
                          ${application.applicationId}
                        </p>

                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #4b5563;">
                          <strong style="color: #1f2937;">Name:</strong>
                          ${application.fullName}
                        </p>

                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #4b5563;">
                          <strong style="color: #1f2937;">Email:</strong>
                          ${application.email}
                        </p>

                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #4b5563;">
                          <strong style="color: #1f2937;">Phone:</strong>
                          ${application.phoneNumber}
                        </p>

                        <p style="margin: 0; font-size: 14px; color: #4b5563;">
                          <strong style="color: #1f2937;">Partnership Type:</strong>
                          ${partnershipType}
                        </p>

                      </td>
                    </tr>
                  </table>

                  ${
                    application.organisationName
                      ? `
                  <!-- ORGANISATION DETAILS -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f7f9f8; border: 1px solid #e5e7eb; border-radius: 8px; margin: 0 0 24px 0;">

                    <tr>
                      <td style="padding: 16px;">

                        <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280; letter-spacing: 0.5px;">
                          Organisation Details
                        </p>

                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #4b5563;">
                          <strong style="color: #1f2937;">Organisation:</strong>
                          ${application.organisationName}
                        </p>

                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #4b5563;">
                          <strong style="color: #1f2937;">Industry:</strong>
                          ${application.industry}
                        </p>

                        <p style="margin: 0; font-size: 14px; color: #4b5563;">
                          <strong style="color: #1f2937;">Company Size:</strong>
                          ${application.companySize || "Not provided"}
                        </p>

                      </td>
                    </tr>
                  </table>
                  `
                      : ""
                  }

                  ${
                    application.areaOfSpecialty
                      ? `
                  <!-- SPECIALTY -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f7f9f8; border: 1px solid #e5e7eb; border-radius: 8px; margin: 0 0 24px 0;">

                    <tr>
                      <td style="padding: 16px;">

                        <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280; letter-spacing: 0.5px;">
                          Area of Specialty
                        </p>

                        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
                          ${application.areaOfSpecialty}
                        </p>

                      </td>
                    </tr>
                  </table>
                  `
                      : ""
                  }

                  ${
                    application.websiteOrSocial
                      ? `
                  <!-- WEBSITE / SOCIAL -->
                  <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
                    <strong style="color: #1f2937;">Website / Social:</strong>
                    ${application.websiteOrSocial}
                  </p>
                  `
                      : ""
                  }

                  <!-- PARTNERSHIP GOALS -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f5ffe8; border-left: 4px solid #5f8f1f; border-radius: 4px; margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 12px 16px;">

                        <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #5f8f1f; letter-spacing: 0.5px;">
                          Partnership Goals
                        </p>

                        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
                          ${application.partnershipGoals}
                        </p>

                      </td>
                    </tr>
                  </table>

                  <!-- CONTACT METHOD -->
                  <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                    <strong style="color: #1f2937;">Preferred Contact Method:</strong>
                    ${application.preferredContactMethod}
                  </p>

                  <!-- CTA BUTTON -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 28px 0;">
                    <tr>
                      <td align="center" style="border-radius: 9999px; background-color: #baff68;">
                        <a href="${adminUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 700; color: #1f2937; text-decoration: none; border-radius: 9999px; background-color: #baff68; border: 1px solid #8fd63a;">
                          View Application
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                    Please review the application from the admin dashboard and follow up with the applicant as appropriate.
                  </p>

                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background-color: #f7f9f8; padding: 20px 32px; border-top: 1px solid #e5e7eb; text-align: center;">
                  <p style="margin: 0; font-size: 12px; color: #6b7280;">
                    &copy; ${new Date().getFullYear()} Patina Wellness Solutions. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>
    </div>
  `;
};

export const inquiryNotificationTemplate = function (inquiry) {
  const adminUrl = `${env.frontendUrl}/admin/inquiries`;

  const topic = inquiry.topic.charAt(0).toUpperCase() + inquiry.topic.slice(1);

  return `
    <div style="margin: 0; padding: 0; background-color: #fcfcfa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #4b5563; -webkit-font-smoothing: antialiased;">

      <!-- OUTER CONTAINER -->
      <table role="presentation" width="100%" cellspacing="0" border="0" style="background-color: #fcfcfa; width: 100%; padding: 40px 16px;">
        <tr>
          <td align="center">

            <!-- MAIN CARD -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 540px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">

              <!-- BRAND HEADER -->
              <tr>
                <td style="background-color: #5f8f1f; padding: 28px 32px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">
                    Patina Wellness Solutions
                  </h1>
                </td>
              </tr>

              <!-- CARD BODY -->
              <tr>
                <td style="padding: 32px; background-color: #ffffff;">

                  <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 20px; font-weight: 700;">
                    New Client Inquiry
                  </h2>

                  <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                    Hello Admin,
                  </p>

                  <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                    A new inquiry has been submitted through the Patina Wellness Solutions website and requires your attention.
                  </p>

                  <!-- INQUIRY DETAILS -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f7f9f8; border: 1px solid #e5e7eb; border-radius: 8px; margin: 16px 0 24px 0;">

                    <tr>
                      <td style="padding: 16px;">

                        <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280; letter-spacing: 0.5px;">
                          Contact Details
                        </p>

                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #4b5563;">
                          <strong style="color: #1f2937;">Inquiry ID:</strong>
                          ${inquiry.inquiryId}
                        </p>

                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #4b5563;">
                          <strong style="color: #1f2937;">Name:</strong>
                          ${inquiry.fullName}
                        </p>

                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #4b5563;">
                          <strong style="color: #1f2937;">Email:</strong>
                          ${inquiry.email}
                        </p>

                        <p style="margin: 0; font-size: 14px; color: #4b5563;">
                          <strong style="color: #1f2937;">Phone:</strong>
                          ${inquiry.phone || "Not provided"}
                        </p>

                      </td>
                    </tr>
                  </table>

                  <!-- TOPIC -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f5ffe8; border-left: 4px solid #5f8f1f; border-radius: 4px; margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 12px 16px;">

                        <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #5f8f1f; letter-spacing: 0.5px;">
                          Topic
                        </p>

                        <p style="margin: 0; font-size: 14px; color: #4b5563;">
                          ${topic}
                        </p>

                      </td>
                    </tr>
                  </table>

                  <!-- MESSAGE -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f7f9f8; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 16px;">

                        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280; letter-spacing: 0.5px;">
                          Message
                        </p>

                        <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #4b5563;">
                          ${inquiry.message}
                        </p>

                      </td>
                    </tr>
                  </table>

                  <!-- CTA BUTTON -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 28px 0;">
                    <tr>
                      <td align="center" style="border-radius: 9999px; background-color: #baff68;">
                        <a href="${adminUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 700; color: #1f2937; text-decoration: none; border-radius: 9999px; background-color: #baff68; border: 1px solid #8fd63a;">
                          View Inquiry
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                    Please review the inquiry from the admin dashboard and respond to the client as needed.
                  </p>

                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background-color: #f7f9f8; padding: 20px 32px; border-top: 1px solid #e5e7eb; text-align: center;">
                  <p style="margin: 0; font-size: 12px; color: #6b7280;">
                    &copy; ${new Date().getFullYear()} Patina Wellness Solutions. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>
    </div>
  `;
};
