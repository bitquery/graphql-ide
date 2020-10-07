const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql')

const server = express()
server.use(cors())

const jsonParser = bodyParser.json()

const db = mysql.createConnection({
	host: 'localhost',
	port: 3307,
	user: 'root',
	password: '',
	database: 'bitquery'
})

  //Connect
db.connect(err => {
	if (err) throw err
	console.log('MySql Connected...')
})

function addQuery(value) {
	let sql = `INSERT INTO query SET ?`
	db.query(sql, value, (err, result) => {
		if (err) throw err
	})
}

server.get('/createdb', (req, res) => {
	let sql = 'CREATE DATABASE bitquery'
	db.query(sql, (err, res) => {
		if (err) throw err
		console.log(res)
		res.send('database created...')
	})
})
server.get('/getquery/:url', (req, res) => {
	let sql = `SELECT * FROM query WHERE url='${req.params.url}'`
	db.query(sql, (err, result) => {
		if (err) throw err
		console.log(typeof result)
		res.send(result[0])
	})
})
server.post('/addquery', jsonParser, (req, res) => {
	let value = req.body.params
	sql = 'select id from query where id=(select id from query where account_id=2 order by id desc limit 0,1) and name is null and description is null'
	db.query(sql, (err, result) => {
		if (err) throw error
		if (!result.length) {
			addQuery(value)
			res.end('saved in new row')
		} else {
			sql = `update query set description = ? where id=${result[0][Object.keys(result[0])[0]]}`
			db.query(sql, ['request'], (err, result) => {
				if (err) throw err
				res.end('saved last edited row')
			})
		}
	})
	res.send('row added')
})
server.post('/updatequery', jsonParser, (req, res) => {
	let tableEmpty = true
	let thereIsNotSavedRow = true
	let value = req.body.params
	let sql = 'SELECT COUNT(*) FROM query'
	db.query(sql, (err, result) => {
		if (err) throw err
		tableEmpty = result[0][Object.keys(result[0])[0]] ? false : true
		sql = 'select id from query where id=(select id from query where account_id=2 order by id desc limit 0,1) and name is null and description is null'
		db.query(sql, (err, result) => {
			if (err) throw err
			thereIsNotSavedRow = result.length ? true : false
			if (tableEmpty) {
				console.log('adding query')
				addQuery(value)
				res.send('row added')
			} else if (thereIsNotSavedRow) {
				sql = 'UPDATE query SET query = ?, url = ? where id=(select id from query where account_id=2 order by id desc limit 0,1)'
				db.query(sql, [value.query, value.url || '\N'], (err, result) => {
					if (err) throw err
					res.send('query updated')
				})
			} else {
				addQuery(value)
				res.send('new row added')
			}
		})
	})
})


server.listen('3000', () => {
	console.log('server started on port 3000')
})