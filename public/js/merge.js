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
			return response['id'];
		},
		error: function(){
			
		}
	});
	
};

var getPlaylistTracks = function(userId, accessToken, tracksURL) {
	
	var tracks = [];
	var initialOffset = 0;
	
	var apiCall = function(offset) {
		$.ajax({
			url: tracksURL + '?offset=' + offset,
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + accessToken
			},
			success: function(response){

				if (response['items'].length){
					
					response['items'].forEach(function(track){
						tracks.push(track['track']['id']);
					});
					
					if (response['next']){
						
						initialOffset += 100;
						setTimeout(function(){apiCall(initialOffset);}, 2000);
											
					} else {
						console.log(tracks);
						return tracks;
					}
										
				} else {
					return tracks;
				}
				
			},
			error: function(){
				
			}
		});
	};
	
	apiCall(initialOffset);
	
};

var addTracksToPlaylist = function(userId, accessToken, playlistId, trackIds) {
	
};

