const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const {notFound, errorHandler} = require('./middlewares')
const morgan = require('morgan')

//Import Database connection file
require('./database/db.js')

//Import Routes
const postsRoute = require('./routes/posts')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')

//Middlewares
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('[AUTO-LOG] :remote-addr - :remote-user [:date[web]]: ":method :url HTTP/:http-version" Status: :status :res[content-length] ":referrer" ":user-agent" Header: [:res[header]][:res[header]]"'))

//Routes
app.use('/posts', authRoute, postsRoute)
app.use('/user', userRoute)

//ErrorHandler-Middlewares
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`[Szerver]: A szerver a ${port}-es porton fut...`));