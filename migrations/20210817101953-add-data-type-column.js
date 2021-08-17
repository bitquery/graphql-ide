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
  return db.addColumn('widgets', 'data_type', {
    type: 'string',
    length: 200,
    notNull: true,
    defaultValue: 'response'
  })
};

exports.down = function(db) {
  return db.removeColumn('widgets', 'data_type');
};

exports._meta = {
  "version": 1
};
