require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID, //dotenv -> process.env.
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
  

// Our routes go here:
//1. Create a route /index
//render a view called index.hbs
//create a form with artistName field
//redirect to /artist-search with a querystring http://localhost:3000/artist-search?Name="adsads"
app.get('/', (req, res) => {
    res.render('index');
});

//2.Create an /artist-search route
//get the artistName that comes from the query params
//pass that artists name to
// spotifyApi
//   .searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
//   .then(data => {
//     console.log('The received data from the API: ', data.body);
//     // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
//   })
//   .catch(err => console.log('The error while searching artists occurred: ', err));

app.get('/artist-search', async (req, res) => {
    const data = await spotifyApi.searchArtists(req.query.artistName);
    console.log(data.body.artists);
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    const allArtists = data.body.artists.items;
    //3. Create a atist-search-results view
    //render that view passing allArtists
    //iterate through all artists in the view (each)
    //display their name and id
    res.render('artist-search-results', {allArtists});
});

app.get('/albums/:artistId', async (req, res) => {
    const albums = await spotifyApi.getArtistAlbums(req.params.artistId);
    const allAlbums = albums.body.items;
    // console.log('This is the album', albums.body.items);
    res.render('albums', {allAlbums});
})

app.get('/album-tracks/:albumId', async (req, res) => {
    const tracks = await spotifyApi.getAlbumTracks(req.params.albumId);
    const allTracks = tracks.body.items;
    // console.log(tracks.body.items);
    res.render('tracks', {allTracks});
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
