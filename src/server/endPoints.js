const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const sdk = require('postman-collection')
const codegen = require('postman-code-generators')
const bodyParser = require('body-parser')

const getCodeSnippet = (lang, query, variables, key, endpoint_url) => 
	new Promise((resolve, reject) => {
		const request = new sdk.Request({
			url: endpoint_url,
			method: 'POST',
			header: { 'Content-Type': 'application/json', 'X-API-KEY': key },
			body: JSON.stringify({ query, variables })
		})
		const language = lang.key
		const variant = lang.variant
		const options = {
			indentCount: 3,
			indentType: 'Space',
			trimRequestBody: true,
			followRedirect: true
		}
		codegen.convert(language, variant, request, options, function(error, snippet) {
			if (error) {
				reject(error)
			}
			resolve(snippet)
		})
	}
)

const getTeamAdmin = async (query, queryListType, account_id) => {
	if (queryListType !== 'team') {
		return
	} else {
		const results = await query(`
			select a.ancestry, a.children_count
			from accounts a where a.id = ?`, [account_id])
		if (!results.length) {
			res.sendStatus(400)
		} else {
			//it is team admin
			if (results[0].children_count) {
				return account_id
			//there is ancestry in results, it is team member
			} else {
				return results[0].ancestry
			}
		}
	}
}

module.exports = function(app, db, redisClient) {

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
	
	const handleTags = async (query_id, tags, res, msg, update = false, url) => {
		if (tags) {
			const date = new Date(new Date()).toISOString().split('T')[0]
			let newTagsXML = ''
			let newUrl = url ? `\n<url>
	<loc>https://ide.bitquery.io/${encodeURIComponent(url)}</loc>
	<lastmod>${date}</lastmod>
</url>` : ''
			for (const tag of tags) {
				if (update) await query('DELETE FROM tags_to_queries WHERE query_id = ?', [query_id])
				const results = await query('SELECT id FROM tags WHERE tag = ?', [tag])
				if (!results.length) {
					const { insertId: tag_id } = await query('INSERT INTO tags SET ?', { tag })
					await query('INSERT INTO tags_to_queries SET ?', { query_id, tag_id })
					const date = new Date(new Date()).toISOString().split('T')[0]
					newTagsXML += `\n<url>
	<loc>https://ide.bitquery.io/explore/${encodeURIComponent(tag)}</loc>
	<lastmod>${date}</lastmod>
</url>`
				} else {
					const tag_id = results[0].id
					const queryInstance = await query('SELECT * from tags_to_queries WHERE tag_id = ? AND query_id = ?', [tag_id, query_id])
					if (!queryInstance.length) {
						await query('INSERT INTO tags_to_queries SET ?', { query_id, tag_id })
					}
				}
			}
			if (newTagsXML || newUrl) {
				const sitemappath = path.resolve('./static', 'sitemap.xml')
				fs.readFile(sitemappath, 'utf8', (err, data) => {
					const splitArray = data.split('\n')
					splitArray.splice(-2, 2)
					let result = splitArray.join('\n')
					result = result + newUrl + newTagsXML
					fs.writeFile(sitemappath, `${result}\n</urlset>\n`, err => {
						console.log(err)
						msg ? res.status(201).send(msg) : res.sendStatus(201)
					})
				})
			} else {
				msg ? res.status(201).send(msg) : res.sendStatus(201)
			}
		} else {
			res.status(400).send({msg: 'Add some tags to your query!'})
		}
	}

	app.get('/api/querytss/:symbol', async ({ params: { symbol } }, res) => {
		const [queryTemplates, templateSubject] = await Promise.all([
			query('select * from query_templates'),
			query('select * from template_subjects where symbol = ?', [ symbol ])
		])
		const tokensymbol = templateSubject[0].symbol
		const tokenaddress = templateSubject[0].address
		const apislist = queryTemplates.map(api => {
			return {
				...api,
				tokenaddress,
				description: api.description.replaceAll('$tokensymbol', tokensymbol),
				name: api.name.replaceAll('$tokensymbol', ''),
				url: api.url.replaceAll('$tokensymbol', tokensymbol),
			}
		})
		res.status(200).send(apislist)
	})

	app.post('/api/composeqt', async (req, res) => {	
		await query('insert into query_templates (subject_type, api_version, name, description, url) values ?',
			[query_templates.map(q => [q.subject_type, q.api_version, q.name, q.description, q.url])])
		await query('insert into template_subjects set ?', [template_subjects])
		res.sendStatus(200)
	})	
	
	app.get('/api/version', async (req, res) => {
		res.status(200).send('version 1.0.17')
	})

	app.post('/api/codesnippet', async (req, res) => {
		const { language, query, variables, endpoint_url, key } = req.body
		const snippet = await getCodeSnippet(language, query, variables, key, endpoint_url)
		res.status(200).send({ snippet })
	})

	app.post('/api/search', async (req, res) => {
        try {
            const results = await query(`SELECT DISTINCT * from queries q
            INNER JOIN (
                SELECT name as owner_name, id as aid from accounts
            ) a
            ON a.aid = q.account_id
            LEFT JOIN (
                SELECT query_id , GROUP_CONCAT(t.tag) AS tags FROM tags_to_queries tq
                INNER JOIN tags t ON t.id = tq.tag_id
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
            where (q.published = 1 or q.account_id = ?) AND (match (q.name, q.description) against (?)
            or q.name like ? or q.description like ?)
            ORDER BY q.updated_at DESC`, [req.account_id, req.body.search, `%${req.body.search}%`, `%${req.body.search}%`])
            res.status(200).send(results)
        } catch (error) {
            console.log(error)
            res.sendStatus(400)
        }
    })

	app.get('/api/transferedquery/:query', async (req, res) => {
		const query = await redisClient.get(req.params.query)
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

	app.post('/api/checkurl', async (req, res) => {
		const results = await query(`select id from queries where url = ?`, [req.body.url])
		if (results.length) {
			res.sendStatus(200)
		} else {
			res.sendStatus(204)
		}
	})

	app.post('/api/taggedqueries/:tag/:page', async (req, res) => {
		//queryListType = 'explore' || 'myqueries' || 'team'
		const queryListType = req.body.queryListType
		const teamAdmin = await getTeamAdmin(query, queryListType, req.account_id)
		let sql = {}
		sql.query = `SELECT * from queries q
		INNER JOIN (
			SELECT name as owner_name, id as aid from accounts
		) a
		ON a.aid = q.account_id
		LEFT JOIN (
			SELECT query_id , GROUP_CONCAT(t.tag) AS tags FROM tags_to_queries tq
			INNER JOIN tags t ON t.id = tq.tag_id
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
		${req.params.tag === 'All queries' ? '' : `inner join tags_to_queries ttq on ttq.query_id = q.id
		inner join (
			SELECT id as tag_id, tag from tags
		) ttags
		ON ttq.tag_id = ttags.tag_id`}
		WHERE ${queryListType === 'explore' 
			? 'published = 1' 
			: queryListType === 'myqueries'
				? 'account_id = ?' 
				: 'account_id in (select id from accounts a where a.id = ? or a.ancestry = ?)'}
		${req.params.tag === 'All queries' ? '' : 'AND tag = ?'}
		ORDER BY q_cnt.cnt DESC
		LIMIT ${req.params.page}, 11`
		if (req.params.tag === 'All queries') {
			sql.param = queryListType === 'team' ? [teamAdmin, teamAdmin] : [req.account_id]
		} else {
			sql.param = queryListType === 'explore'
				? [req.params.tag]
				: queryListType === 'myqueries' 
					? [req.account_id, req.params.tag]
					: [teamAdmin, teamAdmin, req.params.tag]
		}
		const results = await query(sql.query, sql.param)
		res.status(200).send(results)	
	})

	app.post('/api/tags', async (req, res) => {
		//queryListType = 'explore' || 'myqueries' || 'team'
		const queryListType = req.body.queryListType
		const teamAdmin = await getTeamAdmin(query, queryListType, req.account_id)
		const there = queryListType === 'explore'
			? 'published = 1'
			: queryListType === 'myqueries'
				? 'account_id = ?'
				: 'account_id in (select id from accounts a where a.id = ? or a.ancestry = ?)'
		const props = queryListType === 'team'
			? [teamAdmin, teamAdmin, teamAdmin, teamAdmin]
			: [req.account_id, req.account_id]			
		// const there = req.body.explore ? 'published = 1' : 'account_id = ?'
		const results = await query(
			`select 
				COUNT(ttq.tag_id) as tags_count,
				ttq.tag_id, t.tag
			from tags_to_queries ttq 
			inner join (
				select id as query_id, published, account_id
				from queries q 
			) q 
			on ttq.query_id = q.query_id
			inner join tags t 
			on t.id = ttq.tag_id
			where ${there} 
			group by tag
			union
			select COUNT(*) as tags_count, 0 as tag_id, 'All queries' as tag
			from queries q2 
			where q2.${there}
			order by tags_count desc`, props)
		res.status(200).send(results)
	})

	app.post('/api/tagspr', (req, res) => {
		const { query_id, tags } = req.body.params
		handleTags(db, query_id, tags, res)
	})

	app.put('/api/tagspr', (req, res) => {
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
					FROM queries_to_dashboards a
					LEFT JOIN (SELECT * FROM widgets) b
					ON a.widget_id = b.id
					LEFT JOIN (SELECT * FROM queries) q
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
	
	const addWidgetConfig = async (res, params, url) => {
		await query(`UPDATE widgets SET active = FALSE WHERE query_id=?`, [params.query_id])
		try {
			const results = await query('INSERT INTO widgets SET ?', {...params, active: true})
			let msg = params.url ? 'Query shared!' : 'Query saved!'
			return {msg, id: params.query_id, url}
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
		if (params.published && !/^https:\/\/.+\.bitquery\.io.*/gm.test(params.endpoint_url)) {
			res.status(400).send({msg: 'You can not save query with non-bitquery.io URL'})
			return
		}
		const matchURL = new RegExp(/(http(|s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/, 'gm')
		if (
			params.name?.match(matchURL) ||
			params.description?.match(matchURL) ||
			params.query?.match(matchURL) ||
			params.variables?.match(matchURL) ||
			tags?.some(tag => tag.match(matchURL))
		) {
			res.status(400).send({msg: 'Something went wrong!'})
			return
		}
		const fixURL = async (url) => {
			let u = url
			const fixRequired = await query(`select id from queries where url = ?`, [u])
			if (fixRequired.length) {
				const replacer = u.match(/[0-9]$/gm)?.[0]
				u = fixURL(replacer ? `${u.replaceAll(`_${replacer}`, '')}_${+replacer+1}` : `${url}_${1}`)
			}
			return u
		}
		params.url = await fixURL(params.url)
		const { insertId: query_id } = await query(sql, params)
		let newParam = { 
			displayed_data,
			data_type,
			query_id,
			widget_id,
			config: JSON.stringify(config)
		}
		const msg = await addWidgetConfig(res, newParam, params.url)
		handleTags(query_id, tags, res, msg, false, params.url)
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
			const tags = req.body.params.tags
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
				handleTags(req.body.params.id, tags, res, msg, true)
			} else {
				res.status(400).send({msg: 'Error updating query'})
			}
		}
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
		FROM queries_to_dashboards a
		LEFT JOIN (SELECT * FROM widgets) b
		ON a.widget_id = b.id
		LEFT JOIN (SELECT * FROM queries) q
		ON q.id=b.query_id
		WHERE dashboard_id = ?`, [req.body.dbid], (err, res) => {
			if (err) console.log(err)
			response.send(res)
		})
	})

	app.post('/api/savedashboard', (req, response) => {
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
			params.account_id = req.account_id
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
	
	app.post('/api/addquery', (req, res) => {
		let query = req.body.params
		if (!query.id || query.account_id !== req.account_id) {
			handleAddQuery(req, res, db)
		} else {
			handleUpdateQuery(req, res, db)
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
	
	app.get("/api/user", async (req, res) => {
		const results = await query(`SELECT a.*, ak.\`key\` FROM accounts a
			JOIN api_keys ak
			ON a.id = ak.account_id
			WHERE a.id = ?
			AND ak.active = true`,
			[req.account_id])
		if (results.length) {
			let user = [{
				id: results[0].id,
				key: results[0].key,
				email: results[0].email,
				active: results[0].active,
				updated_at: results[0].updated_at,
				created_at: results[0].created_at,
				role: results[0].role,
				children_count: +results[0].children_count,
				ancestry: results[0].ancestry,
				graphql_admin_url: process.env.GRAPHQL_ADMIN_URL,
				graphql_legacy_url: process.env.GRAPHQL_LEGACY_URL,
				graphql_url: process.env.GRAPHQL_URL
			}]
			res.status(200).send({ user })
		} else {
			res.status(200).send({user: [{
				graphql_legacy_url: process.env.GRAPHQL_LEGACY_URL,
				graphql_url: process.env.GRAPHQL_URL,
				graphql_admin_url: process.env.GRAPHQL_ADMIN_URL,
				key: 'key'
			}]})
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
			ORDER BY number DESC`, async (err, queries) => {
				if (err) console.log(err)
				const transferedKey = req.session?.transferedKey
				req.session.transferedKey = null
				if (transferedKey) {
					const query = await redisClient.get(transferedKey)
					if (query !== null) {
						res.send({queries: queries, msg: checkActive, transferedQuery: JSON.parse(query)})
					} else {
						res.send({queries: queries, msg: checkActive})
					}
				} else {
					res.send({queries: queries, msg: checkActive})
				}
			}
		)
	})
	app.post('/api/widgetconfig', bodyParser.urlencoded({ extended: true }), async (req, res) => {
		const code = crypto.randomBytes(3).toString('hex')
		const storageTime = req.account_id ? 10000 : 60*60*24
		const queryLink = `/${req.body.url}`
		await redisClient.set(code, JSON.stringify(req.body), { EX: storageTime })
		const ps = `${queryLink}?config=${code}`
		if (req.account_id) {
			res.set('Location', ps)
		} else {
			const fullUrl = req.protocol + '://' + req.get('host') + ps
			res.set('Location', `${process.env.GRAPHQL_ADMIN_URL}/auth/login?redirect_to=${encodeURIComponent(fullUrl)}`)
		}
		res.sendStatus(302)
	})
	app.get('/api/getwidgetconfig/:id', async (req, res) => {
		const widgetConfig = await redisClient.get(req.params.id)
		if (widgetConfig !== null) {
			console.log('there is some widgetconfig')
			res.status(200).send(JSON.parse(widgetConfig))
		} else {
			res.sendStatus(400)
		}
	})
	app.post('/api/copyquery', async (req, res) => {
		const queryID = req.body.queryID
		const queryLink = `${req.protocol}://${req.get('host')}/query/${queryID}`
		const storageTime = 60*30
		const query = await redisClient.get(queryID)
		if (query === null) {
			await redisClient.set(queryID, JSON.stringify(req.body.query), { EX: storageTime })
		}
		return res.status(200).send(queryLink)
	})

	app.get('/api/bygraphqlqueryid/:queryid', async (req, res) => {
		const query = await redisClient.get(req.params.queryid)
		if (query !== null) {
			console.log('there is some query')
			res.status(200).send(JSON.parse(query))
		} else {
			res.sendStatus(400)
		}
	})

	app.post('/api/querytransfer', bodyParser.urlencoded({ extended: true }), async (req, res) => {
		const code = crypto.randomBytes(3).toString('hex')
		const queryLink = `/transfer/${code}`
		const storageTime = req.account_id ? 10 : 60*60*24
		await redisClient.set(code, JSON.stringify(req.body), { EX: storageTime })
		if (req.account_id) {
			res.set('Location', queryLink)
		} else {
			const fullUrl = req.protocol + '://' + req.get('host') + queryLink
			res.set('Location', `${process.env.GRAPHQL_ADMIN_URL}/auth/login?redirect_to=${encodeURIComponent(fullUrl)}`)
		}
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
			ORDER BY a.updated_at DESC`, [req.account_id], (err, queries) => {
				if (err) console.log(err)
				res.send(queries)
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

}
