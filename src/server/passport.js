var LocalStrategy   = require('passport-local').Strategy
var bcrypt = require('bcrypt')

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
				newUser[0].authenticated_by = 'local_email'
				bcrypt.hash(password, 5, (err, hash) => {
					if (err) throw err
					console.log('hash', hash)
					newUser[0].password = hash
					let insertQuery = "INSERT INTO accounts ( email, encrypted_credentials ) values ('" + email +"','"+ hash +"')"
					console.log(insertQuery)
					db.query(insertQuery, (err,rows) => {
						console.log(rows)
						newUser[0].id = rows.insertId
						console.log(newUser)
						return done(null, newUser)
					})
				})
				
			}	
		})
	}))
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	}, (username, password, done) => {
			db.query(`select * from accounts where email = '${username}'`, (err, user) => {
				if (err) throw err
				if (!user.length) done(null, false, {message: 'Incorrect user name'})
				if (user.length) {
					console.log( password, user[0].encrypted_credentials )
					bcrypt.compare(password, user[0].encrypted_credentials, (err, result) => {
						if (err) throw err
						console.log(result)
						return result ? done(null, user) : done(null, false, {message: 'Wrong password'})
					})
				}
			})
	}))
}