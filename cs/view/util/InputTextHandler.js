/**
 * @author elcc
 * 
 * CS.VIEW.UTIL.INPUTTEXTHANDLER - represents a shape with functionality like an input field in html
 */
	dojo.provide("cs.view.util.InputTextHandler");

	dojo.require("cs.util.Reader");

	dojo.declare("cs.view.util.InputTextHandler", cs.util.Reader, {
	
		/**
		 * HTML console node
		 */
		_shape : null,
	
		constructor : function(a_reader_constructor, a_shape){
			this._shape = a_shape;
			this.setValue(a_shape.getShape().text);
		},
		
		/**
		 * Change text to a_text and show '<' if cursor is activated
		 * @param {String} a_text
		 * @param {Boolean} a_cursor_isActive
		 */
		updateText : function(a_text, a_cursor_isActive){
			// update text and redraw
			var shape = dojo.clone(this._shape.getShape());
			shape.text = a_text + (a_cursor_isActive?"<":"");
			this._shape.setShape(shape);
		},
		
		getShape : function (){
			return this._shape;
		},
		
		focus : function(){
			
			// focus on main window 
			// usefull if we work with iframes and focus is on them
			window.focus();
			
			// remove all possible focused input fields
			dojo.query('input').forEach(function(item){
				item.blur();
			});

		},
		
		/**
		 * Fired after pressing ENTER or Abort with CTRL+C
		 * If it is an abort the value will be an empty string
		 * @param {String} a_value The entered word
		 */
		onAfterReading : function(a_value){
			this.setValue(a_value);
			this.setPrefix("");
		},
		
		/**
		 * Fired after pressing CTRL+C
		 */
		onAbortReading : function(a_value_before_abort){

		}
		
	});
