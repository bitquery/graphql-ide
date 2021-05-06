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
  return db.createTable('dashboards', {
    columns: {
      id: { type: 'int', primaryKey: true, autoIncrement: true, notNull: true },
      account_id: { type: 'int', notNull: true, foreignKey: {
        name: 'account_id',
        table: 'accounts',
        rules: {
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE'
          },
          mapping: 'id'
        }
      },
      url: { type: 'string', length: 200 },
      name: { type: 'string', length: 200 },
      description: { type: 'text' },
      layout: { type: 'text', notNull: true },
      deleted: { type: 'boolean', notNull: true },
      published: { type: 'boolean' },
      created_at: { 
        type: 'timestamp',
        notNull: true,
        defaultValue: new String('CURRENT_TIMESTAMP')
      },
      updated_at: { 
        type: 'timestamp',
        notNull: true,
        defaultValue: new String('CURRENT_TIMESTAMP')
      }
    }
  })
};

exports.down = function(db) {
  return db.dropTable('dashboards')
};

exports._meta = {
  "version": 1
};
