const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const playstore = require('./playstore');

const app = express();
app.use(morgan('dev'));
app.use(cors());

const GENRES = ['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'];
const SORT = ['rating', 'app'];

app.get('/', (_, res) => {
    res.send(`Express Server is running at port ${PORT}`);
})

app.get('/apps', validateQuery, (req, res) => {
    let { genres = '', sort = '' } = req.query;
    let result = [];
    
    // Filtering genres
    result = playstore.filter((app) => app
        .Genres
        .toLowerCase()
        .includes(genres));

    // Sorting
    if (sort) {
        sort = sort === 'rating' ? 'Rating' : 'App';
        result
            .sort((a, b) => {
                return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
            })
    }

    res.json(result);
});

function validateQuery(req, res, next){
    let { genres = '', sort = '' } = req.query;
    let err;
    let message; 
    
    // Parameter Validation
    if (genres) {
        genres = genres.toLowerCase();
        if (!GENRES.includes(genres)) {
            message = `Genres must be one of ${GENRES.join(', ')}`;
        }
    }

    if (sort) {
        sort = sort.toLowerCase();
        if (!SORT.includes(sort)) {
            message = `SORT must be one of ${SORT.join(', ')}`;
        } 
    }

    if(message){
        err = new Error(message)
        err.status = 400;
        return next(err);
    }

    next();
}


app.use((error, req, res, next) => {
    res
        .status(error.status)
        .send(error.message);
})

module.exports = app;