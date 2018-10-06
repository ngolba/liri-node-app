# liri-node-app

Goal -- Create a node application which can: 
  1) Recieve a band name and output details of their upcoming events
  2) Recieve a song name and output Spotify details
  3) Recieve a movie name and output relevant information
  4) Read an input string from a `.txt` file and perform steps 1, 2, or 3
  5) Log the outputs to a `.txt` file
  
Dependencies: 
  1) [Node-Spotify-API](https://www.npmjs.com/package/node-spotify-api)
  2) [Request](https://www.npmjs.com/package/request)
  3) [Moment](https://www.npmjs.com/package/moment)
  4) [DotEnv](https://www.npmjs.com/package/dotenv)
  5) A Spotify app ID and secret ID inside of a `.env` file formatted as such: 
      * ```SPOTIFY_ID=your-spotify-id```
      * ```SPOTIFY_SECRET=your-spotify-secret```
      
Instructions: Open the application in the terminal and enter `node liri.js`. 
Then enter either 
  * `concert-this <band name no punctuation>` for concert event information, 
  * `spotify-this-song <song name no punctuation>` for song information, 
  * `movie-this <movie title no punctuation>` for movie information, or
  * `do-what-it-says` to read one of the previous three commands from the `random.txt` file.
  
The results will be logged to the console, as well as to the `log.txt` file.
