const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');
const APPKEYS = [
    'App',
    'Category',
    'Rating', 
    'Reviews', 
    'Size', 
    'Installs', 
    'Type', 
    'Price', 
    'Content Rating', 
    'Genres', 
    'Last Updated', 
    'Current Ver', 
    'Android Ver'
];
const GENRES = [
    'action', 
    'puzzle', 
    'strategy', 
    'casual', 
    'arcade', 
    'card',
];
const SORT = [
    'rating', 
    'app'
];

describe(`GET /apps`, () => {

    it(`Returns an array of apps`, () => {
        return request(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                expect(res.body).to.be.an('array');
                expect(res.body.length >= 1).to.be.true;
                const app = res.body[0];
                expect(app).to.include.all.keys(APPKEYS);
            });
    });

    it(`Return status 400 if sort parameter is incorrect`, () => {
        return request(app)
            .get('/apps')
            .query({sort: 'incorrect'})
            .expect(400, `SORT must be one of ${SORT.join(', ')}`);
    });

    it(`Return status 400 if genre parameter is incorrect`, () => {
        return request(app)
            .get('/apps')
            .query({genres: 'incorrect'})
            .expect(400, `Genres must be one of ${GENRES.join(', ')}`);
    });

    it(`Sort correctly when rating parameter is passed`, () => {
        return request(app)
            .get('/apps')
            .query({sort: 'rating'})
            .expect(200)
            .then((res) => {
                expect(res.body).to.be.an('array');
                const ratingArray = res.body.map((app) => app.Rating);
                checkSorting(ratingArray);
            });
    });

    it(`Sort correctly when app parameter is passed`, () => {
        return request(app)
            .get('/apps')
            .query({sort: 'app'})
            .expect(200)
            .then((res) => {
                expect(res.body).to.be.an('array');
                const ratingArray = res.body.map((app) => app.App);
                checkSorting(ratingArray);
            });
    });

    it(`Get correct results when genres parameter is passed`, () => {
        const expectedGenre = 4; // any number <= 5
        return request(app)
            .get('/apps')
            .query({genres: GENRES[expectedGenre]})
            .expect(200)
            .then((res) => {
                expect(res.body).to.be.an('array');
                const genreArray = res.body.map((app) => app.Genres);
                console.log(genreArray);
                matchGenres(genreArray, expectedGenre);
            });
    });

    it(`Gets correct result with both the parameters`, () => {
        
        const expectedSort = 0; // any number <= 1
        const expectedGenre = 4; // any number <= 5

        return request(app)
            .get('/apps')
            .query({
                sort: SORT[expectedSort],
                genres: GENRES[expectedGenre]
            })
            .expect(200)
            .then((res) => {
                let sortArray = [];
                expect(res.body).to.be.an('array');
                
                // capitalize the sort parameter for correct sorting
                sort = SORT[expectedSort][0].toUpperCase() + SORT[expectedSort].substr(1);
                const genreArray = res.body.map((app) => app.Genres);
                const sortingArray = res.body.map((app) => app[sort]);
                matchGenres(genreArray, expectedGenre);
                checkSorting(sortingArray);
            })
    });

    // a function that checks if the sort is correct
    checkSorting = (sortArray) => {        
        let sortIsCorrect = true;
        for(let i = 1; i < sortArray.length; i++){
            sortIsCorrect = sortArray[i-1] <= sortArray[i];
        }
        expect(sortIsCorrect).to.be.true;
    }

    // a function that checks if the genre is correct
    matchGenres = (genreArray, expectedGenre) => {
        genreArray.map((genre) => {
            expect(genre.toLowerCase().includes(GENRES[expectedGenre])).to.be.true;
        })
    }

});