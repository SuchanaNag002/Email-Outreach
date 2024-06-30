const mongoose = require("mongoose");

// Define the email schema
const emailSchema = new mongoose.Schema({
  subject: { type: String, required: true }, // Email subject, required
  recipient: [{ type: String, required: true }], // Recipient email address, required
  text: { type: String, required: true }, // Email body text, required
  sendAt: { type: Date, required: true }, // Time when the email is to be sent, required
  sent: { type: Boolean, default: false }, // Status of email sent, default is false
});

module.exports = mongoose.model("Email", emailSchema);
