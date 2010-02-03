/**
 * Filter that produces HTML tree
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 * 
 * @include "../zen_coding.js"
 */
(function(){
	var child_token = '${child}';
	
	function getNewline() {
		return zen_coding.getNewline();
	}
	
	function getIndentation() {
		return zen_coding.getVariable('indentation');
	}
	
	function allowNewline(tag, profile) {
		return (profile.tag_nl === true || (profile.tag_nl == 'decide' && tag.isBlock()));
	}
	
	/**
	 * Creates HTML attributes string from tag according to profile settings
	 * @param {SimpleTag} tag
	 * @param {default_profile} profile
	 */
	function makeAttributesString(tag, profile) {
		// make attribute string
		var attrs = '',
			attr_quote = profile.attr_quotes == 'single' ? "'" : '"',
			cursor = profile.place_cursor ? zen_coding.getCaretPlaceholder() : '',
			attr_name;
			
		for (var i = 0; i < tag.attributes.length; i++) {
			var a = tag.attributes[i];
			attr_name = (profile.attr_case == 'upper') ? a.name.toUpperCase() : a.name.toLowerCase();
			attrs += ' ' + attr_name + '=' + attr_quote + (a.value || cursor) + attr_quote;
		}
		
		return attrs;
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
			
		var parts = data.split(child_token);
		item.start = parts[0] || '';
		item.end = parts[1] || '';
		
		var padding = (item.parent) 
			? item.parent.padding
			: zen_coding.repeatString(getIndentation(), level);
		
		if (item.parent) {
			item.start = getNewline() + padding + zen_coding.padString(item.start, padding);
			item.end = zen_coding.padString(item.end, padding);
		}
		
		// adjust item formatting according to last line of <code>start</code> property
		var lines = zen_coding.splitByLines(item.start),
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
			// looks like it's root element
			return item;
		
		var attrs = makeAttributesString(item, profile), 
			content = '', 
			cursor = profile.place_cursor ? zen_coding.getCaretPlaceholder() : '',
			self_closing = '',
			is_unary = (item.isUnary() && !item.children.length);
			

		if (profile.self_closing_tag == 'xhtml')
			self_closing = ' /';
		else if (profile.self_closing_tag === true)
			self_closing = '/';
			
		// define opening and closing tags
		var tag_name = (profile.tag_case == 'upper') ? item.name.toUpperCase() : item.name.toLowerCase();
		if (is_unary) {
			item.start = '<' + tag_name + attrs + self_closing + '>';
		} else {
			item.start = '<' + tag_name + attrs + '>';
			item.end = '</' + tag_name + '>';
		}
		
		// formatting output
		if (profile.tag_nl !== false) {
			var padding = (item.parent) 
				? item.parent.padding
				: zen_coding.repeatString(getIndentation(), level);
			
			if ((item.isBlock() && item.parent) || profile.tag_nl === true) {
				// formatting block-level elements
				
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
		
		if (!item.children.length && !is_unary)
			item.start += cursor;
		
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
			if (item.type == 'tag')
				item = processTag(item, profile, level);
			
			item = (item.type == 'tag') ? processTag(item, profile, level) : processSnippet(item, profile, level);
			
			item.start = item.start.replace(/\$/g, i + 1);
			process(item, profile, level + 1);
		}
		
		return tree;
	}
	
	zen_coding.registerFilter('html', process);
})();