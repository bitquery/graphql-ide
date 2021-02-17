'use strict';

var dbm;
var type;
var seed;

function makekey() {
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( let i = 0; i < 29; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return `BQY${result}`
}

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
  return db.runSql(
    `SELECT id from accounts`
  ).then(ids => {
    let sql = 'INSERT INTO `api-keys` (user_id, `key`, active) VALUES'
    for (let i = 0; i < ids.length; i++) {
      sql += ` (${ids[i].id}, '${makekey()}', true)`
      if (i !== ids.length - 1) sql +=',' 
    }
    return db.runSql(sql, err => console.log(err))
  })
};

exports.down = function(db) {
  return db.runSql('DELETE FROM `api-keys`');
};

exports._meta = {
  "version": 1
};
