'use strict';

require('dotenv').config();
const superagent = require('superagent');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

app.use(cors());

app.get('/location', (request, response) => {
    try {
        // console.log(request.query, request.body);
        // const getLocation = require('./data/location.json');
        const city = request.query.city;

        const url = `https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${city}&format=json`;
    

        superagent.get(url)
        .then(data => {
            const newLocation = data.body[0];
            console.log(newLocation);
            const locationData = new Location(city, newLocation);
            console.log(locationData);
            response.json(locationData)
        })
        .catch(err => console.error('returned error:', err));
    } catch {
        response.status(500).send('Sorry, something went wrong');
    }
});

function Location(city, search_query) {
    this.search_query = city;
    this.formatted_query = search_query.display_name;
    this.latitude = search_query.lat;
    this.longitude = search_query.lon;
}

app.get('/weather', (request, response) => {
    // const getWeather = require('./data/weather.json');
    const url = `HTTPS: https://api.weatherbit.io/v2.0/forecast/daily?kry${WEATHER_API_KEY}&city=${undefined}`;
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