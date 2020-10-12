const { connect } = require('mongoose');
let mysql = require('mysql');
let dbconfig = require('./databaseConfig');

let connection = mysql.createConnection(dbconfig.connection);

connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query(`
	CREATE TABLE ${dbconfig.database}.${dbconfig.query_table} (
		id INT(10) not null auto_increment primary key,
		account_id INT(10) not null,
		query LONGTEXT not null,
		arguments LONGTEXT not null,
		url VARCHAR(128),
		name VARCHAR(50),
		description LONGTEXT,
		share VARCHAR(64),
		published BOOLEAN,
		success_count INT(10) not null,
		error_count INT(10) not null,
		last_called TIMESTAMP,
		created_at TIMESTAMP not null default CURRENT_TIMESTAMP
)`)
connection.query(`
	create table ${dbconfig.database}.${dbconfig.users_table} (
		id INT(10) not null auto_increment primary key,
		email VARCHAR(50) not null,
		authenticated_by VARCHAR(20),
		encrypted_credentials VARCHAR(100),
		active BOOLEAN default false,
		updated_at TIMESTAMP,
		created_at TIMESTAMP not null default CURRENT_TIMESTAMP
)`)
connection.query(`
	create table ${dbconfig.database}.activation (
		user_id INT(10) not null,
		code VARCHAR(128) not null
	)
`)

console.log('Success: Database Created!')

connection.end();
