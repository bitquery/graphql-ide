const transporter = require('./mailer')
const crypto = require('crypto')
const bcrypt = require('bcrypt')

module.exports = function(app, passport, db) {

	app.get('/api/check', (req, res) => {
		console.log(req.protocol, req.get('Host'))
		db.query('SELECT * from accounts where id = asdsa', (err, result) => {
			if (err) console.log(err)
		})
		console.log(req.protocol, req.get('Host'))
		
	}) 

	const authMiddleware = (req, res, next) => {
		if (!req.isAuthenticated()) {
			res.status(401).send('You are not authenticated')
		} else {
			return next()
		}
	}
	const sendActivationLink = (userID, userEmail, req) => {
		let code = crypto.randomBytes(60).toString('hex')
		db.query('select * from activations where user_id=?', [userID], (err, result) => {
			if (err) console.log(err)
			if (result.length) {
				db.query('update activations set code=? where user_id=?', [code, userID], (err, _) => {
					if (err) console.log(err)
				})
			} else {
				db.query('INSERT INTO activations SET ?', {user_id: userID, code: code}, (err, res) => {
					if (err) console.log(err)
					console.log(res)
				})
			}
		})
		let message = {
			from : process.env.DEFAULT_EMAIL,
			to: userEmail,
			subject: 'Account activations',
			text: 'Plaintext version of the message',
			html: `<p>To activate your account follow this <a href="${process.env.BACKEND_URL}/api/activate?code=${code}">link</a> </p>`
		}
		transporter.sendMail(message)
	}

	app.post('/api/login', (req, res, next) => {
		passport.authenticate('local-login', (err, user, info) => {
			if (err) {
				return next(err)
			}
			if (!user) {
				return res.status(400).send("Cannot log in")
			} else if (!user[0].active) {
				return res.status(400).send('Account not activated! If You do not recieve mail, can resend it in login window')
			} else {
				req.login(user, (err) => {
					console.log(user)
					res.send("Logged in")
				}) 
			}
		})(req, res, next)
	})

	app.post('/api/signup', (req, res, next) => {
		passport.authenticate('local-signup', (err, user) => {
			if(err) return next(err)
			if (!user) {
				return res.status(400).send("user already exist")
			}
			console.log("you are in ............")
			sendActivationLink(user[0].id, user[0].email, req)
			res.send('Activation link sent. Check your email for further instructions!')
		})(req, res, next)
	})
	app.post('/api/resendactivation', (req, res) => {
		let userEmail = req.body.email
		db.query('select id from accounts where email = ?', [req.body.email], (err, result) => {
			if (err) console.log(err)
			if (result[0].id) {
				sendActivationLink(result[0].id, userEmail, req)
				res.send('Activation link sent. Check your email for further instructions!')
			} else {
				res.send('There is no such user with this email')
			}
		})
	})

	app.post('/api/addquery', (req, res) => {
		let sql = `INSERT INTO queries SET ?`
		db.query(`select id, url, account_id from queries where id=?`, [req.body.params.id], (err, result) => {
			if (err) console.log(err)
			console.log(result)
			if (Array.isArray(result) && result.length) {
				console.log('there is result ', result[0].id, result[0].url, result[0].account_id)
				if (result[0].account_id === req.session.passport.user) {
					req.body.params.url ? 
						result[0].url ? res.status(400).send({msg:'Query already shared!', id: result[0].id}) 
							: db.query(`update queries set url = ?, published = ? where id = ?`, 
								[req.body.params.url, true, req.body.params.id], (err, _) => {
									if (err) console.log(err)
									res.send({msg:'Query shared!', id: result[0].id})
								})
						: res.status(400).send({msg:'Query already saved!', id: result[0].id})
				} else {
					let params = {...req.body.params}
					params.id = null
					params.published = params.url ? true : null
					db.query(sql, params, (err, result) => {
						if (err) console.log(err)
						params.url ? res.send({msg:'Query shared!', id: result.insertId}) : res.send({msg:'Query saved!', id: result.insertId})
					})
				}
			} else  {
				let params = {...req.body.params}
				params.published = params.url ? true : null
				db.query(sql, params, (err, result) => {
					if (err) console.log(err)
					params.url ? res.send({msg:'Query shared!', id: result.insertId}) : res.send({msg:'Query saved!', id: result.insertId})
				})
			}
		})
	})

	app.post('/api/addquerylog', (req, response) => {
		let value = req.body.params
			db.query(`INSERT INTO query_logs SET ?`, {
				id: value.id,
				account_id: value.account_id,
				success: value.success || 0,
				error: value.error || 0
			}, (err, res) => {
				if (err) console.log(err)
				console.log(res)
				response.send('Query logged')
			})
	}) 

	app.get('/api/logout', (req, res) => {
		req.logout()
		console.log("logged out")
		return res.send()
	});
	
	app.get("/api/user", authMiddleware, (req, res) => {
		db.query(`select * from accounts where id = ?`, 
			[req.session.passport.user],
			(err, user) => {
				if (err) console.log(err)
				if (user.length) {
					let userSend = [{
						id: user[0].id,
						email: user[0].email,
						active: user[0].active,
						updated_at: user[0].updated_at,
						created_at: user[0].created_at
					}]
					res.send({user: userSend})
				} else {
					res.status(400).send('No user found')
				}
				
			})
	})

	app.get('/api/getquery/:url', (req, res) => {
		let sql = `SELECT * FROM queries WHERE url=?`
		db.query(sql, [req.params.url], (err, result) => {
			if (err) console.log(err)
			if (!result.length) {
				res.send('There is no such querie with same url...')
			} else {
				res.send(result[0])
			}
		})
	})
	app.get('/api/getqueries', (req, res) => {
		let checkActive = req.session.active
		req.session.active = null
		if (checkActive) checkActive = 'Account activated!'
		db.query(`
			SELECT queries.*, COUNT(query_logs.id) as number FROM queries
			LEFT JOIN query_logs
			ON queries.id=query_logs.id
			WHERE published=true
			GROUP BY queries.id
			ORDER BY number DESC`, (err, queries) => {
				if (err) console.log(err)
				res.send({queries: queries, msg: checkActive})
			})
	})
	app.get('/api/getmyqueries', (req, res) => {
		db.query(`
			SELECT queries.*, COUNT(query_logs.id) as number FROM queries
			LEFT JOIN query_logs
			ON queries.id=query_logs.id
			WHERE queries.account_id=?
			GROUP BY queries.id
			ORDER BY number DESC`, [req.session.passport.user], (err, queries) => {
				if (err) console.log(err)
				res.send(queries)
		})
	})

	app.get('/api/activate', (req, res) => {
		db.query(`select * from activations where code = ?`, [req.query.code], (err, result) => {
			if (err) console.log(err)
			if (result.length) {
				db.query(`update accounts set active = true where id = ?`, [result[0].user_id], (err, result) => {
					if (err) console.log(err)
					console.log('account activated', result)
					req.session.active = true
					process.env.NODE_ENV==='production'
						? res.redirect(`${req.protocol}://${req.get('Host')}${process.env.IDE_URL}`)
						: res.redirect(`http://localhost:3000`)
				})
			} else {
				res.send('Something went wrong...')
			}
		})
	})

	app.post('/api/forgot', (req, res) => {
		let token = crypto.randomBytes(20).toString('hex')
		db.query(`update accounts set reset_token = ? where email = ?`, [token, req.body.email], (err, result) => {
			if (err) console.log(err)
			if (result.affectedRows) {
				let message = {
					from : process.env.DEFAULT_EMAIL,
					to: req.body.email,
					subject: 'Account password reset',
					text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
						'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
						process.env.BACKEND_URL + '/api/reset/' + token + '\n\n' +
						'If you did not request this, please ignore this email and your password will remain unchanged.\n',
				}
				transporter.sendMail(message)
				res.send('An e-mail has been sent to ' + req.params.email + ' with further instructions.')
			} else {
				res.send('There is no such account with this email')
			}
		})
	})

	app.get('/api/reset/:token', (req, res) => {
		db.query(`select id from accounts where reset_token = ?`, [req.params.token], (err, result) => {
			if (err) console.log(err)
			if (result.length) {
				process.env.NODE_ENV==='production'
					? res.redirect(`${req.protocol}://${req.get('Host')}${process.env.IDE_URL}/reset/${req.params.token}`)
					: res.redirect(`http://localhost:3000/reset/${req.params.token}`)
			} else {
				res.send('Something went wrong')
			}
		})
	})

	app.post('/api/reset', (req, res) => {
		bcrypt.hash(req.body.password, 5, (err, hash) => {
			if (err) console.log(err)
			if (req.body.token) {
				db.query(`update accounts set encrypted_credentials = ? where reset_token = ?`, [hash, req.body.token], (err, result) => {
					if (err) console.log(err)
					console.log(result)
					res.send('Password changed!')
				})
			} else if (req.session.passport.user) {
				db.query(`update accounts set encrypted_credentials = ? where id = ?`, [hash, req.session.passport.user], (err, result) => {
					if (err) console.log(err)
					res.send('Password changed!')
				})
			} else { res.status(400).send('Token expired!') }
		})
	})

	app.post('/api/changepassword', authMiddleware, (req, res) => {
		db.query(`select encrypted_credentials from accounts where id = ?`, [req.session.passport.user], (err, pass) => {
			bcrypt.compare(req.body.oldPwd, pass[0][Object.keys(pass[0])[0]], (err, result) => {
				if (err) console.log(err)
				if (result) {
					bcrypt.hash(req.body.newPwd, 5, (err, hash) => {
						if (err) console.log(err)
						db.query(`update accounts set encrypted_credentials = ? where id = ?`, [hash, req.session.passport.user], (err, result) => {
							if (err) console.log(err)
							console.log(result)
							res.send('Password changed!')
						})
					})
				} else {
					res.status(400).send('Wrong password!')
				}
			})
		})
		
	})
	
}
