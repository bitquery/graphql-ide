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
  return db.runSql(`insert into accounts (email, active) values ('ide', true), ('explorer', true)`)
    .then(result => {
      return db.runSql(`insert into api_keys (user_id, \`key\`, active) values
      (${result.insertId}, '${makekey()}', true),
      (${result.insertId+1}, '${makekey()}', true)`)
    })
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
