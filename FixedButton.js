// 
//  FixedButton.js
//  GT.FixedButton
//   
//  Created by Roy Yang on 2012-04-21.
//  Extended from Sencha Ext.Button
//  For latest and greatest, go to https://github.com/roycyang/Sencha-Touch-Extensions

Ext.define('GT.FixedButton', {
    extend: 'Ext.Button',
    xtype: 'fixedbutton',

    // removed the tap event and rolling our own logic
    initialize: function() {
        this.callParent();

        this.element.on({
            scope      : this,
            touchstart : 'onPress',
            touchend   : 'onRelease',
            touchmove  : 'onMove',
        });
    },

    // @private
    onPress: function(e) {
        var element = this.element,
            pressedDelay = this.getPressedDelay(),
            pressedCls = this.getPressedCls();

        if (!this.getDisabled()) {
            this.isPressed = true;

            // adding a pressed flag
            // clicked on the label or icon instead of the button
            if(e.target.className.indexOf('x-button') == -1){
                this.pressedTarget = e.target.parentElement;
                console.log('button parent',this.pressedTarget);
            }else{
                this.pressedTarget = e.target;
                console.log('button',this.pressedTarget);
            }


            if (this.hasOwnProperty('releasedTimeout')) {
                clearTimeout(this.releasedTimeout);
                delete this.releasedTimeout;
            }

            if (pressedDelay > 0) {
                this.pressedTimeout = setTimeout(function() {
                    if (element) {
                        element.addCls(pressedCls);
                    }
                }, pressedDelay);
            }
            else {
                element.addCls(pressedCls);
            }

        }
    },


    // @private
    // when user moves, test to see if touch even is still the target
    onMove: function(e) {
        if (!this.isPressed) {
          return;
        }
        
        var currentPressedTarget;
        // clicked on the label or icon instead of the button
        if(e.target.className.indexOf('x-button') == -1){
            currentPressedTarget = e.target.parentElement;
        }else{
            currentPressedTarget = e.target;
        }
        
        if(currentPressedTarget != this.pressedTarget){
            this.element.removeCls(this.getPressedCls());
        }else{
            this.element.addCls(this.getPressedCls());
            
        }
    },
    
    // @private
    onRelease: function(e) {
        this.fireAction('release', [this, e], 'doRelease');
    },

    // @private
    doRelease: function(me, e) {
        var currentPressedTarget;
        // clicked on the label or icon instead of the button
        if(e.target.className.indexOf('x-button') == -1){
            currentPressedTarget = e.target.parentElement;
        }else{
            currentPressedTarget = e.target;
        }
        
        if (!me.isPressed) {
            return;
        }

        me.isPressed = false;

        if (me.hasOwnProperty('pressedTimeout')) {
            clearTimeout(me.pressedTimeout);
            delete me.pressedTimeout;
        }

        me.releasedTimeout = setTimeout(function() {
            if (me && me.element) {
                me.element.removeCls(me.getPressedCls());
                if(currentPressedTarget == me.pressedTarget){
                  console.log('me is', me);
                  console.log('e is', e);
                  me.fireAction('tap', [me, e], 'doTap');
                }

            }
            
            // remove the pressedTarget flag
            me.pressedTarget = null;
        }, 10);
    }

});
