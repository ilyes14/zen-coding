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
	 * Test if passed node has block-level sibling element
	 * @param {ZenNode} item
	 * @return {Boolean}
	 */
	function hasBlockSibling(item) {
		return (item.parent && item.parent.hasBlockChildren());
	}
	
	/**
	 * Test if passed itrem is very first child of the whole tree
	 * @param {ZenNode} tree
	 */
	function isVeryFirstChild(item) {
		return item.parent && !item.parent.parent && !item.previousSibling;
	}
	
	/**
	 * Processes element with <code>snippet</code> type
	 * @param {ZenNode} item
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
		
		if (!isVeryFirstChild(item)) {
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
	 * Processes element with <code>tag</code> type
	 * @param {ZenNode} item
	 * @param {Object} profile
	 * @param {Number} [level] Depth level
	 */
	function processTag(item, profile, level) {
		if (!item.name)
			// looks like it's a root element
			return item;
		
		item.start = item.end = placeholder;
		
		var is_unary = (item.isUnary() && !item.children.length);
			
		// formatting output
		if (profile.tag_nl !== false) {
			var padding = (item.parent) 
					? item.parent.padding
					: zen_coding.repeatString(getIndentation(), level),
				force_nl = (profile.tag_nl === true);
			
			// formatting block-level elements
			if ((item.isBlock() && item.parent) || force_nl) {
				// snippet children should take different formatting
				if (!item.parent || (item.parent.type != 'snippet' && !isVeryFirstChild(item)))
					item.start = getNewline() + padding + item.start;
					
				if (item.hasBlockChildren() || (force_nl && !is_unary))
					item.end = getNewline() + padding + item.end;
					
				if (force_nl && !item.hasChildren() && !is_unary)
					item.start += getNewline() + padding + getIndentation();
				
			} else if (item.isInline() && hasBlockSibling(item) && !isVeryFirstChild(item)) {
				item.start = getNewline() + padding + item.start;
			}
			
			item.padding = padding + getIndentation();
		}
		
		return item;
	}
	
	/**
	 * Processes simplified tree, making it suitable for output as HTML structure
	 * @param {ZenNode} tree
	 * @param {Object} profile
	 * @param {Number} [level] Depth level
	 */
	function process(tree, profile, level) {
		level = level || 0;
		
		for (var i = 0, il = tree.children.length; i < il; i++) {
			/** @type {ZenNode} */
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