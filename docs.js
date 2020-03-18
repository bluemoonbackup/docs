"use strict";

$(function() {
	
	// Thumbnail popups

	$(".doc-thumbnail-popup").magnificPopup({
		type: 'image',
		zoom: {
			enabled: true
		}
	});

	// Enable smooth scrolling when clicking links
	
	$(".subsection-link").click(function(e) {
		e.preventDefault();
		$('#position-content').scrollTo(
			this.hash,
			this.hash,
			{
				onAfter: function() {
					refreshHighlights();
				}
			}
		);
	});
	
	// Enable highlighting current position
	
	var linkSources = $(".subsection-link"), linkTargets = [], linkIndents = [];
	for (var i = 0; i < linkSources.length; i++) {    
		linkTargets.push( $(linkSources[i]).attr('href') );
		linkIndents.push( parseInt($(linkSources[i]).attr('data-indent')) );
	}

	var refreshHighlights = function(){
		var scrollPos = $("#position-content").scrollTop();
		var offset = $("#position-content").offset().top + 5 /*rounding*/;
		
		var linkIdx = 0;
		for (var i = 0; i < linkTargets.length; i++) {
			var targetPos = $(linkTargets[i]).offset().top - offset + scrollPos;
			
			//console.log([scrollPos, targetPos, scrollPos >= targetPos]);
			
			if (scrollPos >= targetPos) {
				$(linkSources[i]).addClass("subsection-link-current");
				linkIdx++;
			} else {
				$(linkSources[i]).removeClass("subsection-link-current");
			}
		}

		linkIdx--;

		// Walk forwards and backwards from linkIdx, the indent should only ever decrease; if it increases, hide it
		$(linkSources[linkIdx]).parent().show();

		var checkIndent = linkIndents[linkIdx] + 1; // allow 1 level of increase ahead of the current selected element
		for (var i = linkIdx+1; i < linkSources.length; i++) {
			if (linkIndents[i] > checkIndent) {
				// hide
				$(linkSources[i]).parent().hide();
			} else {
				checkIndent = linkIndents[i]; // same or lower
				$(linkSources[i]).parent().show();
			}
		}

		checkIndent = linkIndents[linkIdx];
		for (var i = linkIdx; i-->0;) {
			if (linkIndents[i] > checkIndent) {
				// hide
				$(linkSources[i]).parent().hide();
			} else {
				checkIndent = linkIndents[i]; // same or lower
				$(linkSources[i]).parent().show();
			}
		}
		
	};
		
	$("#position-content").scroll(refreshHighlights);
	$(window).resize(refreshHighlights);
	refreshHighlights();
	
});
