const transporter = require('./mailer')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')

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
	const addWidgetConfig = (res, db, params) => {
		db.query('INSERT INTO widgets SET ?', params, (err, result) => {
			if (err) {
				console.log(err)
				res.send({err})
			} else {
				let msg = params.url ? 'Query shared!' : 'Query saved!'
				result && res.send({msg, id: params.query_id})
			}
		})
	}
	const handleAddQuery = (req, res, db) => {
		let sql = `INSERT INTO queries SET ?`
		let params = {...req.body.params}
		delete params.executed
		delete params.config
		delete params.widget_id
		delete params.displayed_data
		params.id = null
		params.published = params.url ? true : null
		db.query(sql, params, (err, result) => {
			if (err) {
				console.log(err)
				res.send({err})
			}
			let newParam = {
				displayed_data: req.body.params.displayed_data,
				query_id: result.insertId,
				widget_id : req.body.params.widget_id,
				config: JSON.stringify(req.body.params.config)
			}
			addWidgetConfig(res, db, newParam)
		})
	}
	const handleUpdateQuery = (req, res, db) => {
		if (!req.body.params.executed) {
			let params = {
				name: req.body.params.name && req.body.params.name,
				description: req.body.params.description && req.body.params.description,
				arguments: req.body.params.arguments && req.body.params.arguments,
				query: req.body.params.query && req.body.params.query,
				url: req.body.params.url ? req.body.params.url : null,
				endpoint_url: req.body.params.endpoint_url,
				updated_at: new Date()
			}
			params.published = params.url ? true : null
			db.query(`UPDATE queries SET ? where id=${req.body.params.id}`, params, (err, _) => {
				if (err) console.log(err)
				let newParam = {
					displayed_data: req.body.params.displayed_data,
					query_id: req.body.params.id,
					widget_id: req.body.params.widget_id,
					config: JSON.stringify(req.body.params.config)
				}
				addWidgetConfig(res, db, newParam)
			})
		}
	}
	const sendActivationLink = (userID, userEmail, req) => {
		let code = crypto.randomBytes(60).toString('hex')
		db.query('select * from activations where user_id=?', [userID], (err, result) => {
			if (err) console.log(err)
			console.log('result', result)
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
			html: `<p>To activate your account follow this <a href="${req.protocol}://${req.get('Host')}/api/activate?code=${code}">link</a> </p>`
		}
		transporter.sendMail(message)
	}

	app.get('/api/getw/:url', (req, response) => {
		db.query(`SELECT rd.id, rd.account_id, null as query, null as arguments, 
			rd.url, rd.name, rd.description , rd.published, rd.created_at , 
			rd.deleted , rd.updated_at , null as endpoint_url, 
			null as displayed_data, null as widget_id ,qtd.widget_id as widget_ids, null as config, rd.layout, null as widget_number 
			FROM right_dashboards rd
			LEFT JOIN (
				SELECT dashboard_id, GROUP_CONCAT(widget_id SEPARATOR ',') as widget_id 
				FROM queries_to_dashboards 
				GROUP BY dashboard_id
			) qtd
			ON qtd.dashboard_id = rd.id
			WHERE rd.url = ?`, [req.params.url], (err, result) => {
				if (err) console.log(err)
				response.send(result[0])
			})
	})

	app.post('/api/getwidget', (req, response) => {
		let  widgets = []
		console.log(req.body.ids)
		req.body.ids.split(',').forEach(id => {
			db.query(`SELECT a.*, b.displayed_data,
			b.widget_id, b.config,
			b.id as widget_number,
			r.dashboard_id as dbid,
			r.query_index
			FROM queries a
			LEFT JOIN (
				SELECT * 
				FROM queries_to_dashboards 
			) r
			ON r.dashboard_id = ? AND r.widget_id = ?
			LEFT JOIN (
						SELECT * FROM widgets
						WHERE id IN (
									SELECT MAX(id) AS id
									FROM widgets 
									GROUP BY query_id)
					  ) b 
			ON a.id=b.query_id
			WHERE b.id=?
			AND a.deleted=false`, [req.body.dbid, id, id], (err, res) => {
				if (err) console.log(err)
				widgets.push(res[0])
				widgets.length === req.body.ids.split(',').length 
					&& response.send(widgets)
			})
		})
	})

	app.post('/api/savedashboard', (req, response) => {
		req.body.id ?
		db.query(`update right_dashboards set ? WHERE id = ${req.body.id}`, {
			layout: JSON.stringify(req.body.layout)
		}, (err, res) => {
			if (err) console.log(err)
			db.query(`DELETE FROM queries_to_dashboards 
				WHERE dashboard_id=?`, [req.body.id], (err, result) => {
					if (err) console.log(err)
					req.body.widget_ids.forEach((id, i) => {
						db.query(`INSERT INTO queries_to_dashboards SET ?`, {
							dashboard_id: req.body.id,
							widget_id: id,
							query_index: req.body.dashboard_item_indexes[i]
						}, (err, _) => {
							if (err) console.log(err)

						})
					})
				})
			response.sendStatus(200)	
		}) :
		db.query('insert into right_dashboards SET ?', {
			url: 'aaaaa', //random url,
			layout: JSON.stringify(req.body.layout),
			name: 'saved dashboard',
			description: 'description',
			account_id: req.session.passport.user
		}, (err, res) => {
			if (err) console.log(err)
			req.body.widget_ids.forEach((widget_id, i)=> {
				db.query('insert into queries_to_dashboards SET ?', {
					dashboard_id: res.insertId,
					query_index: req.body.dashboard_item_indexes[i],
					widget_id
				}, (err, result) => {
					if (err) console.log(err)
				})
			})
			response.sendStatus(200)
		})	
	}) 

	app.post('/api/regenerate', (req, res) => {
		db.query('update api_keys set active=false, updated_at=CURRENT_TIMESTAMP where user_id=? and active=true',
		[req.session.passport.user], (error, _) => {
			if (error) console.log(error)
			db.query('insert into api_keys SET ?', {
				user_id: req.session.passport.user,
				key: req.body.key,
				active: true
			}, (err, _) => {
				if (err) console.log(err)
				res.send(200)
			})
		})
	})
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
		if (req.session.passport.user) {
			let query = req.body.params
			if (!query.id || query.account_id !== req.session.passport.user) {
				handleAddQuery(req, res, db)
			} else {
				handleUpdateQuery(req, res, db)
			}
		}
	})

	app.post('/api/deletequery', (req, res) => {
		db.query(`UPDATE queries SET deleted=?, updated_at=CURRENT_TIMESTAMP where id=?`, [true, req.body.id], (err, _) => {
			if (err) console.log(err)
			res.send('Query deleted')
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
		db.query(`SELECT a.*, ak.\`key\` FROM accounts a
		JOIN api_keys ak
		ON a.id = ak.user_id
		WHERE a.id = ?
		AND ak.active = true`, 
			[req.session.passport.user],
			(err, user) => {
				if (err) console.log(err)
				if (user.length) {
					let userSend = [{
						id: user[0].id,
						key: user[0].key,
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
		let sql = `
			SELECT queries.*, widgets.id as widget_number, widgets.widget_id, widgets.config, widgets.displayed_data FROM queries
			LEFT JOIN widgets 
			ON widgets.query_id=queries.id
			WHERE queries.url=?
			ORDER BY widgets.id DESC LIMIT 1`
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
			SELECT a.*, COUNT(b.id) as number,
			w.id as widget_number, w.widget_id, w.config, w.displayed_data FROM queries a
			LEFT JOIN query_logs b
			ON a.id=b.id
			LEFT JOIN (
						SELECT * FROM widgets
						WHERE id IN (
									SELECT MAX(id) AS id
									FROM widgets 
									GROUP BY query_id)
					) w 
			ON w.query_id=a.id
			WHERE a.published=true
			AND a.deleted=false
			GROUP BY a.id  
			ORDER BY number DESC`, (err, queries) => {
				if (err) console.log(err)
				res.send({queries: queries, msg: checkActive})
			})
	})
	app.get('/api/getmyqueries', (req, res) => {
		db.query(`
		(SELECT a.*, b.displayed_data, b.widget_id, null as widget_ids, b.config, null as layout, b.id as widget_number
		FROM queries a
		LEFT JOIN (
					SELECT * FROM widgets
					WHERE id IN (
								SELECT MAX(id) AS id
								FROM widgets 
								GROUP BY query_id)
				) b 
		ON a.id=b.query_id
		WHERE a.account_id=?
		AND a.deleted=false)
		UNION
		(	SELECT rd.id, rd.account_id, null as query, null as arguments, 
			rd.url, rd.name, rd.description , rd.published, rd.created_at , 
			rd.deleted , rd.updated_at , null as endpoint_url, 
			null as displayed_data, null as widget_id ,qtd.widget_id as widget_ids, null as config, rd.layout, null as widget_number
			FROM right_dashboards rd
			LEFT JOIN (
				SELECT dashboard_id, GROUP_CONCAT(widget_id SEPARATOR ',') as widget_id 
				FROM queries_to_dashboards
				GROUP BY dashboard_id
			) qtd
			ON qtd.dashboard_id = rd.id ) ORDER BY updated_at DESC`, [req.session.passport.user], (err, queries) => {
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
						? res.redirect(`${process.env.IDE_URL}`)
						: res.redirect(`http://localhost:3000`)
				})
			} else {
				res.send('Something went wrong...')
			}
		})
	})

	app.get('/api/js', (req, res) => {
		const filePath = path.resolve(__dirname, req.query.source)
		fs.readFile(filePath, 'utf8', (err, data) => {
			if (err) console.log(err)
			let js = data.match(/async function[^{]+\{([\s\S]*)\}/)[0]
			res.send(js)
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
						process.env.IDE_URL + '/api/reset/' + token + '\n\n' +
						'If you did not request this, please ignore this email and your password will remain unchanged.\n',
				}
				transporter.sendMail(message)
				res.send('An e-mail has been sent to ' + req.body.email + ' with further instructions.')
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
					? res.redirect(`${process.env.IDE_URL}/reset/${req.params.token}`)
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
