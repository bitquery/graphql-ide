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
  return db.runSql(`UPDATE widgets AS s1
    LEFT OUTER JOIN widgets AS s2
      ON s1.query_id = s2.query_id AND s1.id < s2.id
    SET s1.active = 1 WHERE s2.query_id IS NULL;`, err => console.log(err))
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
