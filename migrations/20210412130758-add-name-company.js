'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.addColumn('accounts', 'name', {
    type: 'string',
    length: 200,
    notNull: true,
    defaultValue: ''
  }).then(_ => {
    return db.runSql(`SELECT id, email, SUBSTRING_INDEX(email, '@', 1) as name from accounts`)
  }).then(result => {
    for (let i = 0; i < result.length; i++) {
      let sql = `UPDATE accounts SET name='${result[i].name}' WHERE id=${result[i].id}`
      db.runSql(sql, err => console.log(err))
    }
  }).then(_ => {
    return db.addColumn('accounts', 'company_name', {
      type: 'string',
      length: 200,
      notNull: true,
      defaultValue: ''
    })
  })
};

exports.down = function(db) {
  return db.removeColumn('accounts', 'name').then(_ => {
    return db.removeColumn('accounts', 'company_name')
  })
};

exports._meta = {
  "version": 1
};
