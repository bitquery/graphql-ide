const transporter = require('./mailer')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')
const axios = require('axios')

const authMiddleware = (req, res, next) => {
	if (!req.isAuthenticated()) {
		res.status(401).send('You are not authenticated')
	} else {
		return next()
	}
}
module.exports = function(app, passport, db, redisClient) {

	const query = (sql, values) => new Promise((resolve, reject) => {
		const callback = (err, results) => {
			if (err) {
				console.log(err)
				reject(err)
			}
			resolve(results)
		}
		values
			? db.query(sql, values, callback)
			: db.query(sql, callback)
	})
	
	const handleTags = async (query_id, tags, res, msg) => {
		if (tags) {
			tags.forEach(async (tag, i, arr) => {
				const results = await query('SELECT id FROM tags WHERE tag = ?', [tag])
				if (!results.length) {
					const { insertId: tag_id } = await query('INSERT INTO tags SET ?', { tag })
					await query('INSERT INTO tags_to_queries SET ?', { query_id, tag_id })
					msg ? res.status(201).send(msg) : res.sendStatus(201)
				} else {
					const tag_id = results[0].id
					const queryInstance = await query('SELECT * from tags_to_queries WHERE tag_id = ? AND query_id = ?', [tag_id, query_id])
					if (!queryInstance.length) {
						await query('INSERT INTO tags_to_queries SET ?', { query_id, tag_id })
					}
					if (i === arr.length - 1) {
						msg ? res.status(201).send(msg) : res.sendStatus(201)
					}
				}
			})
		} else {
			res.status(400).send({msg: 'Add some tags to your query!'})
		}
	}
	
	app.post('/api/search', async (req, res) => {
		try {
			const results = await query(`SELECT DISTINCT * from queries q
			INNER JOIN (
				SELECT name as owner_name, id as aid from accounts
			) a
			ON a.aid = q.account_id
			LEFT JOIN (
				SELECT query_id , GROUP_CONCAT(t.tag) AS tags FROM bitquery.tags_to_queries tq
				INNER JOIN bitquery.tags t ON t.id = tq.tag_id
				GROUP BY query_id
			) t
			ON q.id = t.query_id
			LEFT JOIN (
				select id as noid, count(1) cnt
				from query_logs where success =1
				GROUP by id
			) q_cnt on q_cnt.noid = q.id
			LEFT JOIN (
				SELECT w.id as w_id, w.widget_id, w.displayed_data, w.query_id, w.config, w.active, w.data_type 
				FROM widgets w
				WHERE id IN (
							SELECT MAX(id) AS id
							FROM widgets 
							GROUP BY query_id)
			) b 
			ON q.id=b.query_id
			where match (q.name, q.description) against (?)
			or q.name like '%${req.body.search}%' or q.description like '%${req.body.search}%'
			ORDER BY q.updated_at DESC`, [req.body.search])
			res.status(200).send(results)
		} catch (error) {
			console.log(error)
			res.sendStatus(400)
		}
	})

	app.get('/api/transferedquery/:query', (req, res) => {
		redisClient.get(req.params.query, async (error, query) => {
			if (error) console.log(error)
			if (query !== null) {
				console.log('there is some query')
				res.status(200).send({transferedQuery: JSON.parse(query)})
			} else {
				res.status(200).send({transferedQuery: {
					query: 'QUERY DOES NOT EXIST!',
					variables: ''
				}})
			}
		})
	})

	app.post('/api/checkurl', async (req, res) => {
		const results = await query(`select id from queries where url = ?`, [req.body.url])
		if (results.length) {
			res.sendStatus(200).send(results)
		} else {
			res.sendStatus(400)
		}
	})

	app.get('/api/taggedqueries/:tag/:page', async (req, res) => {
		const makesql = (patch = '', limit = 0) => `SELECT * from queries q
		INNER JOIN (
			SELECT name as owner_name, id as aid from accounts
		) a
		ON a.aid = q.account_id
		LEFT JOIN (
			SELECT query_id , GROUP_CONCAT(t.tag) AS tags FROM bitquery.tags_to_queries tq
			INNER JOIN bitquery.tags t ON t.id = tq.tag_id
			GROUP BY query_id
		) t
		ON q.id = t.query_id
		LEFT JOIN (
			select id as noid, count(1) cnt
			from query_logs where success =1
			GROUP by id
		) q_cnt on q_cnt.noid = q.id
		LEFT JOIN (
			SELECT w.id as w_id, w.widget_id, w.displayed_data, w.query_id, w.config, w.active, w.data_type 
			FROM widgets w
			WHERE id IN (
						SELECT MAX(id) AS id
						FROM widgets 
						GROUP BY query_id)
		) b 
		ON q.id=b.query_id
		${patch}
		LIMIT ${limit}, 51`
		let sql = {}
		if (req.params.tag === 'My queries') {
			sql.query = makesql('WHERE q.account_id = ? ORDER BY q.updated_at DESC', req.params.page)
			sql.param = [req.session.passport.user]
		} else {
			sql.query = makesql(`
				inner join tags_to_queries ttq on ttq.query_id = q.id
				inner join (
					SELECT id as tag_id, tag from tags
				) ttags
				ON ttq.tag_id = ttags.tag_id
				WHERE tag = ?
				and published = 1
				ORDER by q_cnt.cnt DESC`, req.params.page)
			sql.param = [req.params.tag]
		}
		const results = await query(sql.query, sql.param)
		res.status(200).send(results)	
	})

	app.get('/api/tags', async (req, res) => {
		const results = await query(
			`select 
				COUNT(ttq.tag_id) as tags_count,
				ttq.tag_id, t.tag
			from tags_to_queries ttq 
			inner join (
				select id as query_id, published
				from queries q 
			) q 
			on ttq.query_id = q.query_id
			inner join tags t 
			on t.id = ttq.tag_id 
			where published = 1
			group by tag
			UNION
			SELECT COUNT(q.account_id) as tags_count, 0 as id, 'My queries' as tag
			FROM queries q
			where q.account_id = ?
			order by tags_count desc`, [req?.session?.passport?.user])
		res.status(200).send(results)
	})

	app.post('/api/tagspr', authMiddleware, (req, res) => {
		const { query_id, tags } = req.body.params
		handleTags(db, query_id, tags, res)
	})

	app.put('/api/tagspr', authMiddleware, (req, res) => {
		const { query_id, tags } = req.body.params
		db.query('DELETE FROM tags_to_queries WHERE query_id = ?', [query_id], (err, _) => {
			if (err) console.log(err)
			handleTags(db, query_id, tags, res)
		})
	})
	
	app.get('/api/dbcode/:url', (req, response) => {
		db.query(`SELECT rd.id, rd.account_id, null as query, null as variables, 
			rd.url, rd.name, rd.description , rd.published, rd.created_at , 
			rd.deleted, rd.javascript, rd.updated_at , null as endpoint_url, 
			null as displayed_data, null as widget_id ,qtd.widget_id as widget_ids, null as config, rd.layout, null as widget_number 
			FROM dashboards rd
			LEFT JOIN (
				SELECT dashboard_id, GROUP_CONCAT(widget_id SEPARATOR ',') as widget_id 
				FROM queries_to_dashboards 
				GROUP BY dashboard_id
			) qtd
			ON qtd.dashboard_id = rd.id
			WHERE rd.url = ?`, [req.params.url], (err, result) => {
				if (err) console.log(err)
				/* response.send(result[0]) */
				db.query(`SELECT a.dashboard_id , a.widget_id as widget_number, a.query_index, b.*, q.*
					FROM bitquery.queries_to_dashboards a
					LEFT JOIN (SELECT * FROM bitquery.widgets) b
					ON a.widget_id = b.id
					LEFT JOIN (SELECT * FROM bitquery.queries) q
					ON q.id=b.query_id
					WHERE dashboard_id = ?`, [result[0].id], (err, res) => {
						if (err) console.log(err)
						response.send({widgets: res, layout: result[0].layout})
					})
			})
	})

	app.get('/api/check', (req, res) => {
		console.log(req.protocol, req.get('Host'))
		db.query('SELECT * from accounts where id = asdsa', (err, result) => {
			if (err) console.log(err)
		})
		console.log(req.protocol, req.get('Host'))
		
	}) 
	
	const addWidgetConfig = async (res, params, widget_id) => {
		await query(`UPDATE widgets SET active = FALSE WHERE query_id=?`, [params.query_id])
		try {
			const results = await query('INSERT INTO widgets SET ?', {...params, active: true})
			widget_id && await query(
				`update queries_to_dashboards set ? where widget_id=${widget_id}`,
				{ widget_id: results.insertId }
			)
			let msg = params.url ? 'Query shared!' : 'Query saved!'
			return {msg, id: params.query_id}
		} catch (error) {
			res.status(400).send('Error adding widget Config')
		}
	}
	const handleAddQuery = async (req, res) => {
		let sql = `INSERT INTO queries SET ?`
		let {executed, config, widget_id, displayed_data,
			isDraggable, isResizable, data_type, tags, 
			...params} = req.body.params
		params.id = null
		params.published = params.url ? true : null

		const { insertId: query_id } = await query(sql, params)
		let newParam = { 
			displayed_data,
			data_type,
			query_id,
			widget_id,
			config: JSON.stringify(config)
		}
		const msg = await addWidgetConfig(res, newParam)
		handleTags(query_id, tags, res, msg)
	}
	const handleUpdateQuery = async (req, res, db) => {
		if (!req.body.params.executed) {
			let params = {
				name: req.body.params.name && req.body.params.name,
				description: req.body.params.description && req.body.params.description,
				variables: req.body.params.variables,
				query: req.body.params.query && req.body.params.query,
				url: req.body.params.url ? req.body.params.url : null,
				endpoint_url: req.body.params.endpoint_url,
				updated_at: new Date()
			}
			params.published = !!params.url
			const response = await query(`select published from queries where id = ?`, [req.body.params.id])
			console.log(response[0].published)
			if (!response[0].published) {
				await query(`UPDATE queries SET ? where id=${req.body.params.id}`, params)
				let newParam = {
					data_type: req.body.params.data_type,
					displayed_data: req.body.params.displayed_data,
					query_id: req.body.params.id,
					widget_id: req.body.params.widget_id,
					config: JSON.stringify(req.body.params.config)
				}
				const msg = await addWidgetConfig(res, newParam)
				msg ? res.status(201).send(msg) : res.sendStatus(201)
			} else {
				res.status(400).send({msg: 'Error updating query'})
			}
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
			html: `<p>To activate your account follow this <a href="${process.env.IDE_URL}/api/activate?code=${code}">link</a> </p>`
		}
		transporter.sendMail(message)
	}

	app.get('/api/getw/:url', (req, response) => {
		db.query(`SELECT rd.id, rd.account_id, null as query, null as variables, 
			rd.url, rd.name, rd.description , rd.published, rd.created_at , 
			rd.deleted, rd.javascript, rd.updated_at , null as endpoint_url, 
			null as displayed_data, null as widget_id ,qtd.widget_id as widget_ids, null as config, rd.layout, null as widget_number 
			FROM dashboards rd
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
		console.log(req.body)
		db.query(`SELECT a.dashboard_id , a.widget_id as widget_number, a.query_index, b.*, q.*
		FROM bitquery.queries_to_dashboards a
		LEFT JOIN (SELECT * FROM bitquery.widgets) b
		ON a.widget_id = b.id
		LEFT JOIN (SELECT * FROM bitquery.queries) q
		ON q.id=b.query_id
		WHERE dashboard_id = ?`, [req.body.dbid], (err, res) => {
			if (err) console.log(err)
			response.send(res)
		})
	})

	app.post('/api/savedashboard', (req, response) => {
		/* console.log(req.body)
		response.send(200) */
		const params = {
			layout: JSON.stringify(req.body.layout),
			name: req.body.name,
			url: req.body.url,
			description: req.body.description,
			published: req.body.url ? true : false,
			deleted: req.body.deleted || 0
		}
		if (req.body.javascript) params.javascript = JSON.stringify(req.body.javascript)
		if (req.body.id) {
			params.updated_at = new Date()
		} else {
			params.account_id = req.session.passport.user
		}
		req.body.id ?
		db.query(`update dashboards set ? WHERE id = ${req.body.id}`, params, (err, res) => {
			if (err) console.log(err)
			if (req.body.content.length) {
				let widget_ids = [...req.body.widget_ids]
				db.query(`DELETE FROM queries_to_dashboards 
					WHERE dashboard_id=?`, [req.body.id], (err, result) => {
						if (err) console.log(err)
						widget_ids.forEach((widget_id, i) => {
							if (widget_id === -1) {
								db.query(`insert into widgets SET ?`, {
									displayed_data: null,
									query_id: null,
									widget_id: 'block.content',
									config: JSON.stringify({content: req.body.content[i]})
								}, (err, result) => {
									if (err) console.log(err)
									widget_ids[i] = result.insertId
									db.query(`INSERT INTO queries_to_dashboards SET ?`, {
										dashboard_id: req.body.id,
										widget_id: result.insertId,
										query_index: req.body.dashboard_item_indexes[i]
										}, (err, _) => {
											if (err) console.log(err)
									})
								})
							} else {
								req.body.content[i] ? db.query(`update widgets set ? WHERE id = ${widget_id}`, 
								{config: JSON.stringify({content: req.body.content[i]})},
								(err, result) => {
									if (err) console.log(err)
									db.query(`INSERT INTO queries_to_dashboards SET ?`, {
										dashboard_id: req.body.id,
										widget_id: widget_id,
										query_index: req.body.dashboard_item_indexes[i]
										}, (err, _) => {
											if (err) console.log(err)
									})
								}) : db.query(`INSERT INTO queries_to_dashboards SET ?`, {
									dashboard_id: req.body.id,
									widget_id: widget_id,
									query_index: req.body.dashboard_item_indexes[i]
									}, (err, _) => {
										if (err) console.log(err)
								})
							}
						})
					response.sendStatus(200)
				})
			} else {
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
					response.sendStatus(200)
				})
			}
		}) :
		db.query('insert into dashboards SET ?', params, (err, res) => {
			if (err) console.log(err)
			req.body.widget_ids && req.body.widget_ids.forEach((widget_id, i)=> {
				if (widget_id === -1) {
					db.query(`insert into widgets SET ?`, {
						displayed_data: null,
						query_id: null,
						widget_id: 'block.content',
						config: JSON.stringify({content: req.body.content[i]})
					}, (err, result) => {
						if (err) console.log(err)
						db.query('insert into queries_to_dashboards SET ?', {
							dashboard_id: res.insertId,
							query_index: req.body.dashboard_item_indexes[i],
							widget_id: result.insertId
						}, (err, result) => {
							if (err) console.log(err)
						})
					})
				} else {
					db.query('insert into queries_to_dashboards SET ?', {
						dashboard_id: res.insertId,
						query_index: req.body.dashboard_item_indexes[i],
						widget_id: widget_id
					}, (err, result) => {
						if (err) console.log(err)
					})
				}
			})
			response.send({msg: 'Dashboard saved!', id: res.insertId})
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

	function verifyUser(value) {
		const params = new URLSearchParams()
		params.append('secret', process.env.CAPTCHA)
		params.append('response', value)
		const config = {
			headers: {
			  'Content-Type': 'application/x-www-form-urlencoded'
			}
		}
		return axios.post('https://www.google.com/recaptcha/api/siteverify', params, config)
	}

	app.post('/api/signup', (req, res, next) => {
		verifyUser(req.body.captcha).then(result => {
			if (result.data.success) {
				passport.authenticate('local-signup', (err, user, message) => {
					if(err) return next(err)
					if (!user) {
						return res.status(400).send(message?.message || "user already exist")
					}
					db.query('UPDATE accounts SET name=?, company_name=? WHERE email=?', [
						req.body.accountName,
						req.body.companyName,
						req.body.email
					], (err, _) => {
						if (err) console.log(err)
						axios.post(`https://api.hubapi.com/contacts/v1/contact/?hapikey=${process.env.HUBSPOT}`,
							{
								properties: [
									{
										"property": "email",
										"value": req.body.email
									},
									{
										"property": "firstname",
										"value": req.body.accountName
									},
									{
										"property": "company",
										"value": req.body.companyName
									},
									{
										"property": "channel",
										"value": "IDE"
									}
								]
							},
						).catch(error => {
							console.log(error.response.data)
						})
						sendActivationLink(user[0].id, user[0].email, req)
						res.send('Activation link sent. Check your email for further instructions!')
					})
				})(req, res, next)
			} else {
				res.status(400).send('bad')
			}
		})
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
		req.body.layout 
			? db.query(`UPDATE dashboards SET deleted=?, updated_at=CURRENT_TIMESTAMP where id=?`, [true, req.body.id], (err, _) => {
				if (err) console.log(err)
				res.send('Dashboard deleted')
			})
			: db.query(`UPDATE queries SET deleted=?, updated_at=CURRENT_TIMESTAMP where id=?`, [true, req.body.id], (err, _) => {
				if (err) console.log(err)
				res.send('Query deleted')
			})
	})

	app.post('/api/querylog', (req, response) => {
		db.query(`INSERT INTO query_logs SET ?`, { ...req.body.params },
		(err, res) => {
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
	
	app.get("/api/user", authMiddleware, async (req, res) => {
		const results = await query(`SELECT a.*, ak.\`key\` FROM accounts a
			JOIN api_keys ak
			ON a.id = ak.user_id
			WHERE a.id = ?
			AND ak.active = true`,
			[req.session.passport.user])
		if (results.length) {
			let userSend = [{
				id: results[0].id,
				key: results[0].key,
				email: results[0].email,
				active: results[0].active,
				updated_at: results[0].updated_at,
				created_at: results[0].created_at,
				role: results[0].role
			}]
			res.status(200).send({user: userSend})
		} else {
			res.status(400).send('No user found')
		}
	})
	app.get('/api/getquery/:url', (req, res) => {
		let sql = `
			SELECT queries.*, widgets.id as widget_number, widgets.widget_id, widgets.config, widgets.displayed_data, widgets.data_type FROM queries
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
			w.widget_id, w.config, w.displayed_data FROM queries a
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
				redisClient.get('query', async (error, query) => {
					if (error) console.log(error)
					if (query !== null) {
						console.log('there is some query')
						res.send({queries: queries, msg: checkActive, transferedQuery: JSON.parse(query)})
					} else {
						res.send({queries: queries, msg: checkActive})
					}
				})
			})
	})
	app.post('/api/querytransfer', (req, res) => {
		const code = crypto.randomBytes(3).toString('hex')
		redisClient.setex(code, 10, JSON.stringify(req.body))
		res.set('Location', `${process.env.IDE_URL}/transfer/${code}`)
		res.sendStatus(302)
	})
	app.get('/api/getmyqueries', (req, res) => {
		db.query(`
		SELECT a.*, b.displayed_data, b.widget_id, b.config 
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
			AND a.deleted=false
			ORDER BY a.updated_at DESC`, [req.session?.passport?.user || undefined], (err, queries) => {
				if (err) console.log(err)
				res.send(queries)
		})
	})
	
	app.get('/api/activate', (req, res) => {
		db.query(`select * from activations where code = ?`, [req.query.code], (err, result) => {
			if (err) console.log(err)
			if (result.length) {
				const user_id = result[0].user_id
				db.query(`update accounts set active = true where id = ?`, [user_id], (err, result) => {
					if (err) console.log(err)
					console.log('account activated', result)
					req.session.active = true
					db.query('SELECT * from billing_periods WHERE user_id = ?', [user_id], (err, billing_period) => {
						if (err) console.log(err)
						if (!billing_period.length) {
							const billingPeriods = {}
							const now = new Date()
							billingPeriods.user_id = user_id
							billingPeriods.started_at = new Date ( now.setUTCHours(0, 0, 0, 0) ).toISOString().replace('T', ' ').replace('Z', '')
							now.setDate( now.getDate() + 30 )
							now.setUTCHours(23, 59, 59)
							const ended_at = now.toISOString()
							billingPeriods.ended_at = ended_at.replace('T', ' ').replace('Z', '')
							billingPeriods.created_at = new Date().toISOString().replace('T', ' ').replace('Z', '')
							billingPeriods.updated_at = new Date().toISOString().replace('T', ' ').replace('Z', '')
							billingPeriods.day_of_month = new Date().getDate()
							db.query('INSERT INTO billing_periods SET ?', {...billingPeriods}, (err, _) => {
								if (err) console.log(err)
								process.env.NODE_ENV==='production'
									? res.redirect(`${process.env.IDE_URL}`)
									: res.redirect(`http://localhost:3005`)
							})
						} else {
							process.env.NODE_ENV==='production'
										? res.redirect(`${process.env.IDE_URL}`)
										: res.redirect(`http://localhost:3005`)
						}
					})
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
			let js = data?.match(/async function[^{]+\{([\s\S]*)\}/)[0]
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
