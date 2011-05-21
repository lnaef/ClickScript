/**
 * @author elcc
 */
	
	dojo.provide("cs.controller.Serializer");
	
 	dojo.declare("cs.controller.Serializer", null, {
		br : "\n",
		cutBr : function(a_text){			
			return (a_text.lastIndexOf(this.br)==a_text.length-this.br.length) ? a_text.substring(0,a_text.length-this.br.length) : a_text;
		},
		formatLine : function(a_text){
			return this.cutBr(a_text).replace(/\t/g,"\t\t")+this.br; 
		},
		createElement : function(a_starttag,a_childstring,a_stoptag){
			if((dojo.isString(a_childstring)) && a_stoptag){
				var output = "\t"+a_starttag + this.br;
				    output += a_childstring?"\t"+this.cutBr(a_childstring).replace(/\n\t/g,"\n\t\t")+this.br:"";
					output += "\t"+a_stoptag + this.br;
				return output;
			} else if(a_starttag && ! a_childstring && ! a_stoptag) {
				return "\t" + a_starttag + this.br;
			} else {
				throw Error("Wrong inputs for cs.serializer.createElement() " + a_starttag +"," + a_childstring +","+ a_stoptag);
			}
			
		}
	});
	
	cs.serializer = new cs.controller.Serializer();

	



	
