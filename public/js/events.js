var applyEventListeners = function() {
	
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
			var dataTrackCount = parseInt($( this ).find('img').data('trackcount'));
		
			if ( $( this ).find('.selected').length ) {

				$( this ).find('.selected').remove();
				
				var count = parseInt(albumCount.text()) - 1;
				albumCount.text(count);
				
				var trackCountVal = parseInt(trackCount.text()) - dataTrackCount;
				trackCount.text(trackCountVal);
				
				if (count == 0 || trackCountVal == 0) {
					mergeButton.prop('disabled', 'disabled');
				}
												
			} else {
			
				$( this ).parents('div').find('.layer').remove();
				$( this ).children('a').append( $("<div class='selected'><table><tr><td>Selected!</td></tr>" +
				"<tr><td><span class='glyphicon glyphicon-minus' aria-hidden='true'></span></td></tr></table></div>" ) );								
				
				if (albumCount.text().length) {
					var count = parseInt(albumCount.text()) + 1;
					albumCount.text(count);
					
					var trackCountVal = parseInt(trackCount.text()) + dataTrackCount;
					trackCount.text(trackCountVal);
					
				} else {
					albumCount.text('1');
					trackCount.text(dataTrackCount);
				}
				
				mergeButton.prop('disabled', false);
				
				
			}
			
		}
	);
						
	$('#merge-button').click(
							
		function() {
								
								
								
		}
	);
};