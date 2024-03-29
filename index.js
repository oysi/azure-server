
console.log("Hello, World!");

console.log("done");

const crypto = require("crypto");

require("dotenv").config();

const sql = require("mssql");

const express = require("express");

const cors = require("cors");
// const session = require("express-session");

const { ExpressPeerServer } = require("peer");

const app = express();
// const port = 3000;
const port = 8080;


app.use(cors());


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

app.get("/game/:code", async (req, res) => {
	try {
		const userID = req.query.userID;
		if (!userID) {
			console.error("invalid userID");
		}
		
		const code = req.params.code;
		if (!code) {
			console.error("invalid code");
		}
		
		const result = {};
		
		// get game info
		const pool = await sql.connect(config);
		const result_game = await pool.request().query(`
			SELECT
				*
			FROM tbl_Minesweeper_Games
			WHERE Code = '${code}'
		`);
		
		result.ID = result_game.recordset[0].ID;
		result.Code = result_game.recordset[0].Code;
		result.Board = result_game.recordset[0].Board;
		
		// join game
		await pool.request().input("Game_ID", result.ID).input("User_ID", userID).execute("stp_Minesweeper_JoinGame");
		
		// get users in game
		const result_users = await pool.request().query(`
			SELECT
				*
			FROM tbl_Minesweeper_GamesUsers
			WHERE Game_ID = ${result.ID}
		`);
		
		result.users = result_users.recordset.map(e => e.User_ID);
		
		console.log("result", result);
		
		res.status(200).json(result);
	} catch (err) {
		res.status(500).send("invalid");
	}
});


// app.get("/", (req, res) => {
// 	res.send("Hello, World!");
// 	sql.connect(config).then(connection => {
// 		console.log("connected"); 
// 	});
// });

const server = app.listen(port, () => {
	console.log(`Listening on port ${port}...`)
});







// WebRTC
// const server = app.listen(9000);

const peerServer = ExpressPeerServer(server, {
	path: "/myapp",
});

app.use("/peerjs", peerServer);

peerServer.on("connection", (client) => {
	// console.log("connection", client);
	console.log("connection", client.id);
});
peerServer.on("disconnect", (client) => {
	// console.log("connection", client);
	console.log("disconnect", client.id);
});
