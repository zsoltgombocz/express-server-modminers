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

app.use('/posts', authRoute, postsRoute)

app.post('/login', (req,res) => {
   res.send("asd")
})

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`[Szerver]: A szerver a ${port}-es porton fut...`));