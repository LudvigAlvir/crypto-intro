import express from "express";
import mysql from "mysql";
import "dotenv/config";
import { createHmac } from "crypto";

const app = express();
app.use(express.json());

const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
});
try {
	connection.connect();
	console.log("connection succsess");
} catch (e) {
	console.log("connection failed");
}

app.get("/", (req, res) => {
	connection.query("SELECT * FROM `users`", (err, rows, fields) => {
		if (err) {
			console.log("something went wrong");
		} else {
			res.json(rows);
		}
	});
});

app.post("/login", (req, res) => {
	const { username, password } = req.body;
	//const queryValue = connection.escape(username);
	const hashedPassword = createHmac("sha256", process.env.HASH_KEY)
		.update(password)
		.digest("base64");

	connection.query(
		"SELECT `username`, `password` FROM `users` WHERE username = ?",
		[username],
		(err, rows, fields) => {
			if (err) {
				console.log(err);
			} else {
				if (rows[0].password === hashedPassword) {
					res.json({
						message: "succsess",
					});
				} else {
					res.status(401).json({
						message: "invalid username or password",
					});
				}
			}
		}
	);
});

app.post("/register", (req, res) => {
	const { username, email, password } = req.body;
	const hashedPassword = createHmac("sha256", process.env.HASH_KEY)
		.update(password)
		.digest("base64");
	connection.query(
		"INSERT INTO `users`(`username`, `email`, `password`) VALUES(?, ?, ?)",
		[username, email, hashedPassword],
		(err, rows, fields) => {
			if (err) {
				res.json({
					message: "something went wrong",
				});
			} else {
				res.json({ message: "register success" });
			}
		}
	);
});

app.listen(3000, () => {
	console.log("server started on port 3000");
});
