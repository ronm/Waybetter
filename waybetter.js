(function( window, $ ){
	"use strict";
	
	var name = 'waybetter',
	methods = {
		destroy: function() { 
			return this.each(function() {
				var i = $.inArray(this, $.fn.waybetter.elements);
				if ( i > -1 ) {
					$.fn.waybetter.elements.splice(i, 1);
					$(this).data(name, { inview: false }).removeAttr( "data-" + name ).trigger( name + ".destroyed" );
				}
			});
		},
		enable: function() {
			this.waybetter().trigger( name + ".enabled" );
		},
	    inview : (function() { return isInView.apply( this ); }),
	    refresh : (function() { 
	    	this.trigger( name + ".refreshed" );
	    	return process.apply( this ); 
	    }),
	},
	init = function( options ) { 
    	$.fn.waybetter.settings = $.extend( $.fn.waybetter.settings, options );
    	
    	if ( !$.fn.waybetter.elements ) {
	    	$.fn.waybetter.elements = this.slice(0, this.length);
	    	$(window).on( "scroll." + name + " " + "resize." + name, function() { process.apply( $( $.fn.waybetter.elements ) ); });
    	} else {	
	    	this.each(function() { 
	    		if ( $.inArray(this, $.fn.waybetter.elements) === -1 ) {
		    		$.fn.waybetter.elements.push( this );	
	    		}
	    	});
    	}

	  	return process.apply( $.fn.waybetter.elements );
	},
	isInRange = function( n, a, b) { return ( a < n && n < b ); },
	isInView = function() {
	    var direction = $.fn.waybetter.settings.direction,
	    	threshold = $.fn.waybetter.settings.threshold,
	    	viewport = $( $.fn.waybetter.settings.viewport ),
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
		
		return isInRange(elOffsetFromviewport, (threshold - viewportSize), (elSize - threshold));
	},
	process = function() {
	    return this.each(function() {
	    	var $this = $( this ), 
	    		settings = $.fn.waybetter.settings,
	    		updatedInview = isInView.apply( $this ),
	    		thisData =  $this.data( name ),
	    		setInview = thisData && thisData.inview,
	    		movedInView = updatedInview && !setInview,
	    		movedOutView = !updatedInview && setInview;
	    					
	    	if ( movedInView || movedOutView ) {
	    		if ( movedInView ) {
		    		$this.data(name, { inview: true }).attr( "data-" + name, true ).trigger( name + '.inview' );
	    		} else if ( movedOutView ) {
					$this.data(name, { inview: false }).removeAttr( "data-" + name ).trigger( name + '.outview' );
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
	
	$.fn.waybetter.elements;
	$.fn.waybetter.settings = { direction: 'vertical', threshold: 0, viewport: window };

})( window, jQuery );