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
  return db.addIndex('api_keys', 'user_id_active', ['user_id', 'active'])
};

exports.down = function(db) {
  return db.removeIndex('api_keys' ,'user_id_active')
};

exports._meta = {
  "version": 1
};
