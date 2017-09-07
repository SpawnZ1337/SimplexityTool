(function ($, moment) {
	
	// Set the default time zone as UTC
	moment.tz.setDefault('Etc/UTC');
	
	// Contains the two dates (start of trial and end of trial) with their two formats (short and long)
	// The date will be in the default time zone specified above
	// NOTE: The date will only update when the page is refreshed
	var currentDateFormats = (function () {
		var momentStart = moment();
		var momentEnd = moment().add(7, 'days');
		var shortFormat = 'DD/MM/YYYY'
		var longFormat = 'D MMMM';
		
		return {
			startShort: momentStart.format(shortFormat),
			endShort: momentEnd.format(shortFormat),
			startLong: momentStart.format(longFormat),
			endLong: momentEnd.format(longFormat)
		};
	})();
	
	// Replace all the placeholders that are in use by spans with a class name where the text can be loaded into
	function replacePlaceholdersBySpans(content) {
		/*
		 * The following placeholders are being used:
		 * {game-name}
		 * {forum-name}
		 * {ingame-name}
		 * {hots-region}
		 * {lol-region}
		 * {overwatch-region}
		 * {ts-id}
		 * {link-application}
 		 * {start-trial-date-short}
 		 * {end-trial-date-short}
 		 * {start-trial-date-long}
		 * {end-trial-date-long}
		 */

		return content.replace(/{game-name}/g, '<span class="game-name-placeholder"></span>')
			.replace(/{forum-name}/g, '<span class="forum-name-placeholder"></span>')
			.replace(/{ingame-name}/g, '<span class="ingame-name-placeholder"></span>')
			.replace(/{hots-region}/g, '<span class="hots-region-placeholder"></span>')
			.replace(/{lol-region}/g, '<span class="lol-region-placeholder"></span>')
			.replace(/{overwatch-region}/g, '<span class="overwatch-region-placeholder"></span>')
			.replace(/{ts-id}/g, '<span class="ts-id-placeholder"></span>')
			.replace(/{link-application}/g, '<span class="link-application-placeholder"></span>')
			.replace(/{start-trial-date-short}/g, '<span class="start-trial-date-short-placeholder"></span>')
			.replace(/{end-trial-date-short}/g, '<span class="end-trial-date-short-placeholder"></span>')
			.replace(/{start-trial-date-long}/g, '<span class="start-trial-date-long-placeholder"></span>')
			.replace(/{end-trial-date-long}/g, '<span class="end-trial-date-long-placeholder"></span>');
	}

	// Update the text in the placeholder spans with the text in the form controls
	// NOTE: With this method, placeholders that don't need an update will also be updated
	function updateTextInPlaceholderSpans($blockContext) {
		$('span.game-name-placeholder', $blockContext).text($('#game-select option:selected').text());
		$('span.forum-name-placeholder', $blockContext).text($('#new-forum-name-input').val());
		$('span.ingame-name-placeholder', $blockContext).text($('#new-ingame-name-input').val());
		$('span.hots-region-placeholder', $blockContext).text($('#new-hots-region-select').val());
		$('span.lol-region-placeholder', $blockContext).text($('#new-lol-region-select').val());
		$('span.overwatch-region-placeholder', $blockContext).text($('#new-overwatch-region-select').val());
		$('span.ts-id-placeholder', $blockContext).text($('#ts-id-input').val());
		$('span.link-application-placeholder', $blockContext).text($('#application-url-input').val());
		$('span.start-trial-date-short-placeholder', $blockContext).text(currentDateFormats.startShort);
		$('span.end-trial-date-short-placeholder', $blockContext).text(currentDateFormats.endShort);
		$('span.start-trial-date-long-placeholder', $blockContext).text(currentDateFormats.startLong);
		$('span.end-trial-date-long-placeholder', $blockContext).text(currentDateFormats.endLong);
	}

	// Add the given content to the given contentBlock after the placeholders have been replaced by the text
	function addContentWithValuesToBlock($contentBlock, content) {
		content = replacePlaceholdersBySpans(content);
		$contentBlock.html(content);
		updateTextInPlaceholderSpans($contentBlock);
	}
	
	// Update all the placeholders in every contentBlock
	// This method is used as an event handler when a change occurs in the form controls
	function newUserDetailsControlsChangeEventHandler () {
		$('.async-content-block').each(function () {
			updateTextInPlaceholderSpans($(this));
		});
	}
	
	// Update the label text and input placeholder
	// with the right ingame name text for the selected game
	function displayNewIngameNameText(selectedGame) {
		var ingameNameText;
		
		switch (selectedGame) {
            case 'black-desert-online':
                ingameNameText = 'Ingame Name';
                break;
            
			case 'heroes-of-the-storm':
			case 'overwatch':
				ingameNameText = 'Battle.net Tag';
				break;
				
			case 'paladins':
				ingameNameText = 'Paladins Username';
				break;
				
				case 'Counter-Strike':
				ingameNameText = 'Steam Name';
				break;
			
			default:
				ingameNameText = 'Ingame Name';
				break;
		}
		
		var $input = $('#new-ingame-name-input');
		$input.prev('label').text(ingameNameText);
		$input.attr('placeholder', ingameNameText);
	}

	// document.ready event handler
	$(function () {
		
		$('#clear-button').click(function () {
			$('input.form-control').val('').trigger('input');
			
			$('select.form-control').each(function () {
				var $select = $(this);
				
				$select.val($select.children('option:first-child').val()).change();	
			});
		});
		
		// New content should be loaded when the game in the select changes
		// Add the event handler for it and trigger it afterwards
		$('#game-select').change(function () {
			var $gameSelect = $(this);
			var selectedGame = $gameSelect.val();
			
			// Update the label text and input placeholder for the ingame name
			displayNewIngameNameText(counter strike);
                        displayNewIngameNameText(league Of legends);
                        displayNewIngameNameText(general);
                        displayNewIngameNameText(overwatch);

			// Hide form controls that are specifically there for another game
			// Show form controls that are specifically there for the chosen game
			$('.new-user-details-control').each(function () {
				var $detailsControl = $(this);
				var showControlForGames = $detailsControl.data('show-for-games');
				
				if (showControlForGames.split(' ').indexOf(selectedGame) !== -1 || showControlForGames === 'all') {
					$detailsControl.parent('.form-group').show();
				} else {
					$detailsControl.parent('.form-group').hide();
				}
			});
			
			// Load the content from the HTML files in the different content blocks
			// This method will first look for the HTML file in the game specific folder
			// When the HTML file found in there is empty, it will load the content from the HTML file in the main 'content' folder
			$('.async-content-block').each(function () {
				var $asyncContentBlock = $(this);
				var contentToLoadFileName = $asyncContentBlock.data('content') + '.html';

				$.ajax({
					method: 'GET',
					url: 'content/' + selectedGame + '/' + contentToLoadFileName,
					cache: false,
					success: function (specificContent) {
						if (specificContent !== undefined && specificContent !== null && specificContent !== '') {
							addContentWithValuesToBlock($asyncContentBlock, specificContent);
						} else {

							$.ajax({
								method: 'GET',
								url: 'content/' + contentToLoadFileName,
								cache: false,
								success: function (defaultContent) {
									if (defaultContent !== undefined && defaultContent !== null && defaultContent !== '') {
										addContentWithValuesToBlock($asyncContentBlock, defaultContent);
									} else {
										$asyncContentBlock.html('<strong>No content has been found.</strong>');
									}
								}
							});
						}
					}
				});
			});
		}).change();
		
		// When the values in the form controls change, update the content blocks
		$('input.new-user-details-control').on('input', newUserDetailsControlsChangeEventHandler);
		$('select.new-user-details-control').change(newUserDetailsControlsChangeEventHandler);
        
        // Show the notification modal
        $('#notification-modal').modal({
            backdrop: 'static',
            keyboard: false
        });
	});
})(jQuery, moment);
