module.exports = function(app, passport, db) {

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
			req.login(user, (err) => {
				console.log(user)
				res.send("Signed up ")
			})
		})(req, res, next)
	})

	app.post('/addquery', (req, res) => {
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

	app.post('/updatequery', (req, res) => {
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
				res.send({user: user})
			})
	})

	app.get('/getquery/:url', (req, res) => {
		let sql = `SELECT * FROM query WHERE url='${req.params.url}'`
		db.query(sql, (err, result) => {
			if (err) throw err
			res.send(result[0])
		})
	})

}
