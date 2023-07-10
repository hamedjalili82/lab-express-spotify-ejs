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

// Route for the atrist search
app.get('/artist-search', (req, res) => {
  const artistQuery = req.query.artist;

  spotifyApi
    .searchArtists(artistQuery)
    .then(data => {
      const artists = data.body.artists.items;
      res.render('artist-search-results', { artists });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

// Route for the album search
app.get('/albums/:artistId', (req, res, next) => {
  const artistId = req.params.artistId;

  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      const albums = data.body.items;
      res.render('albums', { albums });
    })
    .catch(err => console.log('The error while getting artist albums occurred: ', err));
})

// Route for the track search
app.get('/tracks/:albumId', (req, res, next) => {
  const albumId = req.params.albumId;

  spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
      const tracks = data.body.items;
      res.render('tracks', { tracks });
    })
    .catch(err => console.log('The error while getting album tracks occurred: ', err));
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))




