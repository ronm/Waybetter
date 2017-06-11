/**************************/
/*** waybetter ************/
/*** by Ron Marcelle ******/
/*** Licensed under MIT ***/
/**************************/

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.Waybetter = factory();
  }
}(this, function () {
	
	let name = "waybetter";

	let defaultOptions = {
		threshold: 0,
		viewport: window, 
	};

	class WaybetterElement {
		constructor(item, opts = {}) {
			this.node = item;
			this.opts = Object.assign(defaultOptions, opts);
			this.state = false;
			this.enabled = true;
		}
		
		inView() {//console.log(this)
	    		var b = this.node.getBoundingClientRect(), t = this.opts.threshold, v = this.opts.viewport;
	        return (b.bottom + t >= 0 && b.top + t <= v.innerHeight ) && (b.right + t >= 0 && b.left + t <= v.innerWidth);
	    }
		
		trigger(type) {  
	        let event;
					
	        try {
	            event = new Event(name + "." + type, { 'bubbles': true });
	        } catch (e) {
	            event = document.createEvent('Event');
	            event.initEvent(name + "." + type, true, true);
	        }
	
			this.node.dispatchEvent( event )
	    }
		
		enable() {
			this.enabled = true;
		}
		
		disable() {
			this.enabled = false;
		}
	}
		
	return class Waybetter {
	    constructor(items) {
	        this.items = this._buildFromArray(items);
			this.viewport = this.items.map(item => item.options && item.options.viewport)[0] || window;
			this.enabled = true;
			this._eventListener = () => this.refresh();
		    this._init();
	    }
	
	    refresh() {
	        this._process();
	    }
	    
	    add(items) {
			this.items = this.items.concat(this._buildFromArray(items));
	    }
	    
	    remove(node) {
		    if ( Array.isArray(node) ) {
				return node.forEach(n => this.remove(n));
		    }
			let index = this.items.findIndex(item => item.node === node);
			return index > -1 ? this.items.splice(index, 1) : false;
	    }
		
		enable() {
			this.enabled = true;
		}
	
		disable() {
			this.enabled = false;
		}
		
		find(node) {
			return this.items.filter(item => item.node === node)[0];
		}
		
		destroy() {
			// delete event listners on viewport
			this.viewport.removeEventListener("scroll", this._eventListener);
			this.viewport.removeEventListener("resize", this._eventListener);
			// remove waybtter attribute on all items
			this.items.forEach(item => item.node.removeAttribute(name));
		}
		
		watch() {
			let els = document.querySelectorAll(`[${name}-watch]`);
			if ( els.length ) {	this.add( [].slice.apply( els ) ); }
	
			// create an observer instance
			var observer = new MutationObserver(mutations => {
				mutations.forEach(mutation => { 
					if (mutation.addedNodes.length) {
						if ( mutation.addedNodes[0].nodeType !== 1 ) return;				
						let watch = [].slice.apply( mutation.addedNodes[0].querySelectorAll(`[${name}-watch]`) );
						if ( mutation.addedNodes[0].hasAttribute(`${name}-watch`) ) {
							watch.push(mutation.addedNodes[0]);
						}

						if ( watch.length ) { 
							this.add(watch);
							this.refresh();
						}
					} else if (mutation.removedNodes.length) {
						if ( mutation.removedNodes[0].nodeType !== 1 ) return;					
						let unWatch = [].slice.apply( mutation.removedNodes[0].querySelectorAll(`[${name}-watch]`) );
	
						if ( mutation.removedNodes[0].hasAttribute(`${name}-watch`) ) {
							watch.push(mutation.removedNodes[0]);
						}

						this.remove(unWatch);
				   	}
				});
			});
	
			// pass in the target node, as well as the observer options
			observer.observe(document.body, {childList: true, subtree: true});	
			//observer.disconnect();
			
			return this;
		}
	
		_init() {
			this.viewport.addEventListener("scroll", this._eventListener);
			this.viewport.addEventListener("resize", this._eventListener);
			this.refresh();
		}
	    
		_process() {
			this.enabled && this.items.forEach(item => {
				if ( item.enabled ) {
					let inview = item.inView();
					if ( inview !== item.state ) { 
						item.state = inview;
						inview ? item.node.setAttribute(name, "") : item.node.removeAttribute(name);
						item.trigger(item.state?"enter":"exit")
					}
					if ( inview ) {
						let bounds = item.node.getBoundingClientRect();
						item.node.progress =  Math.min( 1, Math.max(0, 1 - (bounds.top + bounds.height)/window.innerHeight));
						item.trigger("progress")
					}
				}
			});	
		}
		
		_buildFromArray(arr) {
			let items = arr ? (arr.length ? (Array.isArray(arr) ? arr : [].slice.apply(arr)) : [arr]) : [];
			return items.map(item => new WaybetterElement(item.element || item, item.options || {}));
		}
	}
}));