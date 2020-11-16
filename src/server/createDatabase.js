require('dotenv').config()
let mysql = require('mysql')
let dbconfig = require('./databaseConfig')

let connection = mysql.createConnection(dbconfig.connection)

connection.query('CREATE DATABASE ' + dbconfig.database)

connection.query(`
	CREATE TABLE ${dbconfig.database}.${dbconfig.queries_table} (
		id INT(10) not null auto_increment primary key,
		account_id INT(10) not null,
		query LONGTEXT not null,
		arguments LONGTEXT not null,
		url VARCHAR(200),
		name VARCHAR(200),
		description LONGTEXT,
		deleted BOOLEAN not null default FALSE,
		published BOOLEAN,
		created_at TIMESTAMP not null default CURRENT_TIMESTAMP
)`)
connection.query(`
	create table ${dbconfig.database}.${dbconfig.users_table} (
		id INT(10) not null auto_increment primary key,
		email VARCHAR(200) not null,
		authenticated_by VARCHAR(20),
		encrypted_credentials VARCHAR(100),
		active BOOLEAN default false,
		reset_token VARCHAR(128), 
		updated_at TIMESTAMP,
		created_at TIMESTAMP not null default CURRENT_TIMESTAMP
)`)
connection.query(`
	create table ${dbconfig.database}.${dbconfig.query_logs_table} (
		id INT(10) not null,
		account_id INT(10),
		success BOOLEAN not null DEFAULT 0,
		error LONGTEXT,
		called_at TIMESTAMP not null default CURRENT_TIMESTAMP
	)
`)
connection.query(`
	create table ${dbconfig.database}.${dbconfig.activations_table} (
		user_id INT(10) not null,
		code VARCHAR(128) not null
	)
`)

console.log('Success: Database Created!')

connection.end()
