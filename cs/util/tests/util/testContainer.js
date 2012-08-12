/**
 * @author lnaef
 */
	dojo.provide("cs.util.tests.util.testContainer");
	
	dojo.require("cs.util.Container");
	
	doh.register("cs.util.tests.util.testContainer", [
		
		function wireConstructor(){
			var container = new cs.util.Container();
			doh.is(0,container.size());
		},
		
		function add(){
			var container = new cs.util.Container();
			var item = new cs.util.Container();
			
			container.add(item);
			container.add(item);
			
			doh.is(2,container.size());
		},
		
		function has(){
			var container = new cs.util.Container();
			var item = new cs.util.Container();
			var item2 = new cs.util.Container();
			
			container.add(item);
			doh.t(container.has(item));
			doh.f(container.has(item2));
			
			container.add(item2);
			doh.t(container.has(item2));
		},
		
		function remove(){
			var container = new cs.util.Container();
			var item = new cs.util.Container();
			
			container.add(item);
			container.add(item);			
			doh.is(2,container.size());	
			
			container.remove(item);
			doh.is(1,container.size());
			
			container.remove(item);
			doh.is(0,container.size());
		},
		
		function forEach(){
			var container = new cs.util.Container();
			container.add(1);
			container.add(2);
			
			container.forEach(function(item,index,arr){
				arr[index] = item + 1;
			});
			
			var i = 0;
			container.forEach(function(item){
				i += item;
			});
			
			doh.is(5,i);
			
			var myA = {a:10};
			container.forEach(function(item,index,arr){
				arr[index] = this.a;
			},myA);
			
			doh.is(10,container.get(0));
			doh.is(10,container.get(1));
		}
		
		
	]);
