const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	secure: false,
	auth: {
	  user: process.env.SMTP_USER,
	  pass: process.env.SMTP_PASS
	}
  })