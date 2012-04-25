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
        tapMask: null,
        tapMaskFactor: 2,
        tapOverflowTop: 10,
        tapOverflowBottom: 10,
        tapOverflowLeft: 10,
        tapOverflowRight: 10,
        
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

    /**
     * @private
     * removed the tap event and rolling our own logic
     */
    initialize: function() {
        this.callParent();
        this.element.setStyle('overflow', 'visible');
        
        if(this.getTapMask()){
            this.setMaskSize(1, true);
        }

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
        
        // change tapMask size
        this.tapMask.setStyle({
            paddingTop: this.getTapOverflowTop() * parsedFactor + 'px',
            paddingRight: this.getTapOverflowRight() * parsedFactor + 'px',
            paddingBottom: this.getTapOverflowBottom() * parsedFactor + 'px',
            paddingLeft: this.getTapOverflowLeft() * parsedFactor + 'px',
            top: '-' + this.getTapOverflowTop() * parsedFactor + 'px',
            left: '-' + this.getTapOverflowLeft() * parsedFactor + 'px'
        });
    
        // change tapMask color
        if(reset){
            this.tapMask.setStyle({
                'background': 'orange',
                'opacity' : '0.2'
            });
        } else{
            this.tapMask.setStyle({
                'background': 'green',
                'opacity' : '0.2'
            });
        }
    },

    // @private
    onPress: function(e) {
        var element = this.element,
            pressedCls = this.getPressedCls();
            
        if (!this.getDisabled()) {
            this.isPressed = true;
            
            if(this.getTapMask()){
                // makes the mask bigger
                this.setMaskSize();
            }
            
            //adding a pressed flag
            if(!e.target.children.length){
                this.pressedTarget = e.target.parentElement.id;
            }else{
                this.pressedTarget = e.target.id;
            }
            
            // until the Sencha touch target bug gets fixed, we are using actual x/y coordinates
            this.pressedTargetLeft = Ext.getCmp(this.pressedTarget).element.getX() - (this.getTapOverflowLeft() * this.getTapMaskFactor());
            this.pressedTargetWidth = Ext.getCmp(this.pressedTarget).element.getWidth() + (this.getTapOverflowLeft() * this.getTapMaskFactor()) + (this.getTapOverflowRight() * this.getTapMaskFactor());
            this.pressedTargetTop = Ext.getCmp(this.pressedTarget).element.getY() - (this.getTapOverflowTop() * this.getTapMaskFactor());
            this.pressedTargetHeight = Ext.getCmp(this.pressedTarget).element.getHeight() + (this.getTapOverflowTop() * this.getTapMaskFactor()) + (this.getTapOverflowBottom() * this.getTapMaskFactor())
            
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
        if (!this.isPressed) {
          return;
        }
                                   
        // until the Sencha touch target bug gets fixed, we are using actual x/y coordinates
        // this tests to see if the touch is over the tapmask or not to show the tapzone in green
        // or red
        if(
            e.pageX < this.pressedTargetLeft || 
            e.pageX > (this.pressedTargetLeft + this.pressedTargetWidth) ||
            e.pageY < this.pressedTargetTop || 
            e.pageY > (this.pressedTargetTop + this.pressedTargetHeight)
        ){
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

        if(this.getTapMask()){
            // resets mask
            this.setMaskSize(1, true);
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

                // until the Sencha touch target bug gets fixed, we are using actual x/y coordinates
                // this tests to see if the touch is over the tapmask or not
                if(!(
                    e.pageX < me.pressedTargetLeft || 
                    e.pageX > (me.pressedTargetLeft + me.pressedTargetWidth) ||
                    e.pageY < me.pressedTargetTop || 
                    e.pageY > (me.pressedTargetTop + me.pressedTargetHeight)
                )){
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
    }
});
