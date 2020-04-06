const express = require('express');
const bodyParser = require('body-parser')
const app = express();

require('./database/db.js')

//IMPORT ROUTES
const postsRoute = require('./routes/posts')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')

//MIDDLEWARE
app.use(bodyParser.json())

app.use('/posts', authRoute, postsRoute)

app.use('/user', userRoute)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`[Szerver]: A szerver a ${port}-es porton fut...`));