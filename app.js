const express = require('express');
const morgan = require('morgan');
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