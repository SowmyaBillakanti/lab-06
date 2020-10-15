'use strict';

require('dotenv').config();
const superagent = require('superagent');
const express = require('express');
const cors = require('cors');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const TRAIL_API_KEY = process.env.TRAIL_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);

app.use(cors());

app.get('/location', (request, response) => {

    let city = request.query.city;
    const url = `https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${city}&format=json`;

    let sql = 'SELECT * FROM locationdata WHERE search_query=$1;';
    let saveValues = [city];
    client.query(sql, saveValues)
        .then(results => {
            let sqlResults = results.rows;
            console.log(sqlResults, 'first query');
            if(sqlResults.length > 0) {
                console.log('We had the city');
                let city_info = sqlResults[0];
                city_info.latitude = parseFloat(city_info.latitude);
                city_info.longitude = parseFloat(city_info.longitude);
                console.log(city_info);
                response.send(city_info);
            } 
            else {
                superagent.get(url)
                        .then(data => {
                            console.log("Superagent call");
                            const newLocation = data.body[0];
                            const locationData = new Location(city, newLocation);
                            
                            let SQL = 'INSERT INTO locationdata (formatted_query, search_query, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *;';
                            let saveValues = [locationData.formatted_query, locationData.search_query, locationData.latitude, locationData.longitude];

                            client.query(SQL, saveValues)
                            .then(() => {
                                response.send(locationData);
                            })
                        })
                        .catch(err => console.error('location returned error:', err));
            }
        })
        .catch(err => {
            console.error('db error', err)
        })
});

function Location(city, search_query) {
    this.search_query = city;
    this.formatted_query = search_query.display_name;
    this.latitude = search_query.lat;
    this.longitude = search_query.lon;
}

// function Weather(data) {
//     this.forecast = data.weather.description;
//     this.time = data.datetime;
// }

// app.get('/weather', searchWeather)
//     function searchWeather (request, response) {
//         const lat = request.query.latitude;
//         const lon = request.query.longitude;
//         const url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_API_KEY}&days=8&lat=${lat}&lon=${lon}`;
    
//         superagent.get(url)
//         .then(result => {
//             const dailyWeather = result.body.data.map(day => {
//                 return new Weather(day);
//             });
//             response.send(dailyWeather);
//         })
//         .catch(err => console.error('weather returned error:', err));
//     }

//     function Trails(data) {
//         this.name = data.name;
//         this.location = data.location;
//         this.length = data.length;
//         this.stars = data.stars;
//         this.star_votes = data.starVotes;
//         this.summary = data.summary;
//         this.trail_url = data.trail_url;
//         this.conditions = data.conditionStatus;
//         this.condition_time = data.conditionDate.split(' ')[1];
//         this.condition_date = data.conditionDate.split(' ')[0];
//     }

    
// app.get('/trails', searchTrails)
//     function searchTrails (request, response) {
//         const lat = request.query.latitude;
//         const lon = request.query.longitude;
//         // console.log(request.query);
//         // console.log('latitude', lat);
//         // console.log('longitude', lon);
//         const url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=10&key=${TRAIL_API_KEY}`;

//         superagent.get(url)
//         .then(result => {
//             // console.log('+++++++++++++++++++++++++++++++', result.body.trails);
//             const trailData = result.body.trails.map(trail => {
//                 return new Trails(trail)
//                })
//             response.send(trailData);
//         })
//         .catch(err => console.error('Trail returned error:', err));
//     }

// app.get('*', (request, response) => {
//     response.status(500).send('Sorry something went wrong');
// })

// connect to our database
client.connect()
  .then( () => {
    // start the server if the db connection worked!
    app.listen(PORT, () => {
      console.log(`server up on: ${PORT}`);
    });
  })
  .catch( err => {
    console.error('connection error:', err);
  })