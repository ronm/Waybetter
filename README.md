Waybetter
=========

Easy to use plugin to fire events when elements come into frame. Not much js skills needed. A better replacement for jQuery Waypoints.


Documentation
-------------

First of all: look at the [examples and read the source ;-)](https://github.com/Prinzhorn/skrollr/tree/master/examples). This might give you a feeling of how stuff works and you can see how some patterns can be implemented.

Requirements 
------------

jQuery 1.7, this is due to a single `on` event, I would think it would be fairly easy to get this to work with < jQuery 1.4


Usage
------

First include the `skrollr.js` in your document, towards the bottom...right? Then call `$elem.waybetter()`.

```html
	<script type="text/javascript" src="waybetter.min.js"></script>
	<script type="text/javascript">
		$("#item").waybetter();
	</script>
</body>
```

This would result in the below when `#item`

```html
<div id="item" data-waybetter="true">Lorem ipsum...</div>
```


Options
-----

Options can be passed to the waybetter function at initialization, otherwise it must be followed by the refresh method.

```html
	$("#item").waybetter({ direction : "horizontal" });
```

### direction=vertical

`string` Possible values : 'vertical' || 'horizontal'


### threshold=0

`number`

A positive value will cause the function to wait to trigger until that many pixels after the element has reached the viewport.

Conversely a negative value will cause the function to trigger that many pixels before the element has reached the viewport.


### viewport=window

`DOM Element` or `jQuery Element` or `string selector` This is the viewport that the position of the scrolling element is compared to. This will typically remain as window



Methods
-----

### destroy

This method stops all waybetter points within the document

`$(document).waybetter('destroy');`


### inview

Check whether a given item is within the viewport.  

`$("#item").waybetter('inview');`

returns `boolean`


### refresh

This will refresh all matched waybetter points. This is useful if you want to set different options after initialization.  

`$("#item").waybetter('refresh');`

