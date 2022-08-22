const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const fileName = 'disposable-email-provider-domains'
const filePath = path.join(__dirname, '..', '..', fileName)
const fileCache = {}

const checkDisposableEmail = (email, disposableDomains, done, cb) => {
	const emailTrim = email.trim()
	const domain = emailTrim.slice( emailTrim.indexOf('@')+1 ).replace('.', '[.]')
	const re = new RegExp(`^${domain}$`, 'gm')
	if (disposableDomains.match(re)) {
		return done(null, false, {
			message: 'You cannot register with this email address'
		})
	} else {
		axios.get(`https://block-temporary-email.com/check/email/${emailTrim}`, {
			headers: {
				'x-api-key': process.env.TEMPORARY_EMAIL_KEY
			}
		}).then(({ data }) => {
			if (data.temporary) {
				return done(null, false, {
					message: 'You cannot register with this email address'
				})
			} else {
				return cb()
			}
		}).catch(error => {
			console.log(error)
			return done(null, false, {
				message: 'Something went wrong'
			})
		})
	}
}

const getFileFromCache = (email, done, cb) => {
    if (fileCache[fileName]) {
		return checkDisposableEmail(email, fileCache[fileName], done, cb)
    }
    fs.readFile(filePath, 'utf8', (err, data) => {
		if (err) {
			return done(err)
		}
		fileCache[fileName] = data
		return checkDisposableEmail(email, fileCache[fileName], done, cb)
    })
}

function makekey() {
	let result           = '';
	let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let charactersLength = characters.length;
	for ( let i = 0; i < 29; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return `BQY${result}`
  }

module.exports = function(passport, db) {
    passport.serializeUser((user, done) => {
		done(null, user[0].id)
	})
	passport.deserializeUser(async (id, done) => {
		db.query(`select * from accounts where id = ?`, [id], (err, user) => {
			done(null, user)
		})
	})
    passport.use('local-signup', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
	},

	function(email, password, done) {
		getFileFromCache(email, done, () => db.query("select * from accounts where email = ?", [email], (err,rows) => {
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
					if (err) console.log(err)
					console.log('hash', hash)
					newUser[0].password = hash
					let insertQuery = "INSERT INTO accounts ( email, encrypted_credentials, authenticated_by ) values ('" + email +"','"+ hash +"', 'local_email')"
					console.log(insertQuery)
					db.query(insertQuery, (err,rows) => {
						if (err) console.log(err)
						console.log(rows)
						newUser[0].id = rows.insertId
						db.query(`INSERT INTO api_keys SET ?`, {user_id: rows.insertId, key: makekey(), active: true}, (err, result) => {
							if (err) console.log(err)
							console.log(newUser)
							return done(null, newUser)
						})
					})
				})
			}	
		}))
	}))

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	}, (username, password, done) => {
			db.query(`select * from accounts where email = ?`, [username], (err, user) => {
				if (err) console.log(err)
				if (!user.length) done(null, false, {message: 'Incorrect user name'})
				if (user.length) {
					console.log( password, user[0].encrypted_credentials )
					bcrypt.compare(password, user[0].encrypted_credentials, (err, result) => {
						if (err) console.log(err)
						console.log(result)
						return result ? done(null, user) : done(null, false, {message: 'Wrong password'})
					})
				}
			})
	}))
}