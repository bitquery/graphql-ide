const transporter = require('./mailer')
const crypto = require('crypto')
const bcrypt = require('bcrypt')

module.exports = function(app, passport, db) {

	app.get('/check', (req, res) => {
		let code = crypto.randomBytes(60).toString('hex')
		bcrypt.hash(code, 5, (err, hash) => {
			if (err) throw err
			console.log('hash', hash)
		})
		console.log(code)
		res.send('ok')
	}) 

	function addQuery(value) {
		let sql = `INSERT INTO query SET ?`
		db.query(sql, value, (err, result) => {
			if (err) throw err
		})
	}
	const authMiddleware = (req, res, next) => {
		if (!req.isAuthenticated()) {
			res.status(401).send('You are not authenticated')
		} else {
			return next()
		}
	}

	app.post('/api/login', (req, res, next) => {
		passport.authenticate('local-login', (err, user, info) => {
			if (err) {
				return next(err)
			}
			if (!user) {
				return res.status(400).send([user, "Cannot log in", info])
			}
			req.login(user, (err) => {
				console.log(user)
				res.send("Logged in")
			})
		})(req, res, next)
	})

	app.post('/api/signup', (req, res, next) => {
		passport.authenticate('local-signup', (err, user) => {
			if(err) return next(err)
			if (!user) {
				return res.status(400).send([user, "user already exist"])
			}
			console.log("you are in ............")
			let code = crypto.randomBytes(60).toString('hex')
			bcrypt.hash(code, 5, (err, hash) => {
				if (err) throw err
				db.query('INSERT INTO activation SET ?', {user_id: user[0].id, code: hash}, (err, res) => {
					if (err) throw err
					console.log(res)
				})
				let message = {
					from : 'fedorenki@gmail.com',
					// from : 'hello@bitquery.io',
					to: user[0].email,
					subject: 'Account activation',
					text: 'Plaintext version of the message',
					html: `<p>To activate your account follow this <a href="http://localhost:3000/activate?code=${code}">link</a> </p>`
				}
				transporter.sendMail(message)
			})
			
			req.login(user, (err) => {
				console.log(user)
				res.send("Signed up ")
			})
		})(req, res, next)
	})

	app.post('/addquery', (req, res) => {
		let value = req.body.params
		sql = `select id from query where id=(select id from query where account_id=${value.account_id} order by id desc limit 0,1) and name is null and description is null`
		db.query(sql, (err, result) => {
			if (err) throw err
			if (!result.length) {
				addQuery(value)
				res.end('saved in new row')
			} else {
				sql = `update query set name = ?, description = ?, account_id=? where id=${result[0][Object.keys(result[0])[0]]}`
				db.query(sql, [value.name || null, value.description || 'request', value.account_id], (err, result) => {
					if (err) throw err
					res.end('saved last edited row')
				})
			}
		})
		res.send('row added')
	})

	app.get('/api/logout', (req, res) => {
		req.logout()
		console.log("logged out")
		return res.send()
	});
	
	app.get("/api/user", authMiddleware, (req, res) => {
		db.query(`select * from accounts where id = ${req.session.passport.user}`, 
			(err, user) => {
				if (err) throw err
				console.log([user, req.session])
				let userSend = [{
					id: user[0].id,
					email: user[0].email,
					active: user[0].active,
					updated_at: user[0].updated_at,
					created_at: user[0].created_at
				}]
				res.send({user: userSend})
			})
	})

	app.get('/getquery/:url', (req, res) => {
		let sql = `SELECT * FROM query WHERE url='${req.params.url}'`
		db.query(sql, (err, result) => {
			if (err) throw err
			res.send(result[0])
		})
	})

	app.get('/activate', (req, res) => {
		db.query(`select code from activation where user_id = ${req.session.passport.user}`, (err, code) => {
			if (err) throw err
			bcrypt.compare(req.query.code, code[0][Object.keys(code[0])[0]], (err, result) => {
				if (err) throw err
				if (result) {
					db.query(`update accounts set active = true where id = ${req.session.passport.user}`, (err, result) => {
						if (err) throw err
						console.log('account activated', result)
						res.send('Account activated!')
					})
				} else {
					res.send('Something went wrong...')
				}
			})
		})
	})

	app.post('/forgot', (req, res) => {
		let token = crypto.randomBytes(20).toString('hex')
		db.query(`update accounts set reset_token = '${token}' where email = '${req.body.email}'`, (err, result) => {
			if (err) throw err
			if (result.affectedRows) {
				let message = {
					from : 'fedorenki@gmail.com',
					to: req.body.email,
					subject: 'Account password reset',
					text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
						'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
						'http://' + req.headers.host + '/reset/' + token + '\n\n' +
						'If you did not request this, please ignore this email and your password will remain unchanged.\n',
				}
				transporter.sendMail(message)
				res.send('An e-mail has been sent to ' + req.params.email + ' with further instructions.')
			} else {
				res.send('There is no such account with this email')
			}
		})
	})

	app.get('/reset/:token', (req, res) => {
		db.query(`select id from accounts where reset_token = '${req.params.token}'`, (err, result) => {
			if (err) throw err
			if (result.length) {
				res.redirect(`http://localhost:8080/reset/${req.params.token}`)
			} else {
				res.send('Something went wrong')
			}
		})
	})

	app.post('/reset', (req, res) => {
		bcrypt.hash(req.body.password, 5, (err, hash) => {
			if (err) throw err
			if (req.body.token) {
				db.query(`update accounts set encrypted_credentials = '${hash}' where reset_token = '${req.body.token}'`, (err, result) => {
					if (err) throw err
					console.log(result)
					res.send('Password changed!')
				})
			} else res.send(400, 'Token expired!')
		})
	})

	app.post('/changepassword', (req, res) => {
		db.query(`select encrypted_credentials from accounts where id = ${req.session.passport.user}`, (err, pass) => {
			bcrypt.compare(req.body.old_password, pass[0][Object.keys(pass[0])[0]], (err, result) => {
				if (err) throw err
				if (result) {
					bcrypt.hash(req.body.password, 5, (err, hash) => {
						if (err) throw err
						db.query(`update accounts set encrypted_credentials = '${hash}' where id = ${req.session.passport.user}`, (err, result) => {
							if (err) throw err
							console.log(result)
							res.send('Password changed!')
						})
					})
				} else {
					res.send(400, 'Wrong password!')
				}
			})
		})
		
	})
	
}
