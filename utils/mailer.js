const nodemailer = require("nodemailer");

// Gmail SMTP setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "agriculturalfoundationiv@gmail.com",      // Replace with your Gmail
    pass: "sjbp ltph bttj hplg"         // Use App Password, not regular password
  }
});

// Send email function
function sendEmail(to, subject, text) {
  const mailOptions = {
    from: "agriculturalfoundationiv@gmail.com",
    to,
    subject,
    text
  };

  return transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
 
