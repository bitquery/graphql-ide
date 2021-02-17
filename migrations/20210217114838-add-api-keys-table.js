'use strict';

var dbm;
var type;
var seed;

function makekey() {
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( let i = 0; i < 30; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result
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
  return db.createTable('api-keys', {
    columns: {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      user_id: { type: 'int', length: 10, notNull: true, foreignKey: {
        name: 'id',
        table: 'accounts',
        rules: {
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE'
        },
        mapping: 'id'
      } },
      key: {
        type: 'string',
        notNull: true,
        length: 32,
        unique: true
      },
      active: { type: 'boolean', notNull: true },
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
  return db.dropTable('api-keys')
};

exports._meta = {
  "version": 1
};
