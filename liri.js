require("dotenv").config();

let keys = require("./keys");

let moment = require('moment');


let request = require('request');

let Spotify = require('node-spotify-api');

let spotify = new Spotify(keys.spotify);

let firstInput = process.argv[2];


if (firstInput === "concert-this") {
    let artist = '';
    for (let i = 3; i < process.argv.length; i++) {
        if (i > 3) {
            artist = artist.concat('%20')
        }
        artist = artist.concat(process.argv[i])
    }
    let queryUrl = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`

    request(queryUrl, function (error, response, body) {
        let bandInfo = JSON.parse(body);
        let event = {};
        if (!bandInfo[0]) {
            console.log("No upcoming Events")
            return;
        } else {
            for (let i = 0; i < bandInfo.length; i++) {
                event = bandInfo[i]
                console.log(`Venue: ${event.venue.name}`)
                console.log(`Location: ${event.venue.city}, ${event.venue.region}`)
                console.log(`Date: ${moment(event.datetime).format("MM/DD/YYYY")} \n`)
            }
        }
    });
} else if (firstInput === "spotify-this-song") {
    let songName = '';
    if (process.argv.length < 4) {
        spotify
            .request('https://api.spotify.com/v1/tracks/7yCPwWs66K8Ba5lFuU2bcx')
            .then(function (data) {
                let song = data[0]
                let artistString = [];
                for (let i = 0; i < song.artists.length; i++) {
                    artistString.push(song.artists[i].name + '  ')
                }
                console.log(`Artist(s): ${artistString}`)
                console.log(`Song Name: ${song.name}`)
                console.log(`Preview: ${song.preview_url}`)
                console.log(`Album: ${song.album.name}`)
            })
    } else {
        for (let i = 3; i < process.argv.length; i++) {
            if (i > 3) {
                songName = songName.concat('+')
            }
            songName = songName.concat(process.argv[i])
        }
        spotify.search({
            type: 'track',
            query: songName
            // limit: 1
        }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            } else {
                let song = data.tracks.items[0]
                let artistString = [];
                for (let i = 0; i < song.artists.length; i++) {
                    artistString.push(song.artists[i].name + '  ')
                }

                console.log(`Artist(s): ${artistString}`)
                console.log(`Song Name: ${song.name}`)
                console.log(`Preview: ${song.preview_url}`)
                console.log(`Album: ${song.album.name}`)
            }
        })
    }
} else if (firstInput === "movie-this") {}