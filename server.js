'use strict';

require('dotenv').config();

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/location', (request, response) => {
    try {
        console.log(request.query, request.body);
        const getLocation = require('./data/location.json');
        const search_query = request.query.city;
        const newLocation = new Location(getLocation[0], search_query);
        response.send(newLocation);
    } catch {
        response.status(500).send('Sorry, something went wrong');
    }
});

function Location(city, search_query) {
    this.search_query = search_query;
    this.formatted_query = city.display_name;
    this.latitude = city.lat;
    this.longitude = city.lon;
}

app.get('/weather', (request, response) => {
    const getWeather = require('./data/weather.json');
    const weatherArr = [];
    getWeather.data.map(weather => {
        const currentWeather = new Weather(weather);
        weatherArr.push(currentWeather);
    })
    response.send(weatherArr);
});

function Weather(data) {
    this.forecast = data.weather.description;
    this.time = data.datetime;
}

app.get('*', (request, response) => {
    response.status(500).send('Sorry something went wrong');
})

app.listen(PORT, () => {
    console.log(`${PORT}`);
});