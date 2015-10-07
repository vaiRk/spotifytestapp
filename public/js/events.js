var applyEventListeners = function(userId, access_token) {
	
	$( ".playlist-grid-cell img" ).off('mouseenter');
	$( ".playlist-grid-cell" ).off('click');
	$('#merge-button').off('click');
	
	$( ".playlist-grid-cell img" ).mouseenter(
							
		function() {
							
			var title = $(this).data('name')
			var tracks = $(this).data('trackcount');
									
			$( this ).parents('div').find('.layer').remove();
			$( this ).parent().append( $( "<div class='layer'>" +
			"<table><tr><td>" + 
			title + 
			"</td></tr>" +
			"<tr><td><span class='glyphicon glyphicon-plus' aria-hidden='true'></span></td>" +			
			"</tr><tr><td>" +
			tracks + 
			" tracks</td></tr>" +
			"</table>" + 			
			"</div>" ) );
	
		}
	);
						
	$( ".playlist-grid-cell" ).click(
							
		function() {

			var mergeButton = $("#merge-button");
			var albumCount = $("#album-count");
			var trackCount = $("#track-count");
			var footerInfo = $("#footer-info");
			var dataTrackCount = parseInt($( this ).find('img').data('trackcount'));
		
			if ( $( this ).find('.selected').length ) {

				$( this ).find('.selected').remove();
				
				var count = parseInt(albumCount.text()) - 1;
				albumCount.text(count);
				
				var trackCountVal = parseInt(trackCount.text()) - dataTrackCount;
				trackCount.text(trackCountVal);
				
				if (count == 0 || trackCountVal == 0) {
					mergeButton.prop('disabled', 'disabled');
					footerInfo.animate( { height:"0px" }, { queue:false, duration:500 });
				}
												
			} else {
			
				$( this ).parents('div').find('.layer').remove();
				$( this ).children('a').append( $("<div class='selected'><table><tr><td>Selected!</td></tr>" +
				"<tr><td><span class='glyphicon glyphicon-minus' aria-hidden='true'></span></td></tr></table></div>" ) );								
				
				//albumCount.text() will be '0' by default
				if (albumCount.text() !== '0') {
					var count = parseInt(albumCount.text()) + 1;
					albumCount.text(count);
					
					var trackCountVal = parseInt(trackCount.text()) + dataTrackCount;
					trackCount.text(trackCountVal);
					
				} else {
					albumCount.text('1');
					trackCount.text(dataTrackCount);
					
					//animate in footer with info - TRIGGERED
					footerInfo.animate( { height:"0px" }, { queue:false, duration:0 });					
					footerInfo.prop('hidden', false);
					footerInfo.animate( { height:"70px" }, { queue:false, duration:500 });
				}
				
				mergeButton.prop('disabled', false);
				
				
			}
			
		}
	);
						
	$('#merge-button').click(
							
		function() {
								
			var playlistResults = $("#playlist-results");
			var selectedPlaylists = playlistResults.find('.selected');
			var playlistName = $("#playlist-name").val();
			var tracks = [];
			
			$( this ).prop('disabled', true);
			
			//create new playlist with name provided
			createPlaylist(userId, access_token, playlistName);
			
			//get tracks for each playlist, add to big array
			
			
			//add all tracks to new playlist
								
								
		}
	);
};