const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const cookieParser = require('cookie-parser')
const Promise = require('bluebird')
const flash = require("connect-flash")
//Promise.promisifyAll(require('mysql/lib/Connection').prototype)
const server = express()

server.use(cors())
server.use(flash())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(cookieParser())
server.use(session({ secret: 'session secret key', resave: false, saveUninitialized: true, cookie: { maxAge: 24 * 60000 } }))
server.use(passport.initialize())
server.use(passport.session())


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

//Passport
passport.serializeUser(function(user, done) {
	done(null, user.id)
})
passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user)
	})
})
//=================================================================================
//=================================================================================

passport.use('local-signup', new LocalStrategy({
	// by default, local strategy uses username and password, we will override with email
	usernameField : 'email',
	passwordField : 'password',
	passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, email, password, done) {

	// find a user whose email is the same as the forms email
	// we are checking to see if the user trying to login already exists
	db.query("select * from accounts where email = '"+email+"'",function(err,rows){
		console.log(rows);
		console.log("above row object, email already exist");
		if (err)
			return done(err);
		 if (rows.length) {
			return done(null, false);
		} else {

			// if there is no user with that email
			// create the user
			var newUserMysql = new Object();
			
			newUserMysql.email    = email;
			newUserMysql.password = password; // use the generateHash function in our user model
		
			var insertQuery = "INSERT INTO accounts ( email, encrypted_credentials ) values ('" + email +"','"+ password +"')";
				console.log(insertQuery);
			db.query(insertQuery,function(err,rows){
				console.log(rows)
				newUserMysql.id = rows.insertId;
			return done(null, newUserMysql);
			});	
		}	
	});
}));


//=================================================================================
//=================================================================================

passport.use('local-login', new LocalStrategy({
	// by default, local strategy uses username and password, we will override with email
	usernameField : 'email',
	passwordField : 'password',
	passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, email, password, done) { // callback with email and password from our form

	 connection.query("SELECT * FROM `accounts` WHERE `email` = '" + email + "'",function(err,rows){
		if (err)
			return done(err);
		 if (!rows.length) {
			return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
		} 
		
		// if the user is found but the password is wrong
		if (!( rows[0].password == password))
			return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
		
		// all is well, return successful user
		return done(null, rows[0]);			
	
	});
	


}));


//=================================================================================
//=================================================================================
function addQuery(value) {
	let sql = `INSERT INTO query SET ?`
	db.query(sql, value, (err, result) => {
		if (err) throw err
	})
}
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	console.log('sasai')
	//res.redirect('/');
}
server.get('/createdb', (req, res) => {
	let sql = 'CREATE DATABASE bitquery'
	db.query(sql, (err, res) => {
		if (err) throw err
		console.log(res)
		res.send('database created...')
	})
})
server.post('/signup', 
	passport.authenticate('local-signup'), 
	(req, res) => {
		console.log("you are in ............")
		console.log(req.user)
		//res.redirect('http://localhost:8080');
	}
)
server.get('/logout', isLoggedIn, (req, res) => {
	console.log(req.session)
	res.end('logged out')
	/* req.logout()
	res.end('loged out') */
})
/* server.post('/signup', (req, res) => {
	let sql = `SELECT * FROM accounts WHERE email = '${req.body.params.email}'`
	db.queryAsync(sql).then(result => {
		if (result.length) {
			res.send('email already exist')
		} else {
			sql = 'INSERT INTO accounts SET ?'
			db.queryAsync(sql, req.body.params).then(result => {
				res.end('account added')
			})
		}
	}).catch(error => console.log(error))
}) */
server.get('/getquery/:url', (req, res) => {
	let sql = `SELECT * FROM query WHERE url='${req.params.url}'`
	db.query(sql, (err, result) => {
		if (err) throw err
		res.send(result[0])
	})
})
server.post('/addquery', (req, res) => {
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
server.post('/updatequery', (req, res) => {
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
				db.query(sql, [value.query, value.url || null], (err, result) => {
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