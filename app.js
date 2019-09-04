const express = require('express');
const morgan = require('morgan');
<<<<<<< HEAD
const cors = require('cors');
const playstore = require('./playstore');

const app = express();
app.use(morgan('dev'));
app.use(cors());

const PORT = 8000;
const GENRES = ['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'];
const SORT = ['rating', 'app'];

app.listen(PORT, () => {
    console.log(`Express Server is running at port ${PORT}`);
})

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
=======
const playstore = require('./playstore');
const cors = require('cors');
const app = express();
const SORT = [
    'rating',
    'app'
];
const GENRES = [
    'action',
    'puzzle',
    'strategy',
    'casual',
    'arcade',
    'card'
]

app.use(morgan('dev'));
app.use(cors());

app.get('/', (_, res) => {
    res.send(`Express is running`);
})

app.get('/apps', validateQuery(), (req, res) => {
    const { sort = '', genres = '' } = req.query;

    if (sort) {
        if (!SORT.includes(sort)) {
            return res
                .status(400)
                .send(`Sort must be one of ${SORT.join(', ')}`);
        }
    }

    if (genres) {
        if (!GENRES.includes(genres)) {
            return res
                .status(400)
                .send(`Genres must be one of ${GENRES.join(', ')}`);
        }
    }

    let result = playstore.map((app) => app.Genres.toLowerCase().includes(genres.toLowerCase()));

    if (sort) {
        let capitalizeSort = '';
        if (sort === 'rating') {
            capitalizeSort = 'Rating';
        } else {
            capitalizeSort = 'App';
        }
        results
            .sort((a, b) => {
                return a[capitalizeSort] > b[capitalizeSort] ? 1 : a[capitalizeSort] < b[capitalizeSort] ? -1 : 0;
            }); 
    }

    res.send(result);

});


module.exports = app;
>>>>>>> bcc552f835ffd26f754c783e699f1ac211109d1a
