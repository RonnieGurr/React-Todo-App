const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv/config');

const mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true}, () => {
    console.log(mongoose.connection.readyState);
})

app.use(bodyParser.json(), cors(
    {origin: 'http://localhost:3000',
    AccessControlAllowHeaders: 'Authorization'}
    ))

//Routes
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const getTodos = require('./routes/getTodos');
const saveTodos = require('./routes/saveTodos');
const deleteTodos = require('./routes/deleteTodos');
const token = require('./routes/token');

app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/getTodos', getTodos);
app.use('/saveTodos', saveTodos);
app.use('/deleteTodos', deleteTodos);
app.use('/token', token);

app.use(express.json())

app.listen(3001);