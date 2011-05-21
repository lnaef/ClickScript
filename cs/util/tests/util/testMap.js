/**
 * @author elcc
 */
	dojo.provide("cs.util.tests.util.testMap");
	
	dojo.require("cs.util.Map");
	
	doh.register("cs.util.tests.util.testMap", [
		
		function wireConstructor(){
			var map = new cs.util.Map();
			doh.is(0,map.size());
		},
		
		function put(){
			var map = new cs.util.Map();
			var item = new cs.util.Map();
			
			map.put("key1",item);
			map.put("key2",item);
			
			doh.is(2,map.size());
			doh.t(item,map.get("key1"));
		},
		
		
		function has(){
			var map = new cs.util.Map();
			var item = new cs.util.Map();
			var item2 = new cs.util.Map();
			
			map.put("key1",item);
			doh.t(map.has("key1"));
			doh.f(map.has("key2"));
			
			map.put("key2",item2);
			doh.t(map.has("key2"));
		},
		
		function remove(){
			var map = new cs.util.Map();
			var item = new cs.util.Map();
			
			map.put("key1", item);
			map.put("key2", item);			
			doh.is(2,map.size());	
			
			doh.t(map.remove("key1"));
			doh.f(map.has("key1"));
			doh.t(map.has("key2"));
			
			map.remove("key2");
			doh.f(map.has("key2"));
		},
		
		function forEach(){
			var map = new cs.util.Map();
			map.put("a",1);
			map.put("b",2);
			
			map.forEach(function(item,key,themap){
				themap.put(key,item+1);
			});
			doh.is(2,map.get("a"));
			
			/*
			var i = 0;
			map.forEach(function(item){
				i += item;
			});
			
			doh.is(5,i);
			
			var myA = {a:10};
			map.forEach(function(item,index,arr){
				arr[index] = this.a;
			},myA);
			
			doh.is(10,map.item(0));
			doh.is(10,map.item(1));*/
		}
		
		
	]);
