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
    res.send("We are on home! Video 10.32")
})

app.use('/posts', postsRoute)

const port = process.env.PORT || 3000
//Connect to DB
mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true , useUnifiedTopology: true}, () => console.log("Connected to DB!"))

app.listen(port, () => console.log(`Server is running and listening on port ${port}...`));