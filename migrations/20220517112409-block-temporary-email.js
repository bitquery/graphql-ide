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

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
	
	return db.runSql(`
		SELECT bp.user_id, SUBSTRING_INDEX(a.email, '@', -1) AS domain
		FROM billing_periods bp
		LEFT JOIN accounts a ON bp.user_id=a.id
		GROUP BY a.id
	`).then(result => {
		fs.readFile(filePath, 'utf8', (err, domains) => {
			if (err) console.log(err)
			for (let i = 0; i < result.length; i++) {
				const domain = result[i].domain.replace('.', '[.]')
				const re = new RegExp(`^${domain}$`, 'gm')
				if (domains.match(re)) {
					console.log(result[i].user_id, domain)
					db.runSql(`
						UPDATE billing_periods SET is_blocked=1 
						WHERE user_id = ${result[i].user_id}
					`)
				}
			}
		})
	})
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
