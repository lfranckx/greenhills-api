const app = require('./app');
const knex = require('knex');
const { PORT, DATABASE_URL, DB_HOST, DB_USER, DB_PW, DB_NAME } = require('./config');

const db = knex({
    client: 'pg',
    connection: {
      host : DB_HOST,
      user : DB_USER,
      password : DB_PW,
      database : DB_NAME
    }
});

app.set('db', db);

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
    console.log(`DB_URL: ${DATABASE_URL}`);
});