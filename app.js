const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

require('./database/db.js')

const morgan = require('morgan')

//IMPORT ROUTES
const postsRoute = require('./routes/posts')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')

//MIDDLEWARE
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('[LOG] :remote-addr - :remote-user [:date[web]]: ":method :url HTTP/:http-version" Status: :status :res[content-length] ":referrer" ":user-agent" Header: [:res[header]][:res[header]]"'))

app.use('/posts', authRoute, postsRoute)

app.use('/user', userRoute)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`[Szerver]: A szerver a ${port}-es porton fut...[${process.env.NODE_ENV || 'development'}]`));