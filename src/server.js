const express = require('express')
const mysql = require('mysql')

const server = express()
const db = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	port: 3307
})

  //Connect
db.connect(err => {
	if (err) throw err
	console.log('MySql Connected...')
})

server.get('/createdb', (req, res) => {
	let sql = 'CREATE DATABASE bitquery'
	db.query(sql, (err, res) => {
		if (err) throw err
		console.log(res)
		res.send('database created...')
	})
})


server.listen('3000', () => {
console.log('server started on port 3000')
})