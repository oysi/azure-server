
console.log("Hello, World!");

console.log("done");

const crypto = require("crypto");

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


app.get("/newgame", async (req, res) => {
	const userID = req.query.userID;
	if (userID) {
		try {
			const code = crypto.randomUUID();
			
			let board = "";
			for (let y = 0; y < 16; y++) {
				for (let x = 0; x < 24; x++) {
					if (Math.random() <= 0.1) {
						board += "1";
					} else {
						board += "0";
					}
				}
				board += ";";
			}
			
			const pool = await sql.connect(config);
			const result = await pool.request().input("UserID", userID).input("Code", code).input("Board", board).execute("stp_Minesweeper_NewGame");
			
			console.log("result", result);
			
			res.status(200).json({Code: result.recordset[0].Code});
		} catch (err) {
			console.log("error", err);
			res.status(500).send(err);
		}
	} else {
		console.log("bad request");
		res.status(400).send("Bad request");
	}
});


// app.get("/", (req, res) => {
// 	res.send("Hello, World!");
// 	sql.connect(config).then(connection => {
// 		console.log("connected"); 
// 	});
// });

app.listen(port, () => {
	console.log(`Listening on port ${port}...`)
});


