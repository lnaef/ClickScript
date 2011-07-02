/**
 * FILE SHOULD BE REMOVED AS FAST AS DOJO SUPPORTS TOUCH EVENTS ON GFX ON DEFAULT
 */

/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
	
	customization for reacting to mobile safari touchevents done by Wesley Lauka ( www.wesleylauka.com )
*/


if(!dojo._hasResource["cs.system.touch.gfxMover"]){
dojo._hasResource["cs.system.touch.gfxMover"]=true;
dojo.provide("cs.system.touch.gfxMover");
dojo.declare("cs.system.touch.gfxMover",null,{constructor:function(_1,e,_2){
this.shape=_1;
this.lastX=e.touches[0].clientX;
this.lastY=e.touches[0].clientY;
var h=this.host=_2,d=document,_3=dojo.connect(d,"touchmove",this,"onFirstMove");
this.events=[dojo.connect(d,"touchmove",this,"touchmove"),dojo.connect(d,"touchend",this,"destroy"),dojo.connect(d,"ondragstart",dojo,"stopEvent"),dojo.connect(d,"onselectstart",dojo,"stopEvent"),_3];
if(h&&h.onMoveStart){
h.onMoveStart(this);
}
},touchmove:function(e){
var x=e.touches[0].clientX;
var y=e.touches[0].clientY;
this.host.onMove(this,{dx:x-this.lastX,dy:y-this.lastY});
this.lastX=x;
this.lastY=y;
dojo.stopEvent(e);
},onFirstMove:function(){
this.host.onFirstMove(this);
dojo.disconnect(this.events.pop());
},destroy:function(){
dojo.forEach(this.events,dojo.disconnect);
var h=this.host;
if(h&&h.onMoveStop){
h.onMoveStop(this);
}
this.events=this.shape=null;
}});
}
