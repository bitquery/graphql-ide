const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
	  user: process.env.SMTP_USER,
	  pass: process.env.SMTP_PASS
	}
  })

  /* module.exports = nodemailer.createTransport({
	host: 'email-smtp.us-east-1.amazonaws.com',
	port: 465,
	secure: true,
	auth: {
	  user: 'AKIA26HYP7M4HN6EDYN2',
	  pass: 'BJzi3BdiVarVh9jsXPtJ0Y08uPk7E4ongsr9iENEG8p3'
	}
	 }) */