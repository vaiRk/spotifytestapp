$(document).ready(function(){

	//set height of jumbotron straight away	
	var jumbotronHeader = $("#jumboheader");
	var initialJumboHeight = jumbotronHeader.height();
	jumbotronHeader.height(window.innerHeight / 2);
	
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
		
	var userPlaylistsSource = document.getElementById('playlist').innerHTML,
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
				jumbotronHeader.height(initialJumboHeight);
				$('#loggedin').show();
				
				var userId = response.id;
				
				$.ajax({
					url: 'https://api.spotify.com/v1/users/' + userId + '/playlists?limit=50',
					headers: {
						'Authorization': 'Bearer ' + access_token
					},
					success: function(response) {

						for (var i=0; i<response['items'].length; i++) {
							var template = userPlaylistsTemplate(response['items'][i]);
							userPlaylistsPlaceholder.innerHTML += template;
						}
						
						$("#userplaylists").show();
						
						$(".span-tooltip").tooltip({
							placement: "top"
						});
						
						var alreadyloading = false;
						var offset = 50;
						
						$(window).scroll(function() {
							if ($('body').height() <= ($(window).height() + $(window).scrollTop())) {
								if (alreadyloading == false) {
									alreadyloading = true;
									
									$("#playlists-loading-gif").show();
									
									$.ajax({
										url: 'https://api.spotify.com/v1/users/' + userId + '/playlists?limit=50&offset=' + offset,
										headers: {
											'Authorization': 'Bearer ' + access_token
										},
										success: function(response){

											for (var i=0; i<response['items'].length; i++) {
												var template = userPlaylistsTemplate(response['items'][i]);
												userPlaylistsPlaceholder.innerHTML += template;
											}
											
											$("#playlists-loading-gif").hide();
											
											if (response['next']) {
												offset += 50;
												alreadyloading = false;
											} else {
												$("#no-playlists-left").show();
											}
											
											applyEventListeners(userId, access_token);
											
										}
									});
									
									
								}
							}
						});
						
						applyEventListeners(userId, access_token);
						
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
		});
		}, false);
		
	}
	
});