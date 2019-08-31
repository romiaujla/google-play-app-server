const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const playstore = require('./playstore');

const app = express();
app.use(morgan('dev'));
app.use(cors());

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Express Server is running at port ${PORT}`);
})

app.get('/', (_, res) => { 
    res.send(`Express Server is running at port ${PORT}`);
})

app.get('/apps', (req, res)=> {
    let {genres = '', sort = ''} = req.query;
    let result = [];
    

    // Parameter Validation
    if(genres){
        genres = genres.toLowerCase();
        if(!['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'].includes(genres)){
            return res
                .status(404)
                .send(`Genres must be one of 'action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'.`);
        }
    }

    if(sort){
        sort = sort.toLowerCase();
        if(!['rating','app'].includes(sort)){
            return res
                .status(404)
                .send(`Sort must be one of rating or app`);
        }else if(sort === 'rating'){
            sort = 'Rating';
        }else{
            sort = 'App';
        }
    }

    result = playstore.filter((app) => app
                                        .Genres
                                        .toLowerCase()
                                        .includes(genres));

    if(sort){
        result
            .sort((a,b) => {
                return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
            })
    }

    res.json(result);

})
