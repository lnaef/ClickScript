/**
 * @author elcc
 */
	dojo.provide("cs.view.exec.Component");
	
	dojo.declare("cs.view.exec.Component", null, {
		
		/**
		 * Dom node as far as it is placed to the playground
		 * only source from the user defined view component
		 */
		_node : null,
		
		/**
		 * Node of hole exec view item
		 */
		_item : null,
		
		constructor : function(a_meta_view_component, a_playground){
		
			// copy all functions from the meta_view_component
			dojo.mixin(this,this,a_meta_view_component);
			
			// load item to the playground
			this.loadItem(a_playground);
			
 
		},
		
		/**
		 * load the item to the a_playground
		 * add all eventlisteners and make it moveable
		 */
		loadItem : function(a_playground){
 		
			// place component to the view and save reference to the node
 			this._item = dojo.place("<div class='csEVItem'>" +
 									"  <div class='csEVItemNode'></div>" +
 									"  <div class='csEVItemLabel'></div>" +
 									"</div>",a_playground,"last");
 			this._node = dojo.place(this.getSource(),dojo.query(".csEVItemNode",this._item)[0]);			

 			// make node moveable with constraints of playground
 			var mydnd = new dojo.dnd.move.constrainedMoveable(this._item,{skip: true, within : true, constraints:function(){return dojo.marginBox(a_playground);}});
 			
 			// move to front during move
 			dojo.connect(mydnd,"onMoveStart",function(mover){
 				dojo.style(mover.host.node,"zIndex",10);
 				dojo.addClass(mover.host.node,"csEVItemActive");
 			});
 			dojo.connect(mydnd,"onMoveStop",function(mover){
 				dojo.style(mover.host.node,"zIndex",1);
 				dojo.removeClass(mover.host.node,"csEVItemActive");
 			});
 			
 			// on double click set the label
 			dojo.connect(this._item,"ondblclick",this,function(e){
 				this.setLabel(prompt("enter label text:",this.getLabel()));
 			},true);
		},
		
		getNode : function(){
		   return this._node;	
		},
		
		destroy : function(){
			dojo.destroy(this._item);
		},
		
		getSource : function(){
			if(this.source){
				return this.source;
			} else {
				return "View object has no 'source' property";
			}
		},
		
		setLabel : function(a_text){
			dojo.query(".csEVItemLabel",this._item)[0].innerHTML = a_text;
		},
		
		getLabel : function(){
			return dojo.query(".csEVItemLabel",this._item)[0].innerHTML;
		},
		
		highlightOn : function(){
			dojo.addClass(this._item,"csEVItemHighlight");
		},
		
		highlightOff : function(){
			dojo.removeClass(this._item,"csEVItemHighlight");
		}
			
	});