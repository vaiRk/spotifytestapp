var applyEventListeners = function() {
	
	$( ".playlist-grid-cell img" ).off('mouseenter');
	$( ".playlist-grid-cell" ).off('click');
	$('#merge-button').off('click');
	
	$( ".playlist-grid-cell img" ).mouseenter(
							
		function() {
							
			var title = $(this).data('name')
									
			$( this ).parents('div').find('.layer').remove();
			$( this ).parent().append( $( "<div class='layer'><span>" + title + "</span></div>" ) );
	
		}
	);
						
	$( ".playlist-grid-cell" ).click(
							
		function() {

			var mergeButton = $("#merge-button");
			var albumCount = $("#album-count");
			var trackCount = $("#track-count");
			var dataTrackCount = parseInt($( this ).children('img').data('trackcount'));
		
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
				$( this ).append( $("<div class='selected'><span><img class='centre' src='../img/tick.png' height='200'></span></div>" ) );								
				
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