const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
	  user: 'fedorenki@gmail.com',
	  pass: 'szsptfldlilvymft'
	}
  })