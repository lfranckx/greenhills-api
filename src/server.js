const app = require('./app');
const knex = require('knex');
const { PORT, DATABASE_URL, DB_HOST, DB_USER, DB_PW, DB_NAME } = require('./config');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  }
});

// Test database connection
db.select(1)
  .then(() => console.log('Database connection successful'))
  .catch(error => console.error('Database connection error', error));

app.set('db', db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
  console.log(`DB_URL: ${DATABASE_URL}`);
});