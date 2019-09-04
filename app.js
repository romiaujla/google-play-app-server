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
        // capitalize sort , e.g. is it is rating change it to Rating
        sort = sort[0].toUpperCase() + sort.substr(1);
        console.log(sort);
        result
            .sort((a, b) => {
                return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
            })
    }

    res.json(result);
});

// Validation Moduule, to check for  query errors
function validateQuery(req, _, next){
    let { genres = '', sort = '' } = req.query;
    let err;
    let message; 
    
    // Genres Validation
    if (genres) {
        genres = genres.toLowerCase();
        if (!GENRES.includes(genres)) {
            message = `Genres must be one of ${GENRES.join(', ')}`;
        }
    }

    // Sort Validation
    if (sort) {
        sort = sort.toLowerCase();
        if (!SORT.includes(sort)) {
            message = `SORT must be one of ${SORT.join(', ')}`;
        } 
    }

    // Return error if validation fails
    if(message){
        err = new Error(message)
        err.status = 400;
        return next(err);
    }

    return next();
}

// Error handler, returns the errors required, avoids redundant code
app.use((error, _, res, __) => {
    res
        .status(error.status)
        .send(error.message);
})

module.exports = app;