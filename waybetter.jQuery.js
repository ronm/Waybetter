(function( window, $ ){
	
	var waybetter = 'waybetter',
		inview = 'inview',
		outview = 'outview',

	methods = {
	    inview : (function() { return private.isInView( this ); }),
	    refresh : (function() { return private.process( this ); })
	},
	private = {
    	init : function( options ) { 
    		var that = this;
    		
    		API.settings = $.extend({ direction: 'vertical', name: 'waybetter', threshold: 0, viewport: window }, options );
	      	
	      	$(window).bind( "scroll resize", function() { private.process( that ); });
	      	
	      	return private.process( that );
	    },	
	    isInView: function( el ) {
			var direction = API.settings.direction,
				threshold = API.settings.threshold,
				viewport = $( API.settings.viewport ),
				offset = el.offset();

			if ( direction === "vertical" ) {
				var elOffset = offset.top, 
					elSize = el.outerHeight(), 
					viewportScroll = viewport.scrollTop(), 
					viewportSize = viewport.outerHeight();
			} else {
				var elOffset = offset.left, 
					elSize = el.outerWidth(), 
					viewportScroll = viewport.scrollLeft(), 
					viewportSize = viewport.outerWidth();
			}
			
			var elOffsetFromViewport = ( viewportScroll - elOffset );

			//return  ( viewportScroll < (elOffset + elSize - threshold)) && ((viewportScroll + viewportSize - threshold) > (elOffset));
			return  ( elOffsetFromViewport < (elSize - threshold)) && (elOffsetFromViewport > (threshold - viewportSize));
		},
		process: function( els ) {
			var dataName = "data-" + API.settings["name"];
	    	return  els.each(function() {
	    		var $this = $( this ), hasAttr = $this.attr( dataName );
	    		
				if ( private.isInView($this) ) {
					if ( !hasAttr ) { $this.trigger( waybetter + '.' + inview ).attr( dataName, true ); }				
				} else {
					if ( hasAttr ) { $this.trigger( waybetter + '.' + outview ).removeAttr( dataName ); }
				}
			});
		},
	},
	API = {
		waybetterViewport: (function() {
			var viewport = $( API.settings.viewport );

			return {
				height: viewport.outerHeight(),
				left: viewport.scrollLeft(),
				top: viewport.scrollTop(),
				width: viewport.outerWidth()
			}
		}),
		settings: null,
		version: '1'
	};	

	$.fn.waybetter = function( method ) {
   	    if ( typeof method === 'object' || ! method ) {
	      return private.init.apply( this, arguments );
	    } else if ( methods[method] ) {
	      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else {
	      $.error( 'Method ' +  method + ' does not exist on jQuery.waybetter' );
	    }    
	};
	
	$.fn.waybetter.API = API;

})( window, jQuery );
