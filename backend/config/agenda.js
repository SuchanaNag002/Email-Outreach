const Agenda = require("agenda");
const nodemailer = require("nodemailer");

// Initialize Agenda with MongoDB URI from environment variables
const agenda = new Agenda({ db: { address: process.env.MONGODB_URI } });

// Configure Nodemailer transporter with SMTP settings from environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Define the "send email" job in Agenda
agenda.define("send email", async (job) => {
  const { emailId } = job.attrs.data;
  const Email = require("../models/Email");

  // Retrieve the email document from the database
  const email = await Email.findById(emailId);

  // Check if the email exists and has not been sent
  if (email && !email.sent) {
    const now = new Date();
    // Check if the current time is past the scheduled send time
    if (now >= email.sendAt) {
      try {
        // Send the email using Nodemailer
        const info = await transporter.sendMail({
          from: `"My Company" <${process.env.EMAIL_USER}>`,
          to: email.recipient,
          subject: email.subject,
          text: email.text,
        });

        console.log(`Email sent to ${email.recipient}: ${info.messageId}`);

        // Mark the email as sent and save the document
        email.sent = true;
        await email.save();
      } catch (error) {
        console.error(`Failed to send email to ${email.recipient}:`, error);
        // Implement a retry mechanism here if necessary
      }
    } else {
      // If it's not time to send the email, reschedule the job
      await agenda.schedule(email.sendAt, "send email", { emailId: email._id });
    }
  }
});

// Export the configured Agenda instance
module.exports = agenda;
