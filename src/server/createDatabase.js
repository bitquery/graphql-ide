require('dotenv').config()
let mysql = require('mysql')
let dbconfig = require('./databaseConfig')

let connection = mysql.createConnection(dbconfig.connection)

connection.query('CREATE DATABASE ' + dbconfig.database + ' character set UTF8mb4 collate utf8mb4_bin')

connection.query(`
	CREATE TABLE ${dbconfig.database}.${dbconfig.queries_table} (
		id INT(10) not null auto_increment primary key,
		account_id INT(10) not null,
		query LONGTEXT not null,
		variables LONGTEXT not null,
		headers LONGTEXT not null,
		url VARCHAR(200),
		name VARCHAR(200),
		endpoint_url VARCHAR(200) not null,
		description LONGTEXT,
		deleted BOOLEAN not null default FALSE,
		published BOOLEAN,
		created_at TIMESTAMP not null default CURRENT_TIMESTAMP
)`)
connection.query(`
	create table ${dbconfig.database}.${dbconfig.users_table} (
		id INT(10) not null auto_increment primary key,
		email VARCHAR(200) not null default '',
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
connection.query(`
	create table ${dbconfig.database}.${dbconfig.widgets_table} (
		id INT PRIMARY KEY AUTO_INCREMENT,
		query_id INT not null,
		widget_id VARCHAR(200),
		config LONGTEXT,
		FOREIGN KEY (query_id) REFERENCES queries (id)
		ON DELETE RESTRICT ON UPDATE CASCADE
	)
`)

console.log('Success: Database Created!')

connection.end()
