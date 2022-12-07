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
                ? String('redis://' + process.env.REDIS_HOST + ':' + process.env.REDIS_PORT + '/' + process.env.REDIS_DB)
		: 'redis://127.0.0.1:6379'
})

const getAccountIdFromSession = req =>
		new Promise(resolve => {
			const session = req.cookies['_app_session_key']
			if (session) {
				redisClient.get(`session:${session}`, (error, result) => {
					if (result) {
						const json = JSON.parse(result)
						resolve(json?.account_id)
					} else {
						resolve(undefined)
					}
				})
			} else {
				resolve(undefined)
			}
		}
	)

const authMiddleware = async (req, res, next) => {
	if (req.path === '/api/querytransfer') {
		return next()
	}
	const account_id = await getAccountIdFromSession(req)
	if (account_id) {
		req.account_id = +account_id
		return next()
	} else {
		res.set('Location', `${process.env.BACKEND_URL}/auth/login`)
		res.cookie('redirect_to', process.env.IDE_URL, { maxAge: 300000 })
		res.sendStatus(302)
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
	console.log("The app listening on port " + process.env.PORT)
})
