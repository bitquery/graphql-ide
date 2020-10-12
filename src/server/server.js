const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const dbconfig = require('./databaseConfig')
const db = mysql.createConnection(dbconfig.connection)
const app = express()
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const passport = require('passport')
app.use(bodyParser.json())
app.use(cors())
app.use(cookieSession({
    name: 'mysession',
    keys: ['vueauthrandomkey'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours 
  }))
app.use(passport.initialize());
app.use(passport.session());

db.query(`USE ${dbconfig.database}`)

//mailer=================================

/* let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'fedorenki@gmail.com',
    pass: 'szsptfldlilvymft'
  }
})
let message = {
  from : 'fedorenki@gmail.com',
  to: 'spendil@mail.ru',
  subject: "Message title",
  text: "Plaintext version of the message",
  html: "<p>HTML version of the message</p>"
} */

/* transporter.sendMail(message, (err, info) => {
  if (err) throw err
  console.log(info)
}) */

//mailer=================================

require('./passport')(passport, db)

require('./endPoints')(app, passport, db)

app.listen(3000, () => {
	console.log("Example app listening on port 3000")
})