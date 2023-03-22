const express = require('express');
const app = express();
require('dotenv').config();

const user_router = require('./routes/user');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.get('/api', function (req, res) {
    res.send('Registration API')
})

app.use('/api/user', user_router);

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on ' + `http://localhost:${listener.address().port}/api`);
})
