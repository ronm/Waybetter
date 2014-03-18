/**************************/
/*** waybetter ************/
/*** by Ron Marcelle ******/
/*** Licensed under MIT ***/
/**************************/
/* debounce function taken pretty */
/* direcly from underscore.js...thanks. */
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
	debounce = function(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments,
				later = function() {
					timeout = null;
					if (!immediate) func.apply(context, args);
				},
				callNow = immediate && !timeout;

			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	},
	init = function( options ) { 
    	$.fn.waybetter.settings = $.extend( $.fn.waybetter.settings, options );
    	if ( !$.fn.waybetter.elements ) {
	    	$.fn.waybetter.elements = this.slice(0, this.length);
	    	$(window).bind( "scroll." + name + " " + "resize." + name, debounce(function() { 
	    		process.apply( $( $.fn.waybetter.elements ) );
			}, $.fn.waybetter.settings.debounce));
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
		    		$this.data(name, { inview: true }).attr( "data-" + name, "" ).trigger( name + '.inview' );
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
	$.fn.waybetter.settings = { debounce: 0, direction: 'vertical', threshold: 0, viewport: window };


	$(function() {
		$('[data-' + name + '-watch]').waybetter();
	});

})( window, jQuery );