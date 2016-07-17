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
	waybetter = (function( elements, options ) { return new Waybetter( elements, options ); }),
	Waybetter = function() {
		var that = this;

		that.elements = arguments[0].length ? arguments[0] : Array.prototype.slice.call( arguments, 0, 1 );

		that.elements.forEach(function(el) { el[name] = {}; });

		that.settings = extend( {
			debounce: 0,
			direction: 'vertical',
			threshold: 0,
			viewport: window
		}, arguments[1] || {} );		

		that.callback = debounce(function() { process.apply( that ); }, that.settings.debounce);

		if ( !waybetter.elements.length ) { ["scroll", "resize"].forEach(function(evt){
			window.addEventListener(evt, that.callback); 
		}); }

		that.elements.forEach(function(element) {
			if ( waybetter.elements.indexOf(element) === -1 ) { waybetter.elements.push( element ); } 
		});

		that.destroy = function() {
			that.elements.forEach(function(element) {
				element[name].inview = false;
				element.removeAttribute("data-" + name);
				element.dispatchEvent( new Event("inview") );

				var i = waybetter.elements.indexOf(el);
				if ( i > -1 ) { waybetter.elements.splice(i, 1); }

				that.callbacks.forEach(function(callback) {
					element.removeEventListener(name + "." + inout + "view", callback);
				});				
			});

			that.elements = [];

			if ( !waybetter.elements.length ) {
				["scroll", "resize"].forEach(function(evt){ window.removeEventListener(evt, that.callback); });
			}

			return that;
		};

	    that.inview = (function() { return isInView.apply( this ); });

	    that.refresh = (function() {
			this.dispatchEvent( new Event("refresh") );
	    	return process.apply( that );
	    }); 

	    that.on = (function(inout, callback) {
		    that.callbacks = that.callbacks ? that.callbacks : [];
		    that.callbacks.push({inout: inout, callback: callback});
		    
		    that.elements.forEach(function(element) {
			    element.addEventListener(name + "." + inout + "view", callback);
		    });

		    return that;
	    });   

	    return process.apply( that );
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
	isInView = (function(el) {
		
		if ( el.length < 1 ) { return; }
		
	    var threshold = this.settings.threshold,
	    	viewport = this.settings.viewport,
			bounds = el.getBoundingClientRect();

		return ( this.settings.direction === "vertical" ? 
			(bounds.bottom + threshold >= 0 && bounds.top + threshold <= (viewport.innerHeight || viewport.clientHeight) ) : 
				(bounds.right + threshold >= 0 && bounds.left + threshold <= (viewport.innerWidth || viewport.clientWidth)) );
	}),
	process = function() {
		var that = this;
	    waybetter.elements.forEach(function(element) {
	    	var settings = that.settings,
	    		updatedInview = isInView.call( that, element ),
	    		thisData =  element[name],
	    		setInview = thisData && thisData.inview,
	    		movedInView = updatedInview && !setInview,
	    		movedOutView = !updatedInview && setInview;
				
			
	    	if ( movedInView || movedOutView ) {
	    		if ( movedInView ) {
					element[name].inview = true;
					element.setAttribute("data-" + name, "");
					element.dispatchEvent( new Event("inview") );
	    		} else if ( movedOutView ) {
					element[name].inview = false;
					element.removeAttribute("data-" + name);
					element.dispatchEvent( new Event("outview") );
	    		}
			}
		});

		return that;
	};

	waybetter.elements = [];

	var watch = document.querySelectorAll('[data-' + name + '-watch]');
	if ( watch.length ) { waybetter(watch, { direction: "vertical"}); }

	window.waybetter = waybetter;

})( window );