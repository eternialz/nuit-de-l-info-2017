exports.db = {
  user: process.env.dbuser,
  database: process.env.dbname,
  password: process.env.dbpasswd,
  host: process.env.dbhost,
  port: 5432,
  max: 20,
  idleTimeoutMillis: 3000,
  connectionTimeoutMillis: 3000
};

console.log(process.env.dbuser)
console.log(process.env.dbpasswd)
