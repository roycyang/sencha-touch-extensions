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
        //<debug>
        //console.log('in it!');
        //</debug>
    },

    /**
     * @private
     * removed the tap event and rolling our own logic
     */
    initialize: function() {
    	var me = this;
    	
        me.callParent();
        me.element.setStyle('overflow', 'visible');
        
        me.setMaskSize(1);
        
        if(me.getTapMask()){
            me.setMaskColor(true);
        }

        me.element.on({
            scope      : me,
            touchstart : 'onPress',
            dragend    : 'onRelease',
            drag       : 'onMove',
            tap        : 'onTap'
        });
    },
    
    // @private
    setMaskSize: function(factor){
    	var me = this,
    		parsedFactor = factor || me.getTapMaskFactor();
        
        // change tapMask size
        me.tapMask.setStyle({
            paddingTop: me.getTapOverflowTop() * parsedFactor + 'px',
            paddingRight: me.getTapOverflowRight() * parsedFactor + 'px',
            paddingBottom: me.getTapOverflowBottom() * parsedFactor + 'px',
            paddingLeft: me.getTapOverflowLeft() * parsedFactor + 'px',
            top: '-' + me.getTapOverflowTop() * parsedFactor + 'px',
            left: '-' + me.getTapOverflowLeft() * parsedFactor + 'px'
        });
    },
    
    // @private
    setMaskColor: function(reset){    
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
        var me = this,
        	element = me.element,
            pressedCls = me.getPressedCls();
            
        if (!me.getDisabled()) {
            me.isPressed = true;
            
            me.setMaskSize();
            
            if(me.getTapMask()){
                // makes the mask bigger
                me.setMaskColor();
            }
            
            //adding a pressed flag
            if(!e.target.children.length){
                me.pressedTarget = e.target.parentElement.id;
            }else{
                me.pressedTarget = e.target.id;
            }
            
            // until the Sencha touch target bug gets fixed, we are using actual x/y coordinates
            var target = Ext.getCmp(me.pressedTarget),
            	tapMaskFactor = me.getTapMaskFactor();
            me.pressedTargetLeft = target.element.getX() - (me.getTapOverflowLeft() * tapMaskFactor);
            me.pressedTargetWidth = target.element.getWidth() + (me.getTapOverflowLeft() * tapMaskFactor) + (me.getTapOverflowRight() * tapMaskFactor);
            me.pressedTargetTop = target.element.getY() - (me.getTapOverflowTop() * me.getTapMaskFactor());
            me.pressedTargetHeight = target.element.getHeight() + (me.getTapOverflowTop() * tapMaskFactor) + (me.getTapOverflowBottom() * tapMaskFactor)
            
            if (me.hasOwnProperty('releasedTimeout')) {
                clearTimeout(me.releasedTimeout);
                delete me.releasedTimeout;
            }

            element.addCls(pressedCls);
        }
    },


    // @private
    // when user moves, test to see if touch even is still the target
    onMove: function(e, element) {
        var me = this;
        
        if (!me.isPressed) {
          return;
        }
                                   
        // until the Sencha touch target bug gets fixed, we are using actual x/y coordinates
        // this tests to see if the touch is over the tapmask or not to show the tapzone in green
        // or red
        if(
            e.pageX < me.pressedTargetLeft || 
            e.pageX > (me.pressedTargetLeft + me.pressedTargetWidth) ||
            e.pageY < me.pressedTargetTop || 
            e.pageY > (me.pressedTargetTop + me.pressedTargetHeight)
        ){
            me.element.removeCls(me.getPressedCls());
            if(me.getTapMask()){
                me.tapMask.setStyle({
                    'background': 'red'
                });
            }
        }else{
            me.element.addCls(me.getPressedCls());
            if(me.getTapMask()){
                me.tapMask.setStyle({
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

        me.setMaskSize(1);
        
        if(me.getTapMask()){
            // resets mask
            me.setMaskSize(true);
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
