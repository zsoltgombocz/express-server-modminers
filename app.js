const express = require('express');
const bodyParser = require('body-parser')
const app = express();
require('dotenv/config')
require('./database/db.js')

//IMPORT ROUTES
const postsRoute = require('./routes/posts')
const authRoute = require('./routes/auth')

//MIDDLEWARE
app.use(bodyParser.json())

app.get('/', authRoute, (req,res) => {
    res.send("Az API jelenleg teszt fázisban van.")
})

app.use('/posts', authRoute, postsRoute)

const port = process.env.PORT || 3000
//Connect to DB


app.listen(port, () => console.log(`[Szerver]: A szerver a ${port}-es porton fut...`));