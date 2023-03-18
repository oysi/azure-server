
console.log("Hello, World!");

console.log("done");

const mssql = require("mssql");

const express = require("express");
const app = express();
// const port = 3000;
const port = 80;

app.get("/", (req, res) => {
	res.send("Hello, World!");
});

app.listen(port, () => {
	console.log(`Listening on port ${port}...`)
});

app.listen(443, () => {
	console.log(`Listenign on port 443...`);
});

app.listen(8080, () => {
	console.log("Listening on port 8080...");
});



console.log(process.env.ENV_VAR);

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


