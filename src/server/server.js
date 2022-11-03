const express = require('express')
require('dotenv').config()
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const mysql = require('mysql')
const cookieParser = require('cookie-parser')
const dbconfig = require('./databaseConfig')
const redis = require('redis')
const db = mysql.createPool({
	...dbconfig.connection,
	'connectionLimit': 100,
	'database': dbconfig.database
})
const app = express()
const bodyParser = require('body-parser')
const defaultmeta = require('./defaultMeta')
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../../build')))
app.use(cors())
app.use(cookieParser())
let redisClient = redis.createClient({ 
	url: process.env.NODE_ENV === 'production' 
		? 'redis://redis1:6379/10' 
		: 'redis://127.0.0.1:6379'
})

const getAccountIdFromSession = req =>
		new Promise(resolve => {
			const session = req.cookies['session']
			if (session) {
				redisClient.get(`session:${session}`, (error, account_id) => {
					resolve(account_id)
				})
			} else {
				resolve(undefined)
			}
		}
	)

const authMiddleware = async (req, res, next) => {
	const account_id = await getAccountIdFromSession(req)
	if (account_id) {
		req.account_id = +account_id
		return next()
	} else {
		res.status(401).send('You are not authenticated')
	}
}

app.use( authMiddleware )
app.enable('trust proxy');

require('./endPoints')(app, db, redisClient)

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
							description: result[0].description ? result[0].description : defaultmeta.description
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
