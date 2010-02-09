/**
 * Format CSS properties: add space after property name:
 * padding:0; → padding: 0;
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */(function(){
	function process(tree, profile) {
		for (var i = 0, il = tree.children.length; i < il; i++) {
			/** @type {ZenNode} */
			var item = tree.children[i];
			
			// CSS properties are always snippets 
			if (item.type == 'snippet') {
				item.start = item.start.replace(/([\w\-]+\s*:)\s*/, '$1 ');
			}
			
			// replace counters
			item.start = zen_coding.replaceCounter(item.start, i + 1);
			item.end = zen_coding.replaceCounter(item.end, i + 1);
			process(item, profile);
		}
	}
	
	zen_coding.registerFilter('fc', process);
})();