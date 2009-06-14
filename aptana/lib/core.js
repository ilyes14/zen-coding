/**
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 * @include "settings.js"
 * @include "/EclipseMonkey/scripts/monkey-doc.js"
 */var zen_coding = (function(){
	
	var re_tag = /<\/?[\w:\-]+(?:\s+[\w\-:]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*\s*(\/?)>$/;
	
	var TYPE_ABBREVIATION = 'zen-tag',
		TYPE_EXPANDO = 'zen-expando',
	
		/** Reference to another abbreviation or tag */
		TYPE_REFERENCE = 'zen-reference';
		
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
			special_chars = '#.>+*:$-_!@';
		
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
//		return editors.activeEditor.lineDelimiter;
		return '\n';
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
	 * Отбивает текст отступами
	 * @param {String} text Текст, который нужно отбить
	 * @param {String|Number} pad Количество отступов или сам отступ
	 * @return {String}
	 */
	function padString(text, pad) {
		var pad_str = '', result = '';
		if (typeof(pad) == 'number')
			for (var i = 0; i < pad; i++) 
				pad_str += zen_settings.variables.indentation;
		else
			pad_str = pad;
		
		// бьем текст на строки и отбиваем все, кроме первой, строки
		var nl = getNewline(), 
			lines = text.split(new RegExp('\\r?\\n|' + nl));
			
		result += lines[0];
		for (var j = 1; j < lines.length; j++) 
			result += nl + pad_str + lines[j];
			
		return result;
	}
	
	/**
	 * Get the type of the partition based on the current offset	 * @param {Number} offset	 * @return {String}	 */	function getPartition(offset){		var class_name = String(editors.activeEditor.textEditor.getClass());		if (class_name == 'class org.eclipse.wst.xsl.ui.internal.editor.XSLEditor')			return 'text/xsl';					try {				var fileContext = editors.activeEditor.textEditor.getFileContext();				if (fileContext !== null && fileContext !== undefined) {				var partition = fileContext.getPartitionAtOffset(offset);				return String(partition.getType());			}		} catch(e) {					}			return null;	}
	
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
	 * Проверяет, закачивается ли строка полноценным тэгом. В основном 
	 * используется для проверки принадлежности символа '>' аббревиатуре 
	 * или тэгу
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
		if (resource.element_types)
			return resource.element_types[type] || {}
		else
			return {};
	}
	
	/**
	 * Replace variables like ${var} in string
	 * @param {String} str
	 * @return {String}
	 */
	function replaceVariables(str) {
		var re_variable = /\$\{([\w\-]+)\}/g;
		return str.replace(/\$\{([\w\-]+)\}/g, function(str, p1){
			return (p1 in zen_settings.variables) ? zen_settings.variables[p1] : str;
		});
	}
	
	/**
	 * Тэг
	 * @class
	 * @param {String} name Имя тэга
	 * @param {Number} count Сколько раз вывести тэг (по умолчанию: 1)
	 * @param {String} type Тип тэга (html, xml)
	 */
	function Tag(name, count, type) {
		name = name.toLowerCase();
		type = type || 'html';
		
		var abbr = getAbbreviation(type, name);
		if (abbr && abbr.type == TYPE_REFERENCE)
			abbr = getAbbreviation(type, abbr.value);
		
		this.name = (abbr) ? abbr.value.name : name;
		this.count = count || 1;
		this.children = [];
		this.attributes = [];
		this._abbr = abbr;
		this._res = zen_settings[type];
		
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
		 * Добавляет нового потомка
		 * @param {Tag} tag
		 */
		addChild: function(tag) {
			this.children.push(tag);
		},
		
		/**
		 * Добавляет атрибут
		 * @param {String} name Название атрибута
		 * @param {String} value Значение атрибута
		 */
		addAttribute: function(name, value) {
			this.attributes.push({name: name, value: value});
		},
		
		/**
		 * Проверяет, является ли текущий элемент пустым
		 * @return {Boolean}
		 */
		isEmpty: function() {
			return (this._abbr && this._abbr.value.is_empty) || (this.name in getElementsCollection(this._res, 'empty'));
		},
		
		/**
		 * Проверяет, является ли текущий элемент строчным
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
		 * Проверяет, есть ли блочные потомки у текущего тэга. 
		 * Используется для форматирования
		 * @return {Boolean}
		 */
		hasBlockChildren: function() {
			for (var i = 0; i < this.children.length; i++) {
				if (this.children[i].isBlock())
					return true;
			}
			
			return false;
		},
		
		/**
		 * Transforms tag into string using profile
		 * @param {String} profile Profile name
		 * @return {String}
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
				a,
				attr_name;

			if (profile.self_closing_tag == 'xhtml')
				self_closing = ' /';
			else if (profile.self_closing_tag === true)
				self_closing = '/';
				
			// делаем строку атрибутов
			for (var i = 0; i < this.attributes.length; i++) {
				a = this.attributes[i];
				attr_name = (profile.attr_case == 'upper') ? a.name.toUpperCase() : a.name.toLowerCase();
				attrs += ' ' + attr_name + '="' + (a.value || cursor) + '"';
			}
			
			// выводим потомков
			if (!this.isEmpty())
				for (var j = 0; j < this.children.length; j++) {
					content += this.children[j].toString(profile_name);
					if (
						(j != this.children.length - 1) &&
						(profile.tag_nl === true || (profile.tag_nl == 'decide' && this.children[j].isBlock()))
					)
						content += getNewline();
				}
			
			if (this.name) {
				var tag_name = (profile.tag_case == 'upper') ? this.name.toUpperCase() : this.name.toLowerCase();
				if (this.isEmpty()) {
					start_tag = '<' + tag_name + attrs + self_closing + '>';
				} else {
					start_tag = '<' + tag_name + attrs + '>';
					end_tag = '</' + tag_name + '>';
				}
			}
			
			// форматируем вывод
			if (profile.tag_nl !== false) {
				if (
					this.name && 
					(
						profile.tag_nl === true || 
						(profile.tag_nl == 'decide' && this.hasBlockChildren()) 
					)
				) {
					start_tag += getNewline() + zen_settings.variables.indentation;
					end_tag = getNewline() + end_tag;
				}
				
				if (this.name) {
					if (content)
						content = padString(content, profile.indent ? 1 : 0);
					else
						start_tag += cursor;
				}
					
			}
					
			// выводим тэг нужное количество раз
			for (var i = 0; i < this.count; i++) 
				result.push(start_tag.replace(/\$/g, i + 1) + content + end_tag);
			
			var glue = '';
			if (profile.tag_nl === true || (profile.tag_nl == 'decide' && this.isBlock()))
				glue = getNewline();
				
			return result.join(glue);
		}
	};
	
	function Snippet(name, count, type) {
		/** @type {String} */
		this.name = name;
		this.count = count || 1;
		this.children = [];
		this.value = getSnippet(type, name);
	}
	
	Snippet.prototype = {
		/**
		 * Добавляет нового потомка
		 * @param {Tag} tag
		 */
		addChild: function(tag) {
			this.children.push(tag);
		},
		
		addAttribute: function(){
		},
		
		isBlock: function() {
			return true; 
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
					// нужно узнать, какой отступ должен быть у потомков
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
			
			
			// выводим тэг нужное количество раз
			for (var i = 0; i < this.count; i++) 
				result.push(begin.replace(/\$(?!\{)/g, i + 1) + content + end);
			
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
		
		if (resource[res_name] && abbr in resource[res_name])
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
		
		return null;
	}
	
	// create default profiles
	setupProfile('xhtml');
	setupProfile('html', {self_closing_tag: false});
	setupProfile('xml', {self_closing_tag: true, tag_nl: true});
	setupProfile('plain', {tag_nl: false, indent: false, place_cursor: false});
	
	
	return {
		/**
		 * Ищет аббревиатуру в текущем редакторе и возвращает ее
		 * @return {String|null}
		 * TODO move to Eclipse specific file
		 */
		findAbbreviation: function() {
			/** Текущий редактор */
			var editor = editors.activeEditor;
			
			if (editor.selectionRange.startingOffset != editor.selectionRange.endingOffset) {
				// пользователь сам выделил нужную аббревиатуру
				return editor.source.substring(editor.selectionRange.startingOffset, editor.selectionRange.endingOffset);
			}
			
			// будем искать аббревиатуру с текущей позиции каретки
			var original_offset = editor.currentOffset,
				cur_line = editor.getLineAtOffset(original_offset),
				line_offset = editor.getOffsetAtLine(cur_line);
			
			return this.extractAbbreviation(editor.source.substring(line_offset, original_offset));
		},
		
		expandAbbreviation: function(abbr, type, profile) {
			var tree = this.parseIntoTree(abbr, type || 'html');
			return replaceVariables(tree ? tree.toString(profile) : '');
		},
		
		/**
		 * Извлекает аббревиатуру из строки
		 * @param {String} str
		 * @return {String} Аббревиатура или пустая строка
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
				// что-то нашли, возвращаем аббревиатуру
				return str.substring(start_index);
			else
				return '';
		},
		
		/**
		 * Преобразует аббревиатуру в дерево элементов
		 * @param {String} abbr Аббревиатура
		 * @param {String} type Тип документа (xsl, html)
		 * @return {Tag}
		 */
		parseIntoTree: function(abbr, type) {
			type = type || 'html';
			var root = new Tag('', 1, type),
				parent = root,
				last = null,
				res = zen_settings[type],
				re = /([\+>])?([a-z][a-z0-9:\!\-]*)(#[\w\-\$]+)?((?:\.[\w\-\$]+)*)(?:\*(\d+))?/ig;
			
			if (!abbr)
				return null;
			
			// replace expandos
			abbr = abbr.replace(/([a-z][\w\:\-]*)\+$/i, function(str){
				var a = getAbbreviation(type, str);
				return a ? a.value : str;
			});
			
			abbr = abbr.replace(re, function(str, operator, tag_name, id, class_name, multiplier){
				multiplier = multiplier ? parseInt(multiplier) : 1;
				
				var current = isShippet(tag_name, type) ? new Snippet(tag_name, multiplier, type) : new Tag(tag_name, multiplier, type);
				if (id)
					current.addAttribute('id', id.substr(1));
				
				if (class_name) 
					current.addAttribute('class', class_name.substr(1).replace(/\./g, ' '));
				
				
				// dive into tree
				if (operator == '>' && last)
					parent = last;
					
				parent.addChild(current);
				
				last = current;
				return '';
			});
			
			// empty 'abbr' string means that abbreviation was successfully expanded,
			// if not—abbreviation wasn't valid 
			return (!abbr) ? root : null;
		},
		
		/**
		 * Отбивает текст отступами
		 * @param {String} text Текст, который нужно отбить
		 * @param {String|Number} pad Количество отступов или сам отступ
		 * @return {String}
		 */
		padString: padString,
		getNewline: getNewline,
		
		/**
		 * Ищет новую точку вставки каретки		 * @param {Number} Инкремент поиска: -1 — ищем влево, 1 — ищем вправо		 * @param {Number} Начальное смещение относительно текущей позиции курсора		 * @return {Number} Вернет -1, если не была найдена новая позиция		 */		findNewEditPoint: function(inc, offset) {			inc = inc || 1;
			offset = offset || 0;			var editor = editors.activeEditor,				cur_point = editor.currentOffset + offset,				max_len = editor.sourceLength,				next_point = -1;						function ch(ix) {				return editor.source.charAt(ix);			}							while (cur_point < max_len && cur_point > 0) {				cur_point += inc;				var cur_char = ch(cur_point),					next_char = ch(cur_point + 1),					prev_char = ch(cur_point - 1);									switch (cur_char) {					case '"':					case '\'':						if (next_char == cur_char && prev_char == '=') {							// пустой атрибут							next_point = cur_point + 1;						}						break;					case '>':						if (next_char == '<') {							// между тэгами							next_point = cur_point + 1;						}						break;				}								if (next_point != -1)					break;			}						return next_point;		},
		
		/**
		 * Возвращает тип текущего редактора (css или html)		 * @return {String|null}
		 * TODO move to Eclipse-specific file		 */		getEditorType: function() {			var content_types = {				'text/html':  'html',				'text/xml' :  'html',				'text/css' :  'css',				'text/xsl' :  'xsl'			};						return content_types[getPartition(editors.activeEditor.currentOffset)];		},
		
		/**
		 * Возвращает отступ текущей строки у редактора
		 * @return {String}
		 */
		getCurrentLinePadding: function() {
			var editor = editors.activeEditor,
				cur_line_num = editor.getLineAtOffset(editor.selectionRange.startingOffset),
				end_offset = editor.getOffsetAtLine(cur_line_num + 1) + getNewline().length,
				cur_line = editor.source.substring(editor.getOffsetAtLine(cur_line_num), end_offset);			return (cur_line.match(/^(\s+)/) || [''])[0];		},
		
		setupProfile: setupProfile,
		
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
			var re_tag = /^<([\w\-]+(?:\:\w+)?)((?:\s+[\w\-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
				
				re_attrs = /([\w\-]+)\s*=\s*(['"])(.*?)\2/g;
			
			/**
			 * Make expando from string
			 * @param {String} key
			 * @param {String} value
			 * @return {Object}
			 */
			function makeExpando(key, value) {
//				if (key.substr(-1) == '+') 
//					key = key.substring(0, key.length - 2);	
				
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
						obj[key] = makeAbbreviation(key, m[1], m[2], m[3] == '/');
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

// first we need to expand some strings into hashes
zen_coding.settings_parser.createMaps(zen_settings);
if ('my_zen_settings' in this) {
	// we need to extend default settings with user's
	zen_coding.settings_parser.createMaps(my_zen_settings);
	zen_coding.settings_parser.extend(zen_settings, my_zen_settings);
}

// now we need to parse final set of settings
zen_coding.settings_parser.parse(zen_settings);