Steps to reproduce:
- `sudo -u postgres psql` to login DBMS as postgres user.
- `GRANT ALL GRANT ALL PRIVILEGES ON ALL TABLES TO duypeesea(ubuntu username);` to make sure we can access database without postgres acc.
- `CREATE DATABASE smartbrain` create new database named smartbrain
- Create new table `users` in smart brain:
`CREATE TABLE users (
		 id serial PRIMARY KEY REFERENCES login(id) ON DELETE CASCADE,
		 name varchar(100),
		 email text UNIQUE NOT NULL,
		 joined TIMESTAMP NOT NULL,
		 rank INT DEFAULT 0
	);`
	- Create new table `login`:
`CREATE TABLE login (
		 id serial PRIMARY KEY,
		 hash varchar(100) NOT NULL
	);`
- Now we are having a database, continue to connect it with backend.
  - `yarn add knex` A SQL query builder to query to database
  - `yarn add pg` A [collection](https://node-postgres.com/) of nodejs modules for interact with PostgreSQL databases.
  - Learn how to [build querry](https://knexjs.org/#Builder) with `knex` to manipulate database.


APIs:

Register: POST /register
data gui len:
{
	"name" : "Duy",
	"email" : "orangezuice1212+9@gmail.com",
	"password" : "duy ba dao"
}
Log in: POST /signin
data gui len:
{
	"email" : "orangezuice1212+9@gmail.com",
	"password" : "duy ba dao"
}
Get user details: GET /user/:id
Update user ranking when use app: PUT /user/:id/rank/increment
