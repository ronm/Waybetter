(function( window, $ ){
	
	var $win = $(window),
		$doc = $(document), 
		wbName = 'waybetter',
		dataName = "data-" + wbName,
		inview = 'inview',
		outview = 'outview',
		scroll = "scroll." + wbName,
		resize = "resize." + wbName,
		settings;

	methods = {
		destroy: function() { this.data(wbName + 'Ignore', true).trigger( wbName + ".destroyed" ).removeAttr( "data-" + wbName ); },
		enable: function() { this.data(wbName + 'Ignore', false).trigger( wbName + ".enabled" ).waybetter("refresh"); },
	    inview : (function() { return isInView.apply( this ); }),
	    refresh : (function() { 
	    	this.trigger( wbName + ".refreshed" );
	    	return process.apply( this ); 
	    }),
	},
	init = function( options ) { 
    	var that = this;
    	
    	settings = $.extend( $.fn.waybetter.settings, options );
	  	
	  	$win.on( scroll + " " + resize, function() { process.apply( that ); });
	  	$doc.trigger( wbName + ".ready" );
	  	return process.apply( that );
	},	
	isInView = function() {
	    var direction = settings.direction,
	    	threshold = settings.threshold,
	    	viewport = $( settings.viewport ),
	    	offset = this.offset();

	    if ( direction === "vertical" ) {
	    	var elOffset = offset.top, 
	    		elSize = this.outerHeight(), 
	    		viewportScroll = viewport.scrollTop(), 
	    		viewportSize = viewport.outerHeight();
	    } else {
	    	var elOffset = offset.left, 
	    		elSize = this.outerWidth(), 
	    		viewportScroll = viewport.scrollLeft(), 
	    		viewportSize = viewport.outerWidth();
	    }
	    
	    var elOffsetFromviewport = ( viewportScroll - elOffset );

	    return  ( elOffsetFromviewport < (elSize - threshold)) && (elOffsetFromviewport > (threshold - viewportSize));
	},
	process = function() {
	    return  this.filter(function() { return !$(this).data(wbName + 'Ignore'); }).each(function() {
	    	var $this = $( this ), 
	    		updatedInview = isInView.apply( $this ),
	    		thisData =  $this.data( wbName ),
	    		setInview = thisData && thisData.inview,
	    		movedInView = updatedInview && !setInview,
	    		movedOutView = !updatedInview && setInview,
	    		updated = movedInView || movedOutView;

	    	if ( updated ) {

	    		$this.data(wbName, { inview: updatedInview });

	    		if ( movedInView ) {
	    			$this.trigger( wbName + '.' + inview ).attr( dataName, true );
	    		} else if ( movedOutView ) {
	    			$this.trigger( wbName + '.' + outview ).removeAttr( dataName );
	    		}
			}
		});
	};
	
	$.fn.waybetter = function( method ) {
   	    if ( ! method || $.isFunction( method ) || $.isPlainObject( method ) ) {
	      return init.apply( this, arguments );
	    } else if ( methods[method] ) {
	      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else {
	      $.error( 'Method ' +  method + ' does not exist on Waybetter' );
	    }   
	};
	
	$.fn.waybetter.settings = { direction: 'vertical', 
								threshold: 0, 
								viewport: window 
							  };

})( window, jQuery );