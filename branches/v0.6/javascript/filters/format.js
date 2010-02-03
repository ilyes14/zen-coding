/**
 * Generic formatting filter: creates proper indentation for each tree node,
 * placing "%s" placeholder where the actual output should be. You can use
 * this filter to preformat tree and then replace %s placeholder to whatever you
 * need. This filter should't be called directly from editor as a part 
 * of abbreviation.
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */(function(){
	var child_token = '${child}',
		placeholder = '%s';
	
	function getNewline() {
		return zen_coding.getNewline();
	}
	
	function getIndentation() {
		return zen_coding.getVariable('indentation');
	}
	
	/**
	 * Processes element with <code>snippet</code> type
	 * @param {SimpleTag} item
	 * @param {Object} profile
	 * @param {Number} [level] Depth level
	 */
	function processSnippet(item, profile, level) {
		var data = item.source.value;
			
		if (!data)
			// snippet wasn't found, process it as tag
			return processTag(item, profile, level);
			
		item.start = item.end = placeholder;
		
		var padding = (item.parent) 
			? item.parent.padding
			: zen_coding.repeatString(getIndentation(), level);
		
		if (item.parent) {
			item.start = getNewline() + padding + item.start;
		}
		
		// adjust item formatting according to last line of <code>start</code> property
		var parts = data.split(child_token),
			lines = zen_coding.splitByLines(parts[0] || ''),
			padding_delta = getIndentation();
			
		if (lines > 1) {
			var m = lines[lines.length - 1].match(/^(\s+)/);
			if (m)
				padding_delta = m[1];
		}
		item.padding = padding + padding_delta;
		
		return item;
	}
	
	/**
	 * Test if passed node has block-level sibling element
	 * @param {SimpleTag} item
	 * @return {Boolean}
	 */
	function hasBlockSibling(item) {
		return (item.parent && item.parent.hasBlockChildren());
	}
	
	/**
	 * Processes element with <code>tag</code> type
	 * @param {SimpleTag} item
	 * @param {Object} profile
	 * @param {Number} [level] Depth level
	 */
	function processTag(item, profile, level) {
		if (!item.name)
			// looks like it's a root element
			return item;
		
		item.start = item.end = placeholder;
			
		// formatting output
		if (profile.tag_nl !== false) {
			var padding = (item.parent) 
				? item.parent.padding
				: zen_coding.repeatString(getIndentation(), level);
			
			// formatting block-level elements
			if ((item.isBlock() && item.parent) || profile.tag_nl === true) {
				// snippet children should take different formatting
				if (!item.parent || item.parent.type != 'snippet')
					item.start = getNewline() + padding + item.start;
					
				if (item.hasBlockChildren())
					item.end = getNewline() + padding + item.end;
			} else if (item.isInline() && hasBlockSibling(item)) {
				item.start = getNewline() + padding + item.start;
			}
			
			item.padding = padding + getIndentation();
		}
		
		return item;
	}
	
	/**
	 * Processes simplified tree, making it suitable for output as HTML structure
	 * @param {SimpleTag} tree
	 * @param {Object} profile
	 * @param {Number} [level] Depth level
	 */
	function process(tree, profile, level) {
		level = level || 0;
		
		for (var i = 0, il = tree.children.length; i < il; i++) {
			/** @type {SimpleTag} */
			var item = tree.children[i];
			item = (item.type == 'tag') 
				? processTag(item, profile, level) 
				: processSnippet(item, profile, level);
				
			process(item, profile, level + 1);
		}
		
		return tree;
	}
	
	zen_coding.registerFilter('_format', process);
})();