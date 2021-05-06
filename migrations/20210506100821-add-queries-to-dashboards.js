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
  return db.createTable('queries_to_dashboards', {
    columns: {
      dashboard_id: { type: 'int', primaryKey: true, foreignKey: {
        name: 'dashboard_id',
        table: 'dashboards',
        mapping: {
          'dashboard_id': 'id'
        },
        rules: {
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE'
        },
        }
      },
      widget_id: { type: 'int', primaryKey: true, foreignKey: {
        name: 'widget_id',
        table: 'widgets',
        mapping: {
          'widget_id': 'id'
        },
        rules: {
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE'
        },
        },
      },
      query_index: { type: 'string', length: 20 }
    }
  })
};

exports.down = function(db) {
  return db.dropTable('queries_to_dashboards')
};

exports._meta = {
  "version": 1
};
