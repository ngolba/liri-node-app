require("dotenv").config();
let keys = require("./keys");
console.log(keys.spotify)

// var spotify = new Spotify(keys.spotify);

let firstInput = process.argv[2];


if (firstInput === "concert-this") {
    let artist = '';
    for (let i = 3; i < process.argv.length; i++){
        artist = artist.concat(process.argv[i] + ' ')
    }
    let queryUrl = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`
    console.log(queryUrl)
}