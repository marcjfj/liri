const axios = require('axios');
const Spotify = require('node-spotify-api');
const chalk = require('chalk');
const moment = require('moment');
var fs = require('fs');
require('dotenv').config();
const keys = require('./keys.js');

const spotify = new Spotify(keys.spotify);

let qType = process.argv[2];
let query = process.argv.splice(3).join(' ');

function bitQ(q) {
  axios
    .get(
      `https://rest.bandsintown.com/artists/${q}/events?app_id=codingbootcamp`
    )
    .then(res => {
      //   console.log(res.data);
      console.log(chalk`Upcoming {blue ${query}} Events`);
      console.log(chalk`----------------------------------------------`);
      res.data.forEach(event => {
        console.log(
          chalk`{yellow ${moment(event.datetime).format('MMM Do')}} : {cyan ${
            event.venue.name
          }} (${event.venue.city}), ${event.venue.region})`
        );
        console.log(
          chalk`{gray |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||}`
        );
      });
    });
}
function omdbQ(q) {
  axios.get(`http://www.omdbapi.com/?apikey=trilogy&t=${q}`).then(res => {
    // console.log(res.data);
    console.log(
      chalk`{gray -------------------------------------------------}`
    );
    console.log(
      chalk`{black.bold.bgYellow  ${res.data.Title} }{gray |||||}{cyan ${
        res.data.Year
      }}{gray ||||||}{cyan ${res.data.Rated}}`
    );
    console.log(
      chalk`{gray -------------------------------------------------}`
    );
    console.log(
      chalk`{yellow.bold Ratings: }{cyan IMDB: ${
        res.data.imdbRating
      }}{gray ||||||}{cyan Rotten Tomatoes: ${res.data.Ratings[1].Value}}`
    );
    console.log(
      chalk`{gray -------------------------------------------------}`
    );
    console.log(
      chalk`{yellow.bold Locality: }{cyan ${
        res.data.Country
      }}{gray |||||}{cyan ${res.data.Language}}`
    );
    console.log(
      chalk`{gray -------------------------------------------------}`
    );
    console.log(chalk`{yellow.bold Plot: }{cyan ${res.data.Plot}}`);
    console.log(
      chalk`{gray -------------------------------------------------}`
    );
    console.log(chalk`{yellow.bold Actors: }{cyan ${res.data.Actors}}`);
  });
}
function spotQ(q) {
  spotify.search({ type: 'track', query: q, limit: 1 }, function(err, data) {
    if (err) {
      return console.log(`Error occurred: ${err}`);
    }

    // console.log(data.tracks.items[0]);
    console.log(
      chalk`{cyan Artist : }{yellow ${data.tracks.items[0].artists[0].name}}`
    );
    console.log(chalk`{cyan Title : }{yellow ${data.tracks.items[0].name}}`);
    console.log(
      chalk`{cyan Preview : }{yellow ${data.tracks.items[0].preview_url}}`
    );
    console.log(
      chalk`{cyan Album : }{yellow ${data.tracks.items[0].album.name}}`
    );
  });
}
function init() {
  if (qType === 'events') {
    bitQ(query);
  } else if (qType === 'track') {
    spotQ(query);
  } else if (qType === 'movie') {
    omdbQ(query);
  } else if (qType === 'read') {
    fs.readFile('file.txt', 'utf8', (err, msg) => {
      const cmd = msg.split(' ');
      [qType] = cmd;
      query = cmd.splice(1);
      init();
    });
  }
}

init();
