const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");

const port = process.env.PORT || 5001;

const app = express();

let router = express.Router();

app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));
app.use(express.text());

router.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "/public/view/index.html"));
});

app.use("/", router);

app.set("views", path.join(__dirname, "/public/view"));

app.use("/public", express.static("public"));

app.listen(port, (err) => {
	if (err) {
		console.log(err);

		return;
	}

	console.log(`Server is running on port ${port}...`);
});
