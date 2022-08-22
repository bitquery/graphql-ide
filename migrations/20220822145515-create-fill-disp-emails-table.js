'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */

const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, '..', 'disposable-email-provider-domains')

exports.setup = function (options, seedLink) {
	dbm = options.dbmigrate;
	type = dbm.dataType;
	seed = seedLink;
};

exports.up = function (db) {
	return db.createTable('disposable_domains', {
		columns: {
			id: { type: 'int', primaryKey: true, autoIncrement: true },
			domain: {
				type: 'string',
				notNull: true,
				length: 128,
				unique: true
			}
		}
	}).then(_ => {
		fs.readFile(filePath, 'utf8', (err, domainsString) => {
			if (err) console.log(err)
			let sql = 'insert into disposable_domains (domain) values'
			const domains = domainsString.split('\n')
			domains.forEach((item, index, arr) => sql += ` ('${item}')${index !== arr.length - 1 ? ',' : ''}`)
			return db.runSql(sql, err => console.log(err))
		})
	})
};

exports.down = function (db) {
	return db.dropTable('disposable_domains')
};

exports._meta = {
	"version": 1
};
