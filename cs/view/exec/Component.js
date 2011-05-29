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
		
		/**
		 * Reference to the playground
		 */
		_playground : null,
		
		/**
		 * Reference to the execModel
		 */
		_programModel : null,
		
		
		constructor : function(a_component_program_model, a_playground){
		
			// copy all functions from the meta_view_component
			dojo.mixin(this,this,a_component_program_model.getMetaData().getView());
			
			// set reference to the model
			this._programModel = a_component_program_model;
			
			// init playground
			this._playground = a_playground;
			
			// load item to the playground
			this.loadItem();
			
 
		},
		
		/**
		 * load the item to the a_playground
		 * add all eventlisteners and make it moveable
		 */
		loadItem : function(){
 			
 			var playgroundPosition = dojo.position(this._playground,true);
 		debugger;
			// place component to the view and save reference to the node
 			this._item = dojo.place("<div class='csEVItem' style='left:"+(playgroundPosition.x+this._programModel.getPositionExec().x)+"px;top:"+(playgroundPosition.y+this._programModel.getPositionExec().y)+"px'>" +
 									"  <div class='csEVItemNode'></div>" +
 									"  <div class='csEVItemLabel'></div>" +
 									"</div>",this._playground,"last");
 			this._node = dojo.place(this.getSource(),dojo.query(".csEVItemNode",this._item)[0]);			

 			// make node moveable with constraints of playground
 			var playground = this._playground;
 			var mydnd = new dojo.dnd.move.constrainedMoveable(this._item,{skip: true, within : true, constraints:function(){return dojo.marginBox(playground);}});
 			
 			// move to front during move
 			dojo.connect(mydnd,"onMoveStart",function(mover){
 				dojo.style(mover.host.node,"zIndex",10);
 				dojo.addClass(mover.host.node,"csEVItemActive");
 			});
 			dojo.connect(mydnd,"onMoveStop",this,function(mover){
 				dojo.style(mover.host.node,"zIndex",1);
 				dojo.removeClass(mover.host.node,"csEVItemActive");
 				// TODO: by event
 				var moverPosition = dojo.position(mover.node,true);
 				var playgroundPosition = dojo.position(this._playground,true);
 				
 				// update the position in the model
 				cs.modelController.updatePositionExec(this._programModel,moverPosition.x-playgroundPosition.x,moverPosition.y-playgroundPosition.y);
 				
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