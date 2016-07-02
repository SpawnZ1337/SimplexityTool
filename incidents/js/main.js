(function ($, moment) {
	
	// Set the default time zone as UTC
	moment.tz.setDefault('Etc/UTC');
	
	// Contains the two dates (start of trial and end of trial) with their two formats (short and long)
	// The date will be in the default time zone specified above
	// NOTE: The date will only update when the page is refreshed
	var currentDateFormats = (function () {
		var momentStart = moment();
		var momentEnd = moment().add(14, 'days');
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
		 * {forum-name}
		 * {ts-id}
		 * {link-application}
		 * {link-profile}
		 * {link-ted}
		 * {incident-date}
		 * {people-involved}
		 */

		return content.replace(/{forum-name}/g, '<span class="forum-name-placeholder"></span>')
			.replace(/{ts-id}/g, '<span class="ts-id-placeholder"></span>')
			.replace(/{link-application}/g, '<span class="link-application-placeholder"></span>')
			.replace(/{forum-profile}/g, '<span class="link-profile-placeholder"></span>')
			.replace(/{link-ted}/g, '<span class="link-ted-placeholder"></span>')
			.replace(/{incident-date}/g, '<span class="incident-date-placeholder"></span>')
			.replace(/{people-involved}/g, '<span class="people-involved-placeholder"></span>')
			.replace(/{incident-explained}/g, '<span class="incident-explained-placeholder"></span>')
			.replace(/{proof}/g, '<span class="proof-placeholder"></span>')
			
	}

	// Update the text in the placeholder spans with the text in the form controls
	// NOTE: With this method, placeholders that don't need an update will also be updated
	function updateTextInPlaceholderSpans($blockContext) {
		$('span.proof-placeholder', $blockContext).text($('#proof-input').val());
		$('span.incident-explained-placeholder', $blockContext).text($('#incident-explained-input').val());
		$('span.forum-name-placeholder', $blockContext).text($('#forum-name-input').val());
		$('span.ts-id-placeholder', $blockContext).text($('#ts-id-input').val());
		$('span.link-application-placeholder', $blockContext).text($('#application-url-input').val());
		$('span.link-profile-placeholder', $blockContext).text($('#profile-url-input').val());
		$('span.link-ted-placeholder', $blockContext).text($('#ted-url-input').val());
		$('span.incident-date-placeholder', $blockContext).text(currentDateFormats.startShort);
		$('span.people-involved-placeholder', $blockContext).text($('#people-involved-input').val());
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
			displayNewIngameNameText(selectedGame);

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
