/**
 * Filter that produces HTML tree
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 * 
 * @include "../zen_coding.js"
 */
(function(){
	var child_token = '${child}';
	
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
			
		var parts = data.split(child_token),
			start = parts[0] || '',
			end = parts[1] || '',
			padding = item.parent ? item.parent.padding : '';
			
		item.start = item.start.replace('%s', zen_coding.padString(start, padding));
		item.end = item.end.replace('%s', zen_coding.padString(end, padding));
		
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
			is_unary = (item.isUnary() && !item.children.length),
			start= '',
			end = '';
			
		if (profile.self_closing_tag == 'xhtml')
			self_closing = ' /';
		else if (profile.self_closing_tag === true)
			self_closing = '/';
			
		// define opening and closing tags
		var tag_name = (profile.tag_case == 'upper') ? item.name.toUpperCase() : item.name.toLowerCase();
		if (is_unary) {
			start = '<' + tag_name + attrs + self_closing + '>';
			item.end = '';
		} else {
			start = '<' + tag_name + attrs + '>';
			end = '</' + tag_name + '>';
		}
		
		item.start = item.start.replace('%s', start);
		item.end = item.end.replace('%s', end);
		
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
		if (level == 0)
			tree = zen_coding.runFilters(tree, profile, '_format');
		
		for (var i = 0, il = tree.children.length; i < il; i++) {
			/** @type {SimpleTag} */
	
			var item = tree.children[i];
			item = (item.type == 'tag') 
				? processTag(item, profile, level) 
				: processSnippet(item, profile, level);
			
			item.start = item.start.replace(/\$/g, i + 1);
			process(item, profile, level + 1);
		}
		
		return tree;
	}
	
	zen_coding.registerFilter('html', process);
})();