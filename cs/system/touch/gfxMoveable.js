/**
 * FILE SHOULD BE REMOVED AS FAST AS DOJO SUPPORTS TOUCH EVENTS ON GFX ON DEFAULT
 */

/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
	
	customization for reacting to mobile safari touchevents done by Wesley Lauka ( www.wesleylauka.com )
*/


if(!dojo._hasResource["cs.system.touch.gfxMoveable"]){
dojo._hasResource["cs.system.touch.gfxMoveable"]=true;
dojo.provide("cs.system.touch.gfxMoveable");
dojo.require("cs.system.touch.gfxMover");
dojo.declare("cs.system.touch.gfxMoveable",null,{constructor:function(_1,_2){
this.shape=_1;
this.delay=(_2&&_2.delay>0)?_2.delay:0;
this.mover=(_2&&_2.mover)?_2.mover:cs.system.touch.gfxMover;
this.events=[this.shape.connect("touchstart",this,"touchstart")];
},destroy:function(){
dojo.forEach(this.events,this.shape.disconnect,this.shape);
this.events=this.shape=null;
},touchstart:function(e){
if(this.delay){
this.events.push(this.shape.connect("touchmove",this,"touchmove"));
this.events.push(this.shape.connect("touchend",this,"touchend"));
this._lastX=e.touches[0].clientX;
this._lastY=e.touches[0].clientY;
}else{
new this.mover(this.shape,e,this);
}
dojo.stopEvent(e);
},touchmove:function(e){
if(Math.abs(e.touches[0].clientX-this._lastX)>this.delay||Math.abs(e.touches[0].clientY-this._lastY)>this.delay){
this.touchend(e);
new this.mover(this.shape,e,this);
}
dojo.stopEvent(e);
},touchend:function(e){
this.shape.disconnect(this.events.pop());
this.shape.disconnect(this.events.pop());
},onMoveStart:function(_3){
dojo.publish("/gfx/move/start",[_3]);
dojo.addClass(dojo.body(),"dojoMove");
},onMoveStop:function(_4){
dojo.publish("/gfx/move/stop",[_4]);
dojo.removeClass(dojo.body(),"dojoMove");
},onFirstMove:function(_5){
},onMove:function(_6,_7){
this.onMoving(_6,_7);
this.shape.applyLeftTransform(_7);
this.onMoved(_6,_7);
},onMoving:function(_8,_9){
},onMoved:function(_a,_b){
}});
}
