
console.log("Hello, World!");

console.log("done");

require("dotenv").config();

const sql = require("mssql");

const express = require("express");
// const session = require("express-session");

const app = express();
// const port = 3000;
const port = 8080;


// app.use(
// 	session({
// 		secret : 'yourSecretPassPhrase',
// 		resave: true,
// 		saveUninitialized: true,
// 		cookie: {
// 			maxAge : 1000 * 60 * 60 * 24 * 2,
// 		},
// 	})
// );



const config = {
	user: process.env.DB_USER, // better stored in an app setting such as process.env.DB_USER
	password: process.env.DB_PASSWORD, // better stored in an app setting such as process.env.DB_PASSWORD
	server: process.env.DB_SERVER, // better stored in an app setting such as process.env.DB_SERVER
	port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
	database: process.env.DB_NAME, // better stored in an app setting such as process.env.DB_NAME
	authentication: {
		type: 'default'
	},
	options: {
		encrypt: true
	}
}

console.log(config);


app.get("/", (req, res) => {
	res.send("Hello, World!");
	sql.connect(config).then(connection => {
		console.log("connected"); 
	});
});

app.listen(port, () => {
	console.log(`Listening on port ${port}...`)
});


