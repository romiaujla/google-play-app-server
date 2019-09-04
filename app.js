const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(morgan('dev'));
app.use(cors());

app.get('/', (_,res) => {
    res.send(`Express is running`);
})



module.exports = app;