/**************************/
/*** waybetter ************/
/*** by Ron Marcelle ******/
/*** Licensed under MIT ***/
/**************************/
/* debounce function taken pretty */
/* direcly from underscore.js...thanks. */
(function( window ){
	"use strict";

	var name = 'waybetter',
	waybetter = function( sel, method ) {
   	    if ( ! method || typeof(method) === "function" || typeof(method) === "object" ) {
	      return init.apply( sel, Array.prototype.slice.call( arguments, 1 ) );
	    } else if ( methods[method] ) {
	      return methods[ method ].apply( sel, Array.prototype.slice.call( arguments, 2 ));
	    }
	},
	createEvent = function(evName) {
		if ( typeof Event !== "undefined" ) {
			return new Event(name + "." + evName);
		} else {
			var evt = document.createEvent(name + '.refreshed');
			evt.initEvent("custom", true, true);
			return evt;
		}
	},
	extend = function(a, b){
	    for(var key in b) { if(b.hasOwnProperty(key)) { a[key] = b[key]; } }
	    return a;
	},
	methods = {
		destroy: function() {
			return ( this.length ? this : [this] ).forEach(function(el) {
				var i = waybetter.elements.indexOf(el);
				if ( i > -1 ) {
					waybetter.elements.splice(i, 1);
					el[name].inview = false;
					el.removeAttribute("data-" + name);
					el.dispatchEvent( createEvent("inview") ); }
			});
		},
		enable: function() {
			init.apply( this );
			this.dispatchEvent(createEvent("enabled"));
		},
	    inview : (function() { return isInView.apply( this ); }),
	    refresh : (function() {
			this.dispatchEvent(createEvent("refresh"));
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
		waybetter.settings = extend( waybetter.settings, options );
		var els = ( this.length ? this : [this] );
		els.forEach(function(el) { el[name] = {}; });

    	if ( !waybetter.elements ) {
	    	waybetter.elements = els.slice(0, this.length);
			["scroll", "resize"].forEach(function(event){
				window.addEventListener(event, debounce(function() {
		    		process.apply( waybetter.elements );
				}, waybetter.settings.debounce));
			});
    	} else {
	    	els.each(function() {
				if ( waybetter.elements.indexOf(els) === -1 ) { waybetter.elements.push( els ); }
	    	});
    	}

	  	return process.apply( waybetter.elements );
	},
	isInRange = function( n, a, b) { return ( a < n && n < b ); },
	isInView = function() {
	    var direction = waybetter.settings.direction,
	    	threshold = waybetter.settings.threshold,
	    	viewport = waybetter.settings.viewport;

	    if ( direction === "vertical" ) {
	    	var elOffset = this.offsetTop,
	    		elSize = this.clientHeight,
	    		viewportScroll = viewport.scrollTop,
	    		viewportSize = viewport.clientHeight;
	    } else {
	    	var elOffset = this.offsetLeft,
	    		elSize = this.clientWidth,
				viewportScroll = viewport.scrollLeft,
	    		viewportSize = viewport.clientWidth;
	    }

	    var elOffsetFromviewport = ( viewportScroll - elOffset );

		return isInRange(elOffsetFromviewport, (threshold - viewportSize), (elSize - threshold));
	},
	process = function() {
	    return this.forEach(function(el) {
	    	var settings = waybetter.settings,
	    		updatedInview = isInView.apply( el ),
	    		thisData =  el[name],
	    		setInview = thisData && thisData.inview,
	    		movedInView = updatedInview && !setInview,
	    		movedOutView = !updatedInview && setInview;

	    	if ( movedInView || movedOutView ) {
	    		if ( movedInView ) {
					el[name].inview = true;
					el.setAttribute("data-" + name, "");

					el.dispatchEvent(createEvent("inview"));
	    		} else if ( movedOutView ) {
					el[name].inview = false;
					el.removeAttribute("data-" + name);

					el.dispatchEvent(createEvent("outview"));
	    		}
			}
		});
	};

	waybetter.elements = "";
	waybetter.settings = {
		debounce: 0,
		direction: 'vertical',
		threshold: 0,
		viewport: document.body
	};

	waybetter(document.querySelector('[data-' + name + '-watch]'));

})( window );
