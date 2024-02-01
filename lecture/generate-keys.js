import crypto from "crypto";

const text = "Hello World!";

const hashedText = crypto.createHash("sha256").update(text).digest("base64");
const hmacText = crypto
	.createHmac("sha256", "secret")
	.update(text)
	.digest("base64");

console.log(hashedText);
console.log(hmacText);

const key = crypto.randomBytes(32).toString("hex");

console.log("key:", key);
