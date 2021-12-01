const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const search = require('./controllers/search')

const app = express();
const port = process.env.PORT || 4050;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.options('*', cors()) 
app.post('*', cors()) 
app.use('/search',search);

app.listen(port, ()=>   {
    console.log("App listening on port",port)
})