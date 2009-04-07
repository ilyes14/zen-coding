/**
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 * @include "settings.js"
 * @include "../monkey-doc.js"
 */var zen_coding = (function(){
	
	/**
	 * Проверяет, является ли символ допустимым в аббревиатуре
	 * @param {String} ch
	 * @return {Boolean}
	 */
	function isAllowedChar(ch) {
		var char_code = ch.charCodeAt(0),
			special_chars = '#.>+*:$-_';
		
		return (char_code > 64 && char_code < 91)       // uppercase letter
				|| (char_code > 96 && char_code < 123)  // lowercase letter
				|| (char_code > 47 && char_code < 58)   // number
				|| special_chars.indexOf(ch) != -1;     // special character
	}
	
	/**
	 * Вспомогательная функция, которая преобразовывает строку в хэш
	 * @return {Object}
	 */
	function makeMap(str){
		var obj = {}, items = str.split(",");
		for ( var i = 0; i < items.length; i++ )
			obj[ items[i] ] = true;
		return obj;
	}
	
	/**
	 * Возвращает символ перевода строки, используемый в редакторе
	 * @return {String}
	 */
	function getNewline() {
		return editors.activeEditor.lineDelimiter;
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
				pad_str += zen_settings.indentation;
		else
			pad_str = pad;
		
		// бьем текст на строки и отбиваем все, кроме первой, строки
		var nl = getNewline(), 
			lines = text.split(nl);
			
		result += lines[0];
		for (var j = 1; j < lines.length; j++) 
			result += nl + pad_str + lines[j];
			
		return result;
	}
	
	/**
	 * Проверяет, является ли аббревиатура сниппетом
	 * @return {Boolean}
	 */
	function isShippet(abbr) {
		return zen_settings.html.snippets[abbr] ? true : false;
	}
	
	/**
	 * Тэг
	 * @class
	 * @param {String} name Имя тэга
	 * @param {Number} count Сколько раз вывести тэг (по умолчанию: 1)
	 */
	function Tag(name, count) {
		name = name.toLowerCase();
		
		this.name = Tag.getRealName(name);
		this.count = count || 1;
		this.children = [];
		this.attributes = {};
		
		//добавляем атрибуты по умолчанию
		var def_attrs = zen_settings.html.default_attributes[name];
		if (def_attrs) {
			for (var attr_name in def_attrs) {
				this.addAttribute(attr_name, def_attrs[attr_name])
			}
		}
	}
	
	/**
	 * Возвращает настоящее имя тэга
	 * @param {String} name
	 * @return {String}
	 */
	Tag.getRealName = function(name) {
		var real_name = name;
		if (zen_settings.html.short_names[name]) // аббревиатура: bq -> blockquote
			real_name = zen_settings.html.short_names[name];
		
		return real_name;
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
			this.attributes[name] = value;
		},
		
		/**
		 * Проверяет, является ли текущий элемент пустым
		 * @return {Boolean}
		 */
		isEmpty: function() {
			return zen_settings.html.empty_elements[this.name];
		},
		
		/**
		 * Проверяет, является ли текущий элемент строчным
		 * @return {Boolean}
		 */
		isInline: function() {
			return zen_settings.html.inline_elements[this.name];
		},
		
		/**
		 * Проверяет, является ли текущий элемент блочным
		 * @return {Boolean}
		 */
		isBlock: function() {
			return zen_settings.html.block_elements[this.name];
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
		 * Преобразует тэг в строку. Если будет передан аргумент 
		 * <code>format</code> — вывод будет отформатирован согласно настройкам
		 * в <code>zen_settings</code>. Также в этом случае будет ставится 
		 * символ «|», означающий место вставки курсора. Курсор будет ставится
		 * в пустых атрибутах и элементах без потомков
		 * @param {Boolean} format Форматировать вывод
		 * @param {Boolean} indent Добавлять отступ
		 * @return {String}
		 */
		toString: function(format, indent) {
			var result = [], 
				attrs = '', 
				content = '', 
				start_tag = '', 
				end_tag = '',
				cursor = format ? '|' : '';

			indent = indent || false;
				
			// делаем строку атрибутов
			for (var a in this.attributes) 
				attrs += ' ' + a + '="' + (this.attributes[a] || cursor) + '"';
			
			// выводим потомков
			if (!this.isEmpty())
				for (var j = 0; j < this.children.length; j++) {
					content += this.children[j].toString(format, true);
					if (format && this.children[j].isBlock() && j != this.children.length - 1)
						content += getNewline();
				}
			
			if (this.name) {
				if (this.isEmpty()) {
					start_tag = '<' + this.name + attrs + ' />';
				} else {
					start_tag = '<' + this.name + attrs + '>';
					end_tag = '</' + this.name + '>';
				}
			}
			
			// форматируем вывод
			if (format) {
				if (this.name && this.hasBlockChildren()) {
					start_tag += getNewline() + zen_settings.indentation;
					end_tag = getNewline() + end_tag;
				}
				
				if (content)
					content = padString(content, indent ? 1 : 0);
				else
					start_tag += cursor;
					
			}
					
			// выводим тэг нужное количество раз
			for (var i = 0; i < this.count; i++) 
				result.push(start_tag.replace(/\$/g, i + 1) + content + end_tag);
			
			return result.join(format && this.isBlock() ? getNewline() : '');
		}
	};
	
	function Snippet(name, count) {
		/** @type {String} */
		this.name = name;
		this.count = count || 1;
		this.children = [];
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
		
		toString: function(format, indent) {
			indent = indent || false;
			
			var content = '', 
				result = [], 
				data = zen_settings.html.snippets[this.name],
				begin = '',
				end = '',
				child_padding = '',
				child_token = '${child}';
				
			if (data) {
				if (format) {
					var nl = getNewline();
					data = data.replace(/\n/g, nl);
					// нужно узнать, какой отступ должен быть у потомков
					var lines = data.split(nl);
					for (var j = 0; j < lines.length; j++) {
						if (lines[j].indexOf(child_token) != -1) {
							child_padding =  (m = lines[j].match(/(^\s+)/)) ? m[1] : '';
							break;
						}
					}
				}
				
				var parts = data.split('${child}');
				begin = parts[0] || '';
				end = parts[1] || '';
			}
			
			for (var i = 0; i < this.children.length; i++) {
				content += this.children[i].toString(format, true);
				if (format && this.children[i].isBlock() && i != this.children.length - 1)
					content += getNewline();
			}
			
			if (child_padding)
				content = padString(content, child_padding);
			
			
			// выводим тэг нужное количество раз
			for (var i = 0; i < this.count; i++) 
				result.push(begin.replace(/\$/g, i + 1) + content + end);
			
			return result.join(format ? getNewline() : '');
		}
	}
	
	// инициализация движка
	zen_settings.html.block_elements = makeMap(zen_settings.html.block_elements);
	zen_settings.html.inline_elements = makeMap(zen_settings.html.inline_elements);
	zen_settings.html.empty_elements = makeMap(zen_settings.html.empty_elements);
	
	return {
		/**
		 * Ищет аббревиатуру в текущем редакторе и возвращает ее
		 * @return {String|null}
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
				cur_offset = original_offset,
				cur_line = editor.getLineAtOffset(cur_offset),
				start_index = -1;
			
			while (true) {
				cur_offset--;
				if (cur_offset < 0 || editor.getLineAtOffset(cur_offset) != cur_line) {
					// дошли до начала кода либо перешли на новую строку
					break;
				}
				
				if (!isAllowedChar(editor.source.charAt(cur_offset))) {
					start_index = cur_offset + 1;
					break;
				}
			}
			
			// возвращаем курсор в прежнее место
			editor.currentOffset = original_offset;
			
			if (start_index != -1 && start_index != original_offset) 
				// что-то нашли, возвращаем аббревиатуру
				return editor.source.substring(start_index, original_offset);
			else
				return null;
		},
		
		/**
		 * Преобразует аббревиатуру в дерево элементов
		 * @param {String} abbr Аббревиатура
		 * @return {Tag}
		 */
		parseIntoTree: function(abbr) {
			var root = new Tag(''),
				parent = root,
				last = null,
				re = /([\+>])?([a-z][a-z0-9:]*)(#[\w\-\$]+)?((?:\.[\w\-\$]+)*)(?:\*(\d+))?/ig;
			
			if (!abbr)
				return null;
			
			// заменяем разворачиваемые элементы
			abbr = abbr.replace(/([a-z][a-z0-9]*)\+$/i, function(str, tag_name){
				return zen_settings.html.expandos[tag_name] || str;
			});
			
			abbr = abbr.replace(re, function(str, operator, tag_name, id, class_name, multiplier){
				multiplier = multiplier ? parseInt(multiplier) : 1;
				
				var current = isShippet(tag_name) ? new Snippet(tag_name, multiplier) : new Tag(tag_name, multiplier);
				if (id)
					current.addAttribute('id', id.substr(1));
				
				if (class_name) 
					current.addAttribute('class', class_name.substr(1).replace(/\./g, ' '));
				
				
				// двигаемся вглубь дерева
				if (operator == '>' && last)
					parent = last;
					
				parent.addChild(current);
				
				last = current;
				return '';
			});
			
			// если в abbr пустая строка — значит, вся аббревиатура без проблем 
			// была преобразована в дерево, если нет, то аббревиатура была не валидной
			return (!abbr) ? root : null;
		},
		
		/**
		 * Отбивает текст отступами
		 * @param {String} text Текст, который нужно отбить
		 * @param {String|Number} pad Количество отступов или сам отступ
		 * @return {String}
		 */
		padString: padString
	}
	
})();