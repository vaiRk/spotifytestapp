var createPlaylist = function(userId, accessToken, playlistName) {
	
	$.ajax({
		url: 'https://api.spotify.com/v1/users/' + userId + '/playlists',
		method: 'POST',
		headers: {
			'Authorization': 'Bearer ' + accessToken
		},
		data: JSON.stringify({ 'name': playlistName, 'public': true}),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(response){
			return response;
		},
		error: function(){
			
		}
	});
	
};

var getPlaylistTracks = function(userId, accessToken, playlistId) {
	
};

var addTracksToPlaylist = function(userId, accessToken, playlistId, trackIds) {
	
};

