/**
 * Filter that produces HTML tree
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 * 
 * @include "../zen_coding.js"
 */
(function(){
	function getNewline() {
		return zen_coding.getNewline();
	}
	
	function getIndentation() {
		return zen_coding.getVariable('indentation');
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
	 * Processes simplified tree, making it suitable for output as HTML structure
	 * @param {SimpleTag} tree
	 * @param {Object} profile
	 */
	function process(tree, profile, level) {
		level = level || 0;
		
		for (var i = 0, il = tree.children.length; i < il; i++) {
			/** @type {SimpleTag} */
			var item = tree.children[i];
			
			var attrs = makeAttributesString(item, profile), 
				content = '', 
				cursor = profile.place_cursor ? zen_coding.getCaretPlaceholder() : '',
				self_closing = '',
				
				is_empty = (item.source.isEmpty() && !item.children.length);
	
			if (profile.self_closing_tag == 'xhtml')
				self_closing = ' /';
			else if (profile.self_closing_tag === true)
				self_closing = '/';
				
			function allowNewline(tag) {
				return (profile.tag_nl === true || (profile.tag_nl == 'decide' && tag.isBlock()))
			}
				
			// define opening and closing tags
			if (item.name) {
				var tag_name = (profile.tag_case == 'upper') ? item.name.toUpperCase() : item.name.toLowerCase();
				if (is_empty) {
					item.start = '<' + tag_name + attrs + self_closing + '>';
				} else {
					item.start = '<' + tag_name + attrs + '>';
					item.end = '</' + tag_name + '>';
				}
			}
			
			// formatting output
			if (profile.tag_nl !== false) {
				if (item.name) {
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
						
					// indent tree leafs
					if (profile.tag_nl === true && !item.hasChildren() && !is_empty) {
						item.start += getNewline() + zen_coding.repeatString(getIndentation(), level + 1);
						item.end = getNewline() + zen_coding.repeatString(getIndentation(), level) + item.end;
					} else if (profile.tag_nl === true && !is_empty) {
						item.end = zen_coding.repeatString(getIndentation(), level) + item.end;
					}
						
					if (!item.children.length && !is_empty)
						item.start += cursor;
				}
			}
			
			item.start = item.start.replace(/\$/g, i + 1);
			process(item, profile, level + 1);
		}
		
		return tree;
	}
	
	zen_coding.registerFilter('html', process);
})();