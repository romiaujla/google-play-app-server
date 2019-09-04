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
    'card'
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
    })
})