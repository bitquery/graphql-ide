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
const isProduction = process.env.NODE_ENV === 'production'
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../../build'), { index: false }))
app.use(cors())
app.use(cookieParser())
isProduction && app.use(require('prerender-node').set('prerenderToken', process.env.PRERENDER_TOKEN))
let redisClient = redis.createClient({
	url: isProduction
		? String('redis://' + process.env.REDIS_HOST + ':' + process.env.REDIS_PORT + '/' + process.env.REDIS_DB)
		: 'redis://127.0.0.1:6379'
})

redisClient.on('error', err => console.log('Redis Client Error', err));

redisClient.connect().then(async () => {
	const getAccountIdFromSession = req =>
		new Promise(async (resolve) => {
			const session = req.cookies['_app_session_key']
			console.log('session redisClient.connect().then',session)
			if (session) {
				const value = await redisClient.get(`session:${session}`)
				if (value) {
					const json = JSON.parse(value)
					console.log('json redisClient.connect().then',json)
					resolve(json?.account_id)
				} else {
					resolve(undefined)
				}
			} else {
				resolve(undefined)
			}
		}
	)

	const authMiddleware = async (req, res, next) => {
		const account_id = await getAccountIdFromSession(req)
		console.log('account_id in authMiddleware',account_id)
		req.account_id = isNaN(account_id) ? 0 : +account_id
		console.log('req.account_id authMiddleware',req.account_id)

		return next()
	}

	app.use(authMiddleware)
	app.enable('trust proxy');

	require('./endPoints')(app, db, redisClient)

	// if (isProduction) {
		app.get('*', (req, res) => {
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
	// }

	app.listen(+process.env.PORT || 4000, () => {
		console.log("The app listening on port " + process.env.PORT)
	})
})
