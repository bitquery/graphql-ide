'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
	dbm = options.dbmigrate;
	type = dbm.dataType;
	seed = seedLink;
};

exports.up = function (db) {
	return db.createTable('tags', {
		columns: {
			id: { type: 'int', primaryKey: true, autoIncrement: true },
			tag: {
				type: 'string',
				notNull: true,
				length: 128,
				unique: true
			}
		}
	}).then(_ => db.createTable('tags_to_queries', {
			columns: {
				query_id: {
					type: 'int',
					primaryKey: true,
					notNull: true,
					foreignKey: {
						name: 'query_id_fk',
						table: 'queries',
						rules: {
							onDelete: 'RESTRICT',
							onUpdate: 'CASCADE'
						},
						mapping: {
							'query_id': 'id'
						}
					}
				},
				tag_id: {
					type: 'int',
					primaryKey: true,
					notNull: true,
					foreignKey: {
						name: 'tag_id',
						table: 'tags',
						rules: {
							onDelete: 'RESTRICT',
							onUpdate: 'CASCADE'
						},
						mapping: {
							'tag_id': 'id'
						}
					}
				}
			}
		})
	)
};

exports.down = function (db) {
	return db.dropTable('tags_to_queries')
		.then(_ => db.dropTable('tags'))
};

exports._meta = {
	"version": 1
};
