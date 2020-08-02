const nodemailer = require('nodemailer');

const sendEmail = async options => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD
    }
  });

  const message = {
    from: process.env.FROM_EMAIL,
    to: process.env.TO_EMAIL,
    subject: options.subject,
    text: `<${options.email}> \n\n ${options.message}`
  };

  const info = await transporter.sendMail(message);

};

module.exports = sendEmail;
