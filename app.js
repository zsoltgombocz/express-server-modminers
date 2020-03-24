const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')

//IMPORT ROUTES
const postsRoute = require('./routes/posts')
const authRoute = require('./routes/auth')

const app = express();

//MIDDLEWARE
app.use(bodyParser.json())
app.use(authRoute)


app.get('/', (req,res) => {
    res.send("Az API jelenleg teszt fázisban van.")
})

app.use('/posts', postsRoute)

const port = process.env.PORT || 3000
//Connect to DB
try {
    mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true , useUnifiedTopology: true}, () => console.log("[MongoDB]: Csatlakozva az adatbázishoz!"));
}catch (error){
    console.log("[MongoDB csatlakozás]:"+error);
}
mongoose.connection.on('error', err => {
    console.log("[MongoDB hiba]:"+err);
});

app.listen(port, () => console.log(`[Szerver]: A szerver a ${port}-es porton fut...`));