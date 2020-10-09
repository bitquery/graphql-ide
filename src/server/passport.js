var LocalStrategy   = require('passport-local').Strategy
var bcrypt = require('bcrypt-nodejs')

module.exports = function(passport, db) {
    passport.serializeUser((user, done) => {
		done(null, user[0].id)
	})
	passport.deserializeUser(async (id, done) => {
		db.query(`select * from accounts where id = ${id}`, (err, user) => {
			done(null, user)
		})
	})
    passport.use('local-signup', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
	},
	function(email, password, done) {
		db.query("select * from accounts where email = '"+email+"'", (err,rows) => {
			console.log(rows)
			console.log("above row object, email already exist")
			if (err)
				return done(err)
			 if (rows.length) {
				return done(null, false)
			} else {
				let newUser = [{}]
				newUser[0].email = email
				newUser[0].password = password
				let insertQuery = "INSERT INTO accounts ( email, encrypted_credentials ) values ('" + email +"','"+ password +"')"
				db.query(insertQuery, (err,rows) => {
					console.log(rows)
					newUser[0].id = rows.insertId
					console.log(newUser)
					return done(null, newUser)
				})
			}	
		})
	}))
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	}, (username, password, done) => {
			db.query(`select * from accounts where email = '${username}' and encrypted_credentials = '${password}'`, (err, user) => {
			if (err) return done(err)
			if (user.length) {
				console.log(user)
				return done(null, user)
			} else {
				return done(null, false, {message: 'Incorrect username or password'})
			}
		})	        
	}))
}