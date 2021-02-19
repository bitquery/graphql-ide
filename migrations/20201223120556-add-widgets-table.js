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
  return db.createTable('widgets', {
    columns: {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      displayed_data: { type: 'string', length: 200 },
      query_id: {type: 'int', notNull: true, foreignKey: {
      name: 'query_id',
      table: 'queries',
      rules: {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
        },
        mapping: 'id'
      }},
      widget_id: {type: 'string', length: 200},
      config: {type: 'text'}  
    }  
  })
};

exports.down = function(db) {
  return db.dropTable('widgets')
};

exports._meta = {
  "version": 1
};
