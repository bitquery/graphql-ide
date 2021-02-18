const express = require('express')
require('dotenv').config()
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const mysql = require('mysql')
const dbconfig = require('./databaseConfig')
const db = mysql.createPool({
	...dbconfig.connection,
	'connectionLimit': 10,
	'database': dbconfig.database
})
const app = express()
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const passport = require('passport')
const defaultmeta = require('./defaultMeta')
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../../build')))
app.use(cors())
app.use(cookieSession({
	name: 'mysession',
	keys: ['vueauthrandomkey'],
	maxAge: 30 * 24 * 60 * 60 * 1000
}))
app.use(passport.initialize());
app.use(passport.session());

require('./passport')(passport, db)
require('./endPoints')(app, passport, db)

if (process.env.NODE_ENV==='production') {
	app.get('*', (req,res) => {
		const url = req.url.substring(1)
		const filePath = path.resolve(__dirname, '../../build', 'index.html')
		const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
		const replaceData = (data, meta) => {
			return data
				.replace(/__TITLE__/g, meta.title)
				.replace(/__DESCRIPTION__/g, meta.description)
				.replace(/__URL__/g, fullUrl)
		}
		if (url) {
			fs.readFile(filePath, 'utf8', (err, data) => {
				if (err) {
					return console.log(err)
				}
				const sql = `SELECT * FROM queries WHERE url=?`
				db.query(sql, [url], (err, result) => {
					if (err) console.log(err)
					if (!result?.length) {
						data = replaceData(data, {
							title: defaultmeta.title,
							description: defaultmeta.description
						})
						res.send(data)
					} else {
						data = replaceData(data, {
							title: result[0].name,
							description: result[0].description
						})
						res.send(data)
					}
				})
			})
		} else {
			fs.readFile(filePath, 'utf8', (err, data) => {
				if (err) {
					return console.log(err)
				}
				data = replaceData(data, {
					title: defaultmeta.title,
					description: defaultmeta.description
				})
				res.send(data)
			})
		}
	})
} 

app.listen(+process.env.PORT || 4000, () => {
	console.log("Example app listening on port 4000")
})
