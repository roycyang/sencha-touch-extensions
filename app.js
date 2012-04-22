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
                    html: 'Most recent code is at <a href="https://github.com/roycyang/sencha-touch-extensions">https://github.com/roycyang/sencha-touch-extensions</a>'
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
