const knex = require('knex')({
    client: 'pg',
    connection: {
      host : 'localhost',
      user : 'postgres',
      password : '0rangesaucer1',
      database : 'greenhills'
    }
});
  
knex.raw('SELECT NOW()')
.then((result) => {
    console.log(result.rows[0].now);
})
.catch((error) => {
    console.error(error);
})
.finally(() => {
    knex.destroy();
});