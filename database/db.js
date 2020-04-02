const mongoose = require("mongoose");

require('dotenv/config')

mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", (err) => {
    console.log("[Hiba]:" + err);
});

db.once("open", () => {
    console.log("[MongoDB]: Sikeresen csatlakozva az adatbázishoz.");
});

module.exports = mongoose;