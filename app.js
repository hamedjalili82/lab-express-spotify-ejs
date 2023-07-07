require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')


const app = express()

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))

// Our routes go here:
// Route for the home page
app.get('/', (req, res) => {
    res.render(`index`);
  });

  app.get('/artist', (req, res) => {
    spotifyApi.searchArtists(req.query.search)
    .then(data => {
      console.log("The received data", data.body.artists.items);
      res.render('artists', {
        search: req.query.search,
        artists: data.body.artists.items,
        JSON: JSON.stringify(data.body.artists.items,null,2) // nice for debugging
      })
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})

app.get('/artist-search', (req, res) => {
    const artist = req.query.artist;
    const searchResults = [
        { id: 1, title: 'Song 1', artist: artist },
        { id: 2, title: 'Song 2', artist: artist },
        { id: 3, title: 'Song 3', artist: artist },
      ];
      res.send('artist')
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))




