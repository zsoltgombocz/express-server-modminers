const mongoose = require("mongoose");

require('dotenv/config')

try {
    mongoose.connect(process.env.DB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false
    });
}catch(err) {
    console.log("[Hiba - DB]:" + err)
    process.exit(0);
}

const db = mongoose.connection;

db.on("error", (err) => {
    console.log("[Hiba]:" + err);
    process.exit(0);
})

db.once("open", () => {
    console.log("[MongoDB]: Sikeresen csatlakozva az adatbázishoz.");
});

module.exports = mongoose;