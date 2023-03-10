
console.log("Hello, World!");

console.log("done");

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
