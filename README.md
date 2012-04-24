GT.FixedButton
==============

This extends the Ext.Button in Sencha Touch 2.0 for a different, more iOS like user experience.  As the name suggests this works well for buttons that are fixed and not in a scrollable container.  It might also work with buttons in a scrollable container but haven't tested yet.


The Problem
=============== 

Currently, Ext.Button has the following rules:

1.  The button fires on the tap event.  This is not optimal because the user needs to tap the button and release it exactly on the same pixel, or else the tap event doesn't fire.  There is a thread about using moveThrottle (http://www.sencha.com/forum/showthread.php?188573-buttons-often-don-t-fire-a-tap-event-when-pressed&highlight=movethrottle) to give the tap event a tolerance:

<pre>
	Ext.application({
	    eventPublishers: {
	        touchGesture: {
	            moveThrottle: 3
	        }
	    },
	    // ...
	});
</pre>

But this code messes with the other touch events, making the carousel and all scrolling look choppy.  Even if that choppiness was acceptable, a 3px or 5px tolerance still isn't good enough.  Some users are "sloppy" tappers.

2.  When you touch a button, the press state is added.  Only when you let go (touchend), does the press state disappear.  Even if you touch the button and drag your finger off, the press state remains.  There is a fundamental flaw in the logic in that when the user sees the "press state" activated, they would expect the button to be "tapped" when they let go.

The Alternative
===============

This attempts to solve the use by doing the following:

1.  The tap event is tied to touchstart and touchend.  If you touch the button and then release and are still on the button, it will fire the tap event.  The user can now be as "sloppy" as they want.

2.  The press state is also tied to touchmove.  If you activate the button press and then move your finger off the button, the press state disappears and the tap event won't fire.


Getting Started
===============

To use this, add the following to your app.js:

<pre>
Ext.Loader.setPath({
    'GT': 'GT'
});
</pre>

From there, you will have access to the fixed button by using:

<pre>
requires: ['GT.FixedButton']

//...
xtype: 'fixedbutton'
</pre>