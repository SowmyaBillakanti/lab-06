'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Server route to give us our "homepage"
app.get('/location', (request, response) => {
    console.log(request.query, request.body);
    const getLocation = require('./data/location.json');
    const search_query = request.query.city;
    const newLocation = new Location(getLocation[0], search_query);
    response.send(newLocation);
});

// app.get('/weather', (request, response) => {
//     const getWeather = require('.data/weather.json');
//     const 
// })


function Location(city, search_query) {
    this.search_query = search_query;
    this.formatted_query = city.display_name;
    this.latitude = city.lat;
    this.longitude = city.lon;
}

app.listen(PORT, () => {
    console.log(`${PORT}`);
});