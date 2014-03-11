(function( window, $ ){
	
	var $win = $(window),
		$doc = $(document), 
		wbName = 'waybetter',
		dataName = "data-" + wbName,
		inview = 'inview',
		outview = 'outview',
		scroll = "scroll." + wbName,
		resize = "resize." + wbName,

	methods = {
		destroy: function() {
			var that = $(this);
			$win.off( scroll + " " + resize );

			$( '[data-' + wbName + ']' )
			$( '[data-' + wbName + ']' ).removeAttr( "data-" + wbName );
			$doc.trigger( wbName + ".destroyed" );
		},
	    inview : (function() { return isInView.apply( this ); }),
	    refresh : (function() { 
	    	$doc.trigger( wbName + ".refreshed" );
	    	return process.apply( this ); 
	    }),
	},
	init = function( options ) { 
    	var that = this;
        
        API.settings = $.extend({ direction: 'vertical', threshold: 0, context: window }, options );
	  	
	  	$win.on( scroll + " " + resize, function() { process.apply( that ); });
	  	$doc.trigger( wbName + ".ready" );
	  	return process.apply( that );
	},	
	isInView = function() {
	    var direction = API.settings.direction,
	    	threshold = API.settings.threshold,
	    	context = $( API.settings.context ),
	    	offset = this.offset();

	    if ( direction === "vertical" ) {
	    	var elOffset = offset.top, 
	    		elSize = this.outerHeight(), 
	    		contextScroll = context.scrollTop(), 
	    		contextSize = context.outerHeight();
	    } else {
	    	var elOffset = offset.left, 
	    		elSize = this.outerWidth(), 
	    		contextScroll = context.scrollLeft(), 
	    		contextSize = context.outerWidth();
	    }
	    
	    var elOffsetFromcontext = ( contextScroll - elOffset );

	    return  ( elOffsetFromcontext < (elSize - threshold)) && (elOffsetFromcontext > (threshold - contextSize));
	},
	process = function() {
	    return  $(this).each(function() {
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
	},
	API = {
		waybettercontext: (function() {
			var context = $( API.settings.context );

			return {
				height: context.outerHeight(),
				left: context.scrollLeft(),
				top: context.scrollTop(),
				width: context.outerWidth()
			}
		}),
		settings: null,
		version: '1'
	};

	$.fn.waybetter = function( method ) {
   	    if ( typeof method === 'object' || ! method ) {
	      return init.apply( this, arguments );
	    } else if ( methods[method] ) {
	      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else {
	      $.error( 'Method ' +  method + ' does not exist on jQuery.waybetter' );
	    }    
	};
	
	//$.fn.waybetter.API = API;

})( window, jQuery );
