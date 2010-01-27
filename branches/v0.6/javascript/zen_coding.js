/**
 * Core library that do all Zen Coding magic
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 * @include "settings.js"
 * @include "/EclipseMonkey/scripts/monkey-doc.js"
 */var zen_coding = (function(){
	
	var re_tag = /<\/?[\w:\-]+(?:\s+[\w\-:]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*\s*(\/?)>$/;
	
	var TYPE_ABBREVIATION = 'zen-tag',
		TYPE_EXPANDO = 'zen-expando',
	
		/** Reference to another abbreviation or tag */
		TYPE_REFERENCE = 'zen-reference',
		
		content_placeholder = '{%::zen-content::%}',
		caret_placeholder = '|',
		newline = '\n';
		
	var default_profile = {
		tag_case: 'lower',
		attr_case: 'lower',
		attr_quotes: 'double',
		
		// each tag on new line
		tag_nl: 'decide',
		
		place_cursor: true,
		
		// indent tags
		indent: true,
		
		// use self-closing style for writing empty elements, e.g. <br /> or <br>
		self_closing_tag: 'xhtml'
	};
	
	var profiles = {};
	
	/**
	 * Проверяет, является ли символ допустимым в аббревиатуре
	 * @param {String} ch
	 * @return {Boolean}
	 */
	function isAllowedChar(ch) {
		var char_code = ch.charCodeAt(0),
			special_chars = '#.>+*:$-_!@[]';
		
		return (char_code > 64 && char_code < 91)       // uppercase letter
				|| (char_code > 96 && char_code < 123)  // lowercase letter
				|| (char_code > 47 && char_code < 58)   // number
				|| special_chars.indexOf(ch) != -1;     // special character
	}
	
	/**
	 * Возвращает символ перевода строки, используемый в редакторе
	 * @return {String}
	 */
	function getNewline() {
		return zen_coding.getNewline();
	}
	
	/**
	 * Split text into lines. Set <code>remove_empty</code> to true to filter
	 * empty lines
	 * @param {String} text
	 * @param {Boolean} [remove_empty]
	 * @return {Array}
	 */
	function splitByLines(text, remove_empty) {
		
		// IE fails to split string by regexp, 
		// need to normalize newlines first
		// Also, Mozilla's Rhiho JS engine has a wierd newline bug
		var nl = getNewline();
		var lines = text
			.replace(/\r\n/g, '\n')
			.replace(/\n\r/g, '\n')
			.replace(/\n/g, nl)
			.split(nl);
		
//		var nl = getNewline(), 
//			lines = text.split(new RegExp('\\r?\\n|\\n\\r|\\r|' + nl));
			
		if (remove_empty) {
			for (var i = lines.length; i >= 0; i--) {
				if (!trim(lines[i]))
					lines.splice(i, 1);
			}
		}
		
		return lines;
	}
	
	/**
	 * Trim whitespace from string
	 * @param {String} text
	 * @return {String}
	 */
	function trim(text) {
		return (text || "").replace( /^\s+|\s+$/g, "" );
	}
	
	function createProfile(options) {
		var result = {};
		for (var p in default_profile)
			result[p] = (p in options) ? options[p] : default_profile[p];
		
		return result;
	}
	
	function setupProfile(name, options) {
		profiles[name.toLowerCase()] = createProfile(options || {});
	}
	
	/**
	 * Helper function that transforms string into hash
	 * @return {Object}
	 */
	function stringToHash(str){
		var obj = {}, items = str.split(",");
		for ( var i = 0; i < items.length; i++ )
			obj[ items[i] ] = true;
		return obj;
	}
	
	/**
	 * Indents text with padding
	 * @param {String} text Text to indent
	 * @param {String|Number} pad Padding size (number) or padding itself (string)
	 * @return {String}
	 */
	function padString(text, pad) {
		var pad_str = '', result = '';
		if (typeof(pad) == 'number')
			for (var i = 0; i < pad; i++) 
				pad_str += zen_settings.variables.indentation;
		else
			pad_str = pad;
		
		var lines = splitByLines(text),
			nl = getNewline();
			
		result += lines[0];
		for (var j = 1; j < lines.length; j++) 
			result += nl + pad_str + lines[j];
			
		return result;
	}
	
	/**
	 * Check if passed abbreviation is snippet
	 * @param {String} abbr
	 * @param {String} type
	 * @return {Boolean}
	 */
	function isShippet(abbr, type) {
		return getSnippet(type, abbr) ? true : false;
	}
	
	/**
	 * Test if passed string ends with XHTML tag. This method is used for testing
	 * '>' character: it belongs to tag or it's a part of abbreviation? 
	 * @param {String} str
	 * @return {Boolean}
	 */
	function isEndsWithTag(str) {
		return re_tag.test(str);
	}
	
	/**
	 * Returns specified elements collection (like 'empty', 'block_level') from
	 * <code>resource</code>. If collections wasn't found, returns empty object
	 * @param {Object} resource
	 * @param {String} type
	 * @return {Object}
	 */
	function getElementsCollection(resource, type) {
		if (resource && resource.element_types)
			return resource.element_types[type] || {}
		else
			return {};
	}
	
	/**
	 * Replace variables like ${var} in string
	 * @param {String} str
	 * @param {Object} [vars] Variable set (default is <code>zen_settings.variables</code>) 
	 * @return {String}
	 */
	function replaceVariables(str, vars) {
		vars = vars || zen_settings.variables;
		return str.replace(/\$\{([\w\-]+)\}/g, function(str, p1){
			return (p1 in vars) ? vars[p1] : str;
		});
	}
	
	/**
	 * Tag
	 * @class
	 * @param {String} name tag name
	 * @param {Number} count Output multiplier (default: 1)
	 * @param {String} type Tag type (html, xml)
	 */
	function Tag(name, count, type) {
		name = name.toLowerCase();
		type = type || 'html';
		
		var abbr = getAbbreviation(type, name);
		if (abbr && abbr.type == TYPE_REFERENCE)
			abbr = getAbbreviation(type, abbr.value);
		
		this.name = (abbr) ? abbr.value.name : name.replace('+', '');
		this.count = count || 1;
		this.children = [];
		this.attributes = [];
		this._attr_hash = {};
		this._abbr = abbr;
		this._res = zen_settings[type];
		this._content = '';
		this.repeat_by_lines = false;
		
		// add default attributes
		if (this._abbr && this._abbr.value.attributes) {
			var def_attrs = this._abbr.value.attributes;			if (def_attrs) {
				for (var i = 0; i < def_attrs.length; i++) {
					var attr = def_attrs[i];
					this.addAttribute(attr.name, attr.value);
				}
			}
		}
	}
	
	Tag.prototype = {
		/**
		 * Adds new child tag to current one
		 * @param {Tag} tag
		 */
		addChild: function(tag) {
			this.children.push(tag);
		},
		
		/**
		 * Adds new attribute
		 * @param {String} name Attribute's name
		 * @param {String} value Attribute's value
		 */
		addAttribute: function(name, value) {
			var a;
			if (name in this._attr_hash) {
				// attribute already exists, decide what to do
				a = this._attr_hash[name];
				if (name == 'class') {
					// 'class' is a magic attribute
					a.value += ((a.value) ? ' ' : '') + value;
				} else {
					a.value = value;
				}
			} else {
				a = {name: name, value: value};
				this._attr_hash[name] = a
				this.attributes.push(a);
			}
			
		},
		
		/**
		 * Test if current tag is empty
		 * @return {Boolean}
		 */
		isEmpty: function() {
			return (this._abbr && this._abbr.value.is_empty) || (this.name in getElementsCollection(this._res, 'empty'));
		},
		
		/**
		 * Test if current tag is inline-level (like &lt;strong&gt;, &lt;img&gt;)
		 * @return {Boolean}
		 */
		isInline: function() {
			return (this.name in getElementsCollection(this._res, 'inline_level'));
		},
		
		/**
		 * Проверяет, является ли текущий элемент блочным
		 * @return {Boolean}
		 */
		isBlock: function() {
			return (this.name in getElementsCollection(this._res, 'block_level'));
		},
		
		/**
		 * This function tests if current tags' content contains xHTML tags. 
		 * This function is mostly used for output formatting
		 */
		hasTagsInContent: function() {
			return this.getContent() && re_tag.test(this.getContent());
		},
		
		/**
		 * Test if current tag contains block-level children
		 * @return {Boolean}
		 */
		hasBlockChildren: function() {
			if (this.hasTagsInContent() && this.isBlock()) {
				return true;
			}
			
			for (var i = 0; i < this.children.length; i++) {
				if (this.children[i].isBlock())
					return true;
			}
			
			return false;
		},
		
		/**
		 * Set textual content for tag
		 * @param {String} str Tag's content
		 */
		setContent: function(str) {
			this._content = str;
		},
		
		/**
		 * Returns tag's textual content
		 * @return {String}
		 */
		getContent: function() {
			return this._content;
		},
		
		/**
		 * Search for deepest and latest child of current element
		 * @return {Tag|null} Returns null if there's no children
		 */
		findDeepestChild: function() {
			if (!this.children.length)
				return null;
				
			var deepest_child = this;
			while (true) {
				deepest_child = deepest_child.children[ deepest_child.children.length - 1 ];
				if (!deepest_child.children.length)
					break;
			}
			
			return deepest_child;
		},
		
		/**
		 * Transforms and formats tag into string using profile
		 * @param {String} profile Profile name
		 * @return {String}
		 * TODO Function is too large, need refactoring
		 */
		toString: function(profile_name) {
			
			var result = [], 
				profile = (profile_name in profiles) ? profiles[profile_name] : profiles['plain'],
				attrs = '', 
				content = '', 
				start_tag = '', 
				end_tag = '',
				cursor = profile.place_cursor ? '|' : '',
				self_closing = '',
				attr_quote = profile.attr_quotes == 'single' ? "'" : '"',
				attr_name,
				
				is_empty = (this.isEmpty() && !this.children.length);

			if (profile.self_closing_tag == 'xhtml')
				self_closing = ' /';
			else if (profile.self_closing_tag === true)
				self_closing = '/';
				
			function allowNewline(tag) {
				return (profile.tag_nl === true || (profile.tag_nl == 'decide' && tag.isBlock()))
			}
				
			// make attribute string
			for (var i = 0; i < this.attributes.length; i++) {
				var a = this.attributes[i];
				attr_name = (profile.attr_case == 'upper') ? a.name.toUpperCase() : a.name.toLowerCase();
				attrs += ' ' + attr_name + '=' + attr_quote + (a.value || cursor) + attr_quote;
			}
			
			var deepest_child = this.findDeepestChild();
			
			// output children
			if (!is_empty) {
				if (deepest_child && this.repeat_by_lines)
					deepest_child.setContent(content_placeholder);
				
				for (var j = 0; j < this.children.length; j++) {
//					
					content += this.children[j].toString(profile_name);
					if (
						(j != this.children.length - 1) &&
						( allowNewline(this.children[j]) || allowNewline(this.children[j + 1]) )
					)
						content += getNewline();
				}
			}
			
			// define opening and closing tags
			if (this.name) {
				var tag_name = (profile.tag_case == 'upper') ? this.name.toUpperCase() : this.name.toLowerCase();
				if (is_empty) {
					start_tag = '<' + tag_name + attrs + self_closing + '>';
				} else {
					start_tag = '<' + tag_name + attrs + '>';
					end_tag = '</' + tag_name + '>';
				}
			}
			
			// formatting output
			if (profile.tag_nl !== false) {
				if (
					this.name && 
					(
						profile.tag_nl === true || 
						this.hasBlockChildren() 
					)
				) {
					if (end_tag) { // non-empty tag: add indentation
						start_tag += getNewline() + zen_settings.variables.indentation;
						end_tag = getNewline() + end_tag;
					} else { // empty tag
						
					}
						
				}
				
				if (this.name) {
					if (content)
						content = padString(content, profile.indent ? 1 : 0);
					else if (!is_empty)
						start_tag += cursor;
				}
					
			}
			
			// repeat tag by lines count
			var cur_content = '';
			if (this.repeat_by_lines) {
				var lines = splitByLines( trim(this.getContent()) , true);
				for (var j = 0; j < lines.length; j++) {
					cur_content = deepest_child ? '' : content_placeholder;
					if (content && !deepest_child)
						cur_content += getNewline();
						
					var elem_str = start_tag.replace(/\$/g, j + 1) + cur_content + content + end_tag;
					result.push(elem_str.replace(content_placeholder, trim(lines[j])));
				}
			}
			
			// repeat tag output
			if (!result.length) {
				if (this.getContent()) {
					var pad = (profile.tag_nl === true || (this.hasTagsInContent() && this.isBlock())) ? 1 : 0;
					content = padString(this.getContent(), pad) + content;
				}
				
				for (var i = 0; i < this.count; i++) 
					result.push(start_tag.replace(/\$/g, i + 1) + content + end_tag);
			}
			
			var glue = '';
			if (allowNewline(this))
				glue = getNewline();
				
			return result.join(glue);
		}
	};
	
	// TODO inherit from Tag
	function Snippet(name, count, type) {
		/** @type {String} */
		this.name = name;
		this.count = count || 1;
		this.children = [];
		this._content = '';
		this.repeat_by_lines = false;
		this.attributes = {'id': '|', 'class': '|'};
		this.value = getSnippet(type, name);
	}
	
	Snippet.prototype = {
		/**
		 * Adds new child
		 * @param {Tag} tag
		 */
		addChild: function(tag) {
			this.children.push(tag);
		},
		
		addAttribute: function(name, value){
			this.attributes[name] = value;
		},
		
		isBlock: function() {
			return true; 
		},
		
		/**
		 * Set textual content for snippet
		 * @param {String} str Tag's content
		 */
		setContent: function(str) {
			this._content = str;
		},
		
		/**
		 * Returns snippet's textual content
		 * @return {String}
		 */
		getContent: function() {
			return this._content;
		},
		
		/**
		 * Search for deepest and latest child of current element
		 * @return {Tag|null} Returns null if there's no children
		 */
		findDeepestChild: function() {
			if (!this.children.length)
				return null;
				
			var deepest_child = this;
			while (true) {
				deepest_child = deepest_child.children[ deepest_child.children.length - 1 ];
				if (!deepest_child.children.length)
					break;
			}
			
			return deepest_child;
		},
		
		toString: function(profile_name) {
			var content = '', 
				profile = (profile_name in profiles) ? profiles[profile_name] : profiles['plain'],
				result = [],
				data = this.value,
				begin = '',
				end = '',
				child_padding = '',
				child_token = '${child}';
			
			if (data) {
				if (profile.tag_nl !== false) {
					var nl = getNewline();
					data = data.replace(/\n/g, nl);
					// figuring out indentation for children
					var lines = data.split(nl), m;
					for (var j = 0; j < lines.length; j++) {
						if (lines[j].indexOf(child_token) != -1) {
							child_padding =  (m = lines[j].match(/(^\s+)/)) ? m[1] : '';
							break;
						}
					}
				}
				
				var parts = data.split(child_token);
				begin = parts[0] || '';
				end = parts[1] || '';
			}
			
			for (var i = 0; i < this.children.length; i++) {
				content += this.children[i].toString(profile_name);
				if (
					i != this.children.length - 1 &&
					(
						profile.tag_nl === true || 
						(profile.tag_nl == 'decide' && this.children[i].isBlock())
					)
				)
					content += getNewline();
			}
			
			if (child_padding)
				content = padString(content, child_padding);
			
			
			// substitute attributes
			begin = replaceVariables(begin, this.attributes);
			end = replaceVariables(end, this.attributes);
				
			if (this.getContent()) {
				content = padString(this.getContent(), 1) + content;
			}
			
			// output tag
			for (var i = 0; i < this.count; i++) 
				result.push(begin + content + end);
//				result.push(begin.replace(/\$(?!\{)/g, i + 1) + content + end);
			
			return result.join((profile.tag_nl !== false) ? getNewline() : '');
		}
	}
	
	/**
	 * Returns abbreviation value from data set
	 * @param {String} type Resource type (html, css, ...)
	 * @param {String} abbr Abbreviation name
	 * @return {Object|null}
	 */
	function getAbbreviation(type, abbr) {
		return getSettingsResource(type, abbr, 'abbreviations');
	}
	
	/**
	 * Returns snippet value from data set
	 * @param {String} type Resource type (html, css, ...)
	 * @param {String} snippet_name Snippet name
	 * @return {Object|null}
	 */
	function getSnippet(type, snippet_name) {
		return getSettingsResource(type, snippet_name, 'snippets');
	}
	
	/**
	 * Returns resurce value from data set with respect of inheritance
	 * @param {String} type Resource type (html, css, ...)
	 * @param {String} abbr Abbreviation name
	 * @param {String} res_name Resource name ('snippets' or 'abbreviation')
	 * @return {Object|null}
	 */
	function getSettingsResource(type, abbr, res_name) {
		var resource = zen_settings[type];
		
		if (resource) {
			if (res_name in resource && abbr in resource[res_name])
				return resource[res_name][abbr];
			else if ('extends' in resource) {
				// find abbreviation in ancestors
				for (var i = 0; i < resource['extends'].length; i++) {
					var type = resource['extends'][i];
					if (
						zen_settings[type] && 
						zen_settings[type][res_name] && 
						zen_settings[type][res_name][abbr]
					)
						return zen_settings[type][res_name][abbr];
				}
			}
		}
		
		
		return null;
	}
	
	/**
	 * Get word, starting at <code>ix</code> character of <code>str</code>
	 */
	function getWord(ix, str) {
		var m = str.substring(ix).match(/^[\w\-:\$]+/);
		return m ? m[0] : '';
	}
	
	/**
	 * Extract attributes and their values from attribute set 
	 * @param {String} attr_set
	 */
	function extractAttributes(attr_set) {
		attr_set = trim(attr_set);
		var loop_count = 100, // endless loop protection
			re_string = /^(["'])((?:(?!\1)[^\\]|\\.)*)\1/,
			result = [],
			attr;
			
		while (attr_set && loop_count--) {
			var attr_name = getWord(0, attr_set);
			attr = null;
			if (attr_name) {
				attr = {name: attr_name, value: ''};
//				result[attr_name] = '';
				// let's see if attribute has value
				var ch = attr_set.charAt(attr_name.length);
				switch (ch) {
					case '=':
						var ch2 = attr_set.charAt(attr_name.length + 1);
						if (ch2 == '"' || ch2 == "'") {
							// we have a quoted string
							var m = attr_set.substring(attr_name.length + 1).match(re_string);
							if (m) {
								attr.value = m[2];
								attr_set = trim(attr_set.substring(attr_name.length + m[0].length + 1));
							} else {
								// something wrong, break loop
								attr_set = '';
							}
						} else {
							// unquoted string
							var m = attr_set.substring(attr_name.length + 1).match(/(.+?)(\s|$)/);
							if (m) {
								attr.value = m[1];
								attr_set = trim(attr_set.substring(attr_name.length + m[1].length + 1));
							} else {
								// something wrong, break loop
								attr_set = '';
							}
						}
						break;
					default:
						attr_set = trim(attr_set.substring(attr_name.length));
						break;
				}
			} else {
				// something wrong, can't extract attribute name
				break;
			}
			
			if (attr) result.push(attr);
		}
		return result;
	}
	
	/**
	 * Parses tag attributes extracted from abbreviation
	 * @param {String} str
	 */
	function parseAttributes(str) {
		/*
		 * Example of incoming data:
		 * #header
		 * .some.data
		 * .some.data#header
		 * [attr]
		 * #item[attr=Hello other="World"].class
		 */
		var result = [],
			class_name,
			char_map = {'#': 'id', '.': 'class'};
		
		// walk char-by-char
		var i = 0,
			il = str.length,
			val;
			
		while (i < il) {
			var ch = str.charAt(i);
			switch (ch) {
				case '#': // id
					val = getWord(i, str.substring(1));
					result.push({name: char_map[ch], value: val});
					i += val.length + 1;
					break;
				case '.': // class
					val = getWord(i, str.substring(1));
					if (!class_name) {
						// remember object pointer for value modification
						class_name = {name: char_map[ch], value: ''};
						result.push(class_name);
					}
					
					class_name.value += ((class_name.value) ? ' ' : '') + val;
					i += val.length + 1;
					break;
				case '[': //begin attribute set
					// search for end of set
					var end_ix = str.indexOf(']', i);
					if (end_ix == -1) {
						// invalid attribute set, stop searching
						i = str.length;
					} else {
						var attrs = extractAttributes(str.substring(i + 1, end_ix));
						for (var j = 0, jl = attrs.length; j < jl; j++) {
							result.push(attrs[j]);
						}
						i = end_ix;
					}
					break;
				default:
					i++;
				
			}
		}
		
		return result;
	}
	
	/**
	 * Creates group element
	 * @param {String} expr Part of abbreviation that belongs to group item
	 * @param {abbrGroup} [parent] Parent group item element
	 */
	function abbrGroup(parent) {
		return {
			expr: '',
			parent: parent || null,
			children: [],
			addChild: function() {
				var child = abbrGroup(this);
				this.children.push(child);
				return child;
			},
			cleanUp: function() {
				for (var i = this.children.length - 1; i >= 0; i--) {
					var expr = this.children[i].expr;
					if (!expr)
						this.children.splice(i, 1);
					else {
						// remove operators at the and of expression
//						this.children[i].expr = expr.replace(/[\+>]+$/, '');
						this.children[i].cleanUp();
					}
				}
			}
		}
	}
	
	/**
	 * Split abbreviation by groups
	 * @param {String} abbr
	 * @return {abbrGroup()}
	 */
	function splitByGroups(abbr) {
		var root = abbrGroup(),
			last_parent = root,
			cur_item = root.addChild(),
			stack = [],
			i = 0,
			il = abbr.length;
		
		while (i < il) {
			var ch = abbr.charAt(i);
			switch(ch) {
				case '(':
					// found new group
					var operator = i ? abbr.charAt(i - 1) : '';
					if (operator == '>') {
						stack.push(cur_item);
						last_parent = cur_item;
						cur_item = null;
					} else {
						stack.push(last_parent);
						cur_item = null;
					}
					break;
				case ')':
					last_parent = stack.pop();
					cur_item = null;
					var next_char = (i < il - 1) ? abbr.charAt(i + 1) : '';
					if (next_char == '+' || next_char == '>') 
						// next char is group operator, skip it
						i++;
					break;
				default:
					if (ch == '+' || ch == '>') {
						// skip operator if it's followed by parenthesis
						var next_char = (i + 1 < il) ? abbr.charAt(i + 1) : '';
						if (next_char == '(') break;
					}
					if (!cur_item)
						cur_item = last_parent.addChild();
					cur_item.expr += ch;
			}
			
			i++;
		}
		
		root.cleanUp();
		return root;
	}
	
	// create default profiles
	setupProfile('xhtml');
	setupProfile('html', {self_closing_tag: false});
	setupProfile('xml', {self_closing_tag: true, tag_nl: true});
	setupProfile('plain', {tag_nl: false, indent: false, place_cursor: false});
	
	
	return {
		expandAbbreviation: function(abbr, type, profile) {
			type = type || 'html';
			var is_invalid = false,
				context = this;
			
			/**
			 * @param {abbrGroup} group
			 * @param {Tag} parent
			 */
			function expandGroup(group, parent) {
				var tree = context.parseIntoTree(group.expr, type),
					/** @type {Tag} */
					last_item = null;
					
				if (tree) {
					for (var i = 0, il = tree.children.length; i < il; i++) {
						last_item = tree.children[i];
						parent.addChild(last_item);
					}
				} else {
					is_invalid = true;
					return;
				}
				
				if (group.children.length) {
					var add_point = last_item.findDeepestChild() || last_item;
					for (var j = 0, jl = group.children.length; j < jl; j++) {
						expandGroup(group.children[j], add_point);
					}
				}
			}
			
			// first, split abbreviation by groups
			var group_root = splitByGroups(abbr),
				tree_root = new Tag('', 1, type);
			
			// the recursively expand each group item
			for (var i = 0, il = group_root.children.length; i < il; i++) {
				expandGroup(group_root.children[i], tree_root);
			}
			
			return !is_invalid ? replaceVariables(tree_root.toString(profile)) : '';
		},
		
		/**
		 * Extracts abbreviations from text stream, starting from the end
		 * @param {String} str
		 * @return {String} Abbreviation or empty string
		 */
		extractAbbreviation: function(str) {
			var cur_offset = str.length,
				start_index = -1;
			
			while (true) {
				cur_offset--;
				if (cur_offset < 0) {
					// дошли до начала строки
					start_index = 0;
					break;
				}
				
				var ch = str.charAt(cur_offset);
				
				if (!isAllowedChar(ch) || (ch == '>' && isEndsWithTag(str.substring(0, cur_offset + 1)))) {
					start_index = cur_offset + 1;
					break;
				}
			}
			
			if (start_index != -1) 
				// found somethind, return abbreviation
				return str.substring(start_index);
			else
				return '';
		},
		
		/**
		 * Parses abbreviation into a node set
		 * @param {String} abbr Abbreviation
		 * @param {String} type Document type (xsl, html, etc.)
		 * @return {Tag}
		 */
		parseIntoTree: function(abbr, type) {
			type = type || 'html';
			var root = new Tag('', 1, type),
				parent = root,
				last = null,
				multiply_elem = null,
				res = zen_settings[type],
				re = /([\+>])?([a-z@\!][a-z0-9:\-]*)((?:(?:[#\.][\w\-\$]+)|(?:\[[^\]]+\]))+)?(\*(\d*))?(\+$)?/ig;
//				re = /([\+>])?([a-z@\!][a-z0-9:\-]*)(#[\w\-\$]+)?((?:\.[\w\-\$]+)*)(\*(\d*))?(\+$)?/ig;
			
			if (!abbr)
				return null;
			
			// replace expandos
			abbr = abbr.replace(/([a-z][\w\:\-]*)\+$/i, function(str){
				var a = getAbbreviation(type, str);
				return a ? a.value : str;
			});
			
			abbr = abbr.replace(re, function(str, operator, tag_name, attrs, has_multiplier, multiplier, has_expando){
				var multiply_by_lines = (has_multiplier && !multiplier);
				multiplier = multiplier ? parseInt(multiplier) : 1;
				
				if (has_expando)
					tag_name += '+';
				
				var current = isShippet(tag_name, type) ? new Snippet(tag_name, multiplier, type) : new Tag(tag_name, multiplier, type);
				if (attrs) {
					attrs = parseAttributes(attrs);
					for (var i = 0, il = attrs.length; i < il; i++) {
						current.addAttribute(attrs[i].name, attrs[i].value);
					}
				}
				
				// dive into tree
				if (operator == '>' && last)
					parent = last;
					
				parent.addChild(current);
				
				last = current;
				
				if (multiply_by_lines)
					multiply_elem = current;
				
				return '';
			});
			
			root.last = last;
			root.multiply_elem = multiply_elem;
			
			// empty 'abbr' string means that abbreviation was successfully expanded,
			// if not — abbreviation wasn't valid 
			return (!abbr) ? root : null;
		},
		
		/**
		 * Indents text with padding
		 * @param {String} text Text to indent
		 * @param {String|Number} pad Padding size (number) or padding itself (string)
		 * @return {String}
		 */
		padString: padString,
		setupProfile: setupProfile,
		getNewline: function(){
			return newline;
		},
		
		setNewline: function(str) {
			newline = str;
		},
		
		/**
		 * Wraps passed text with abbreviation. Text will be placed inside last
		 * expanded element
		 * @param {String} abbr Abbreviation
		 * @param {String} text Text to wrap
		 * @param {String} [type] Document type (html, xml, etc.). Default is 'html'
		 * @param {String} [profile] Output profile's name. Default is 'plain'
		 * @return {String}
		 */
		wrapWithAbbreviation: function(abbr, text, type, profile) {
			var tree = this.parseIntoTree(abbr, type || 'html');
			if (tree) {
				var repeat_elem = tree.multiply_elem || tree.last;
				repeat_elem.setContent(text);
				repeat_elem.repeat_by_lines = !!tree.multiply_elem;
				return tree.toString(profile);
			} else {
				return null;
			}
		},
		
		splitByLines: splitByLines,
		
		/**
		 * Check if cursor is placed inside xHTML tag
		 * @param {String} html Contents of the document
		 * @param {Number} cursor_pos Current caret position inside tag
		 * @return {Boolean}
		 */
		isInsideTag: function(html, cursor_pos) {
			var re_tag = /^<\/?\w[\w\:\-]*.*?>/;
			
			// search left to find opening brace
			var pos = cursor_pos;
			while (pos > -1) {
				if (html.charAt(pos) == '<') 
					break;
				pos--;
			}
			
			if (pos != -1) {
				var m = re_tag.exec(html.substring(pos));
				if (m && cursor_pos > pos && cursor_pos < pos + m[0].length)
					return true;
			}
			
			return false;
		},
		
		/**
		 * Returns caret placeholder
		 * @return {String}
		 */
		getCaretPlaceholder: function() {
			return caret_placeholder;
		},
		
		/**
		 * Set caret placeholder: a string (like '|') or function.
		 * You may use a function as a placeholder generator. For example,
		 * TextMate uses ${0}, ${1}, ..., ${n} natively for quick Tab-switching
		 * between them.
		 * @param {String|Function}
		 */
		setCaretPlaceholder: function(value) {
			caret_placeholder = value;
		},
		
		settings_parser: (function(){
			/**
			 * Unified object for parsed data
			 */
			function entry(type, key, value) {
				return {
					type: type,
					key: key,
					value: value
				};
			}
			
			/** Regular expression for XML tag matching */
			var re_tag = /^<(\w+\:?[\w\-]*)((?:\s+[\w\:\-]+\s*=\s*(['"]).*?\3)*)\s*(\/?)>/,
				re_attrs = /([\w\-]+)\s*=\s*(['"])(.*?)\2/g;
			
			/**
			 * Make expando from string
			 * @param {String} key
			 * @param {String} value
			 * @return {Object}
			 */
			function makeExpando(key, value) {
				return entry(TYPE_EXPANDO, key, value);
			}
			
			/**
			 * Make abbreviation from string
			 * @param {String} key Abbreviation key
			 * @param {String} tag_name Expanded element's tag name
			 * @param {String} attrs Expanded element's attributes
			 * @param {Boolean} is_empty Is expanded element empty or not
			 * @return {Object}
			 */
			function makeAbbreviation(key, tag_name, attrs, is_empty) {
				var result = {
					name: tag_name,
					is_empty: Boolean(is_empty)
				};
				
				if (attrs) {
					var m;
					result.attributes = [];
					while (m = re_attrs.exec(attrs)) {
						result.attributes.push({
							name: m[1],
							value: m[3]
						});
					}
				}
				
				return entry(TYPE_ABBREVIATION, key, result);
			}
			
			/**
			 * Parses all abbreviations inside object
			 * @param {Object} obj
			 */
			function parseAbbreviations(obj) {
				for (var key in obj) {
					var value = obj[key], m;
					
					key = trim(key);
					if (key.substr(-1) == '+') {
						// this is expando, leave 'value' as is
						obj[key] = makeExpando(key, value);
					} else if (m = re_tag.exec(value)) {
						obj[key] = makeAbbreviation(key, m[1], m[2], m[4] == '/');
					} else {
						// assume it's reference to another abbreviation
						obj[key] = entry(TYPE_REFERENCE, key, value);
					}
					
				}
			}
			
			return {
				/**
				 * Parse user's settings
				 * @param {Object} settings
				 */
				parse: function(settings) {
					for (var p in settings) {
						if (p == 'abbreviations')
							parseAbbreviations(settings[p]);
						else if (p == 'extends') {
							var ar = settings[p].split(',');
							for (var i = 0; i < ar.length; i++) 
								ar[i] = trim(ar[i]);
							settings[p] = ar;
						}
						else if (typeof(settings[p]) == 'object')
							arguments.callee(settings[p]);
					}
				},
				
				extend: function(parent, child) {
					for (var p in child) {
						if (typeof(child[p]) == 'object' && parent.hasOwnProperty(p))
							arguments.callee(parent[p], child[p]);
						else
							parent[p] = child[p];
					}
				},
				
				/**
				 * Create hash maps on certain string properties
				 * @param {Object} obj
				 */
				createMaps: function(obj) {
					for (var p in obj) {
						if (p == 'element_types') {
							for (var k in obj[p]) 
								obj[p][k] = stringToHash(obj[p][k]);
						} else if (typeof(obj[p]) == 'object') {
							arguments.callee(obj[p]);
						}
					}
				},
				
				TYPE_ABBREVIATION: TYPE_ABBREVIATION,
				TYPE_EXPANDO: TYPE_EXPANDO,
				
				/** Reference to another abbreviation or tag */
				TYPE_REFERENCE: TYPE_REFERENCE
			}
		})()
	}
	
})();

if ('zen_settings' in this || zen_settings) {
	// first we need to expand some strings into hashes
	zen_coding.settings_parser.createMaps(zen_settings);
	if ('my_zen_settings' in this) {
		// we need to extend default settings with user's
		zen_coding.settings_parser.createMaps(my_zen_settings);
		zen_coding.settings_parser.extend(zen_settings, my_zen_settings);
	}
	
	// now we need to parse final set of settings
	zen_coding.settings_parser.parse(zen_settings);
}