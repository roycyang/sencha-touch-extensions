//<debug>
Ext.Loader.setPath({
    'GT': './'
});
//</debug>

/**
 * This is a simple example which shows some of the built-in icons that are supported in Sencha Touch.
 */

// Define our application
Ext.application({
    // Require the components which will be used in this example
    requires: [
        'GT.FixedButton'
    ],

    /**
     * The launch method is called when the browser is ready, and the application can launch.
     *
     * In this method we will create a TabPanel which will demonstrate the different icons you can have on taps. Then we will also
     * create a docked top toolbar with a bunch of buttons which also show icons.
     */
    launch: function() {

        // Create the tab panel component
        Ext.create('Ext.Panel', {
            // Make the tab panel fullscreen
            fullscreen: true,

            // Set the UI of the tabbar to light
            ui  : 'light',
            layout: 'vbox',
            // Add the two different buttons
            items: [
                {
                    padding: 20,
                    html: 'Most recent code is at <a href="https://github.com/roycyang/sencha-touch-extensions">https://github.com/roycyang/sencha-touch-extensions</a>.  If you tap on the Sencha touch button, notice that you need to press and release at the same pixel to activate the button.  The press state is also not tied to touchmove.  If you press the button and drag your finger off the button, it is still depressed.  For GT.FixedButton, both the press state and the activate event are tied to the touchmove and touchend.'
                },
                {
                    margin: 100,
                    xtype: 'button',
                    text: 'Default Sencha Button',
                    listeners: {
                          tap: function(){
                              alert('You tapped on Default Sencha Button!');
                          }
                      }
                },
                {
                    margin: 100,
                    xtype: 'fixedbutton',
                    text: 'GT.FixedButton Button',
                    listeners: {
                        tap: function(){
                            alert('You tapped on GT.FixedButton Button!');
                        }
                    }
                },
                // Also add a toolbar
                {
                    xtype: 'toolbar',

                    // Dock it to the top
                    docked: 'top',
                    title: 'Comparing Button UX'
                }
            ]
        });
    }
});
