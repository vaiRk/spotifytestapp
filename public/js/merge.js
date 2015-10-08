var createPlaylist = function(userId, accessToken, playlistName) {
	
	return Promise.resolve(
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

			},
			error: function(){
				
			}
		})
	).then(function(response){
		return response['id'];
	})
	
};

var getPlaylistTracks = function(userId, accessToken, tracksURL) {
	
	var tracks = [];
	var initialOffset = 0;
	
	var apiCall = function(offset) {
		return Promise.resolve(
			$.ajax({
				url: tracksURL + '?offset=' + offset,
				method: 'GET',
				headers: {	
					'Authorization': 'Bearer ' + accessToken
				},
				success: function(response){
					
				},
				error: function(){
					
				}
			})
		).then(function(response){
			if (response['items'].length){
						
				response['items'].forEach(function(track){
					tracks.push(track['track']['uri']);
				});
				
				if (response['next']){
					
					initialOffset += 100;
					return Promise.delay(2000).then(function() {
						return apiCall(initialOffset);
					});
										
				} else {
					return tracks;
				}
								
			} else {
				return tracks;
			}
		});
	};
	
	return apiCall(initialOffset);

};

var addTracksToPlaylist = function(userId, accessToken, playlistId, allTrackIds) {
	
	var initialPos = 0;
	var endPos = 100;
	
	if (endPos > allTrackIds.length) {
		endPos = allTrackIds.length;
	}
	
	var apiCall = function(trackIds) {
		return Promise.resolve(
			$.ajax({
				url: 'https://api.spotify.com/v1/users/'+ userId +'/playlists/' + playlistId + '/tracks',
				method: 'POST',
				data: JSON.stringify({'uris': trackIds}),
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				headers: {
					'Authorization': 'Bearer ' + accessToken
				},
				success: function(response){
					
				},
				error: function(){
					
				}
			})
		).then(function(response){
			if (response['snapshot_id']) {
				
				if (endPos == allTrackIds.length) {
					return playlistId;
				}
				
				initialPos += 100;
				endPos += 100;
				
				if (endPos > allTrackIds.length) {
					endPos = allTrackIds.length;
				}
				
				return Promise.delay(2000).then(function() {
					return apiCall(allTrackIds.slice(initialPos, endPos));
				});
				
			} else {
				throw 'ERROR';
			}
		});
	};
	
	return apiCall(allTrackIds.slice(initialPos, endPos));
	
	
};

