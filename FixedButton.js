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
    config: {
        /**
         * @cfg {String} tapMask
         * Optional tap mask indicator.
         * @accessor
         */
        
    }, 
    template: [
        {
            tag: 'span',
            reference: 'tapMask',
            style: {
                position: 'absolute',
                width: '100%',
                height: '100%',
                boxSizing: 'content-box'
            }
        },
        {
            tag: 'span',
            reference: 'badgeElement',
            hidden: true
        },
        {
            tag: 'span',
            className: Ext.baseCSSPrefix + 'button-icon',
            reference: 'iconElement',
            hidden: true
        },
        {
            tag: 'span',
            reference: 'textElement',
            hidden: true
        }
    ],
    
    /**
     * @private
     */
    updateTapMask: function(tapMask) {
        console.log('in it!');
    },

    // removed the tap event and rolling our own logic
    initialize: function() {
        this.callParent();
        
        this.element.setStyle('overflow', 'visible');
        
        console.log('this', this);
        if(this.getTapMask()){
            this.tapMask.setStyle({
                'background': 'orange',
                'opacity' : '0.2'
            });
        }
        
        this.setMaskSize(1, true);

        this.element.on({
            scope      : this,
            touchstart : 'onPress',
            dragend    : 'onRelease',
            drag       : 'onMove',
            tap        : 'onTap'
        });
    },
    
    // @private
    setMaskSize: function(factor, reset){
        var parsedFactor = factor || this.getTapMaskFactor();
        
        this.tapMask.setStyle({
            paddingTop: this.getTapOverflowTop() * parsedFactor + 'px',
            paddingRight: this.getTapOverflowRight() * parsedFactor + 'px',
            paddingBottom: this.getTapOverflowBottom() * parsedFactor + 'px',
            paddingLeft: this.getTapOverflowLeft() * parsedFactor + 'px',
            top: '-' + this.getTapOverflowTop() * parsedFactor + 'px',
            left: '-' + this.getTapOverflowLeft() * parsedFactor + 'px'
        });
        
        if(this.getTapMask() && reset){
            this.tapMask.setStyle({
                'background': 'orange'
            });
        } else if(this.getTapMask()){
            this.tapMask.setStyle({
                'background': 'green'
            });
        }
    },

    // @private
    onPress: function(e) {
        var element = this.element,
            pressedCls = this.getPressedCls();
            


        if (!this.getDisabled()) {
            this.isPressed = true;
            
            // makes the mask bigger
            this.setMaskSize();
            
            // adding a pressed flag
            if(!e.target.children.length){
                this.pressedTarget = e.target.parentElement.id;
            }else{
                this.pressedTarget = e.target.id;
            }
            
            console.log('onPress ' + this.pressedTarget);

            if (this.hasOwnProperty('releasedTimeout')) {
                clearTimeout(this.releasedTimeout);
                delete this.releasedTimeout;
            }

            element.addCls(pressedCls);
            
        }
    },


    // @private
    // when user moves, test to see if touch even is still the target
    onMove: function(e, element) {
        console.log('e', e);
        if (!this.isPressed) {
          return;
        }
        

        
        var currentPressedTarget;
        var elem = Ext.get(element);
        
        if(Ext.getCmp('debugconsole')){
            Ext.getCmp('debugconsole').setHtml(Ext.getCmp('debugconsole').getHtml() + '<br/>touchmove target id: ' + element.id);
            Ext.getCmp('debugconsole').getScrollable().getScroller().scrollToEnd();
        }   
                   
        // clicked on the label or icon instead of the button
        if(elem.parent('.x-button')){
            currentPressedTarget = elem.parent('.x-button').id;
        }else if(elem.hasCls('x-button')){
            currentPressedTarget = elem.id;
        }
        
        if(currentPressedTarget != this.pressedTarget){
            this.element.removeCls(this.getPressedCls());
            if(this.getTapMask()){
                this.tapMask.setStyle({
                    'background': 'red'
                });
            }
        }else{
            this.element.addCls(this.getPressedCls());
            if(this.getTapMask()){
                this.tapMask.setStyle({
                    'background': 'green'
                });
            }
            
        }
    },
    
    // @private
    onRelease: function(e, element) {
        this.fireAction('release', [this, e, element], 'doRelease');
    },

    // @private
    doRelease: function(me, e, element) {
        // resets mask
        this.setMaskSize(1, true);
        
        var currentPressedTarget;
        var elem = Ext.get(element);
        
        // clicked on the label or icon instead of the button
        if(elem.parent('.x-button')){
            console.log('inside!');
            currentPressedTarget = elem.parent('.x-button').id;
        }else if(elem.hasCls('x-button')){
            currentPressedTarget = elem.id;
        }
        
        console.log('doRelease' + currentPressedTarget);
        
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
                  me.fireAction('tap', [me, e], 'doTap');
                }

            }
            
            // remove the pressedTarget flag
            me.pressedTarget = null;
        }, 10);
    },
    
    // @private
    // disable the existing onTap function from Ext.Button
    onTap: function(e) {
        return false;
    },
    


});
