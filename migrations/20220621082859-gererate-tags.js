'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
	dbm = options.dbmigrate;
	type = dbm.dataType;
	seed = seedLink;
};

exports.up = function (db) {
	return db.runSql('SELECT query, id from queries WHERE published = 1 ')
		.then(result => {
			if (result.length) {
				const regex = new RegExp('([a-z]+)(?=[(]|[{]|[ ])', 'gmi')
				let uniqueTags = []
				result.forEach(({ query, id }) => {
					let tags = query.match(regex)
					if (tags) {
						tags = tags.filter(tag => tag !== 'query').slice(0, 2)
						uniqueTags = uniqueTags.concat(tags)
					}
				})
				uniqueTags = [...new Set(uniqueTags)]
				let sql = 'INSERT INTO tags (tag) VALUES'
				for (let i = 0; i < uniqueTags.length; i++) {
					sql += ` ('${uniqueTags[i]}')`
					if (i !== uniqueTags.length - 1) sql +=','
				}
				return db.runSql(sql).then(someshit => {
						const values = []
						for (let k = 0; k < result.length; k++) {
							const { id: query_id, query } = result[k]
							let tags = query.match(regex)
							if (tags) {
								tags = tags.filter(tag => tag !== 'query').slice(0, 2)
								for (let j = 0; j < tags.length; j++) {
									const tag_id = uniqueTags.indexOf(tags[j]) + 1
									values.push({query_id, tag_id})
								}
							}
						}
						let sql = 'INSERT INTO tags_to_queries (query_id, tag_id) VALUES'
						for (let i = 0; i < values.length; i++) {
							sql += ` (${values[i].query_id}, ${values[i].tag_id})`
							if (i !== values.length - 1) sql +=','
						}
						return db.runSql(sql, err => console.log(err))
					})
			}
		})
};

exports.down = function (db) {
	return db.runSql('DELETE FROM tags_to_queries')
		.then(_ => db.runSql('DELETE FROM tags'))
};

exports._meta = {
	"version": 1
};
