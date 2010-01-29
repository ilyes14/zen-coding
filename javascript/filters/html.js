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
		
		if (item.isBlock() || profile.tag_nl === true || (item.parent && item.parent.hasBlockChildren()))
			item.start = zen_coding.repeatString(getIndentation(), level) + item.start;
			
		// formatting output
		if (profile.tag_nl !== false) {
			if (item.isBlock() || (profile.tag_nl === true && !is_empty))
				item.end += getNewline();
		}
		
		// substitute attributes
		item.start = zen_coding.replaceVariables(item.start, item.attributes);
		item.end = zen_coding.replaceVariables(item.end, item.attributes);
			
		if (item.source.getContent()) {
			item.content = padString(item.source.getContent(), 1);
		}
		
		return item;
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
			is_empty = (item.isUnary() && !item.children.length);
			

		if (profile.self_closing_tag == 'xhtml')
			self_closing = ' /';
		else if (profile.self_closing_tag === true)
			self_closing = '/';
			
		// define opening and closing tags
		var tag_name = (profile.tag_case == 'upper') ? item.name.toUpperCase() : item.name.toLowerCase();
		if (is_empty) {
			item.start = '<' + tag_name + attrs + self_closing + '>';
		} else {
			item.start = '<' + tag_name + attrs + '>';
			item.end = '</' + tag_name + '>';
		}
		
		// formatting output
		if (profile.tag_nl !== false) {
			if (item.isBlock() || (profile.tag_nl === true && !is_empty))
				item.end += getNewline();
			
			if (
				item.hasBlockChildren() ||
				(is_empty && item.nextSibling && item.nextSibling.isBlock()) ||
				profile.tag_nl === true && item.hasChildren()
			)
				item.start += getNewline();
				
			if (item.isBlock() || profile.tag_nl === true || (item.parent && item.parent.hasBlockChildren()))
				item.start = zen_coding.repeatString(getIndentation(), level) + item.start;
				
			// indent tree leaves
			if (profile.tag_nl === true && !item.hasChildren() && !is_empty) {
				item.start += getNewline() + zen_coding.repeatString(getIndentation(), level + 1);
				item.end = getNewline() + zen_coding.repeatString(getIndentation(), level) + item.end;
			} else if (profile.tag_nl === true && !is_empty) {
				item.end = zen_coding.repeatString(getIndentation(), level) + item.end;
			}
				
			if (!item.children.length && !is_empty)
				item.start += cursor;
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