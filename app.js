const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const {notFound, errorHandler, checkOrigin} = require('./middlewares')
const morgan = require('morgan')

 
//Import Database connection file
require('./database/db.js')

//Import Routes
const postsRoute = require('./routes/posts')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const discordRoute = require('./routes/dc')
const skillsRoute = require('./routes/skills')
const serverRoute = require('./routes/server')
const skinRoute = require('./routes/skins')
const pageRoute = require('./routes/page')
const logRoute = require('./routes/logs')

//Middlewares
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('[:date[iso]] ":method :url" Status: :status'))

//Routes
app.use('/posts', authRoute, postsRoute)
app.use('/user', userRoute)
app.use('/auth', authRoute)
app.use('/discord', discordRoute)
app.use('/skills', skillsRoute)
app.use('/server', serverRoute)
app.use('/skins', skinRoute)
app.use('/page', authRoute, pageRoute)
app.use('/log', logRoute)

app.get('/wakeup', (req,res) => {
    res.send("Ébren!")
})

//ErrorHandler-Middlewares
app.use(checkOrigin);
app.use(notFound);
app.use(errorHandler);

//Import EnvVariables and checking them
require('./variables.js');

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`[Szerver]: A szerver a ${port}-es porton fut...`));