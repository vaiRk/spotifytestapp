$(document).ready(function(){
	
	/**
		* Obtains parameters from the hash of the URL
		* @return Object
		*/
	function getHashParams() {
		var hashParams = {};
		var e, r = /([^&;=]+)=?([^&;]*)/g,
			q = window.location.hash.substring(1);
		while ( e = r.exec(q)) {
			hashParams[e[1]] = decodeURIComponent(e[2]);
		}
		return hashParams;
	}

	var userProfileSource = document.getElementById('user-profile-template').innerHTML,
		userProfileTemplate = Handlebars.compile(userProfileSource),
		userProfilePlaceholder = document.getElementById('user-profile');
		
	var userPlaylistsSource = document.getElementById('user-profile-playlists').innerHTML,
		userPlaylistsTemplate = Handlebars.compile(userPlaylistsSource),
		userPlaylistsPlaceholder = document.getElementById('user-playlists');

	//var oauthSource = document.getElementById('oauth-template').innerHTML,
	//	oauthTemplate = Handlebars.compile(oauthSource),
	//	oauthPlaceholder = document.getElementById('oauth');

	var params = getHashParams();

	var access_token = params.access_token,
		refresh_token = params.refresh_token,
		error = params.error;

	if (error) {
		alert('There was an error during the authentication');
	} else {
		if (access_token) {
		// render oauth info
		//holder.innerHTML = oauthTemplate({
		//	access_token: access_token,
		//	refresh_token: refresh_token
		//});

		$.ajax({
			url: 'https://api.spotify.com/v1/me',
			headers: {
				'Authorization': 'Bearer ' + access_token
			},
			success: function(response) {
				userProfilePlaceholder.innerHTML = userProfileTemplate(response);
				
				$('#login').hide();
				$("#mainpageinfo").hide();
				$('#loggedin').show();
				
				var userId = response.id;
				
				$.ajax({
					url: 'https://api.spotify.com/v1/users/' + userId + '/playlists?limit=50',
					headers: {
						'Authorization': 'Bearer ' + access_token
					},
					success: function(response) {
						userPlaylistsPlaceholder.innerHTML = userPlaylistsTemplate(response);
						
						$("#userplaylists").show();
						
						$( ".playlist-grid-cell img" ).mouseenter(
							
							function() {
								
								var title = $(this).data('name')
								
								$( this ).parents('div').find('.layer').remove();
								$( this ).parent().append( $( "<div class='layer'><span>" + title + "</span></div>" ) );
							}
						);
						
						$( ".playlist-grid-cell" ).click(
							
							function() {
								
								var albumCount = $("#album-count");
							
								if ( $( this ).find('.selected').length ) {

									$( this ).find('.selected').remove();
									
									var count = parseInt(albumCount.text()) - 1;
									albumCount.text(count);
																	
								} else {
								
									$( this ).parents('div').find('.layer').remove();
									$( this ).append( $("<div class='selected'><span><img class='centre' src='../img/tick.png' height='200'></span></div>" ) );								
									
									if (albumCount.text().length) {
										var count = parseInt(albumCount.text()) + 1;
										albumCount.text(count);
									} else {
										albumCount.text('1');
									}
									
									
								}
								
							}
						);
						
					}
				})
			}
		});
		} else {
			// render initial screen
			$('#login').show();
			$("#mainpageinfo").show();			
			$('#loggedin').hide();
		}

		document.getElementById('obtain-new-token').addEventListener('click', function() {
		$.ajax({
			url: '/refresh_token',
			data: {
			'refresh_token': refresh_token
			}
		}).done(function(data) {
			access_token = data.access_token;
			//oauthPlaceholder.innerHTML = oauthTemplate({
			//access_token: access_token,
			//refresh_token: refresh_token
			//});
		});
		}, false);
		
	}
	
});