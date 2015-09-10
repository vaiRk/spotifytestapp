# Spotify Accounts Authentication Examples

This project is an attempt to create a small application to allow users to merge their Spotify playlists using a simple web application. 

It is also a chance for me to come to terms on using the "Authorization Code flow" present in the Spotify API. 

## Installation

Close into a repo on your computer and run:

    $ npm install

Create a 'config' folder in the main directory and rename the example keys file to 'keys.js' and change to include your respective access keys for the spotify API. 

## Running the app

Run via the app.js file contained within the main directory. 

    $ node app.js

Then, open `http://localhost:8888` in a browser.

### Using your own credentials
 In order to use the application you will need to generate a client ID and secret key.

Go to [My Applications on Spotify Developer](https://developer.spotify.com/my-applications) and create your application. For this app, I followed Spotify's instructions and registered these Redirect URIs:

* http://localhost:8888 (needed for the implicit grant flow)
* http://localhost:8888/callback

Once you have created your app, replace the `client_id`, `redirect_uri` and `client_secret` within the 'keys' config file.
