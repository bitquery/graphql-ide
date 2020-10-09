const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const db = mysql.createConnection({
	host: 'localhost',
	port: 3307,
	user: 'root',
	password: '',
	database: 'bitquery'
})
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

require('./passport')(passport, db)

require('./endPoints')(app, passport, db)

app.listen(3000, () => {
	console.log("Example app listening on port 3000")
})