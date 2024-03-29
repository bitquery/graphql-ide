module.exports = {
    'connection': {
        'host': process.env.DB_HOST,
        'user': process.env.DB_USER,
        'password': process.env.DB_PASSWORD,
        'port': process.env.DB_PORT
    },
    'database': process.env.DB_NAME,
    'queries_table': 'queries',
    'query_logs_table': 'query_logs',
    'users_table': 'accounts',
    'activations_table': 'activations',
    'widgets_table': 'widgets'
};
