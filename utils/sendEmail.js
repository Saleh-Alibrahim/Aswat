const nodemailer = require('nodemailer');

const sendEmail = async (options, forgot = false) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD
    }
  });
  let message = '';
  if (!forgot) {
    message = {
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      subject: options.subject,
      text: `<${options.email}> \n\n ${options.message}`
    };
  }
  else {
    message = {
      from: process.env.FROM_EMAIL,
      to: options.email,
      subject: options.subject,
      text: `${options.message}`
    };
  }

  await transporter.sendMail(message);

};

module.exports = sendEmail;
