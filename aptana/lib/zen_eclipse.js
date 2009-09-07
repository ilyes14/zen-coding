/**
 * Eclipse layer for Zen Coding
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 * 
 * @include "/EclipseMonkey/scripts/monkey-doc.js"
 * @include "zen_coding.js"
 */

/**
 * If you're using Tab key, you have to set this variable to 'true'
 * @type Boolean
 */
var use_tab = false;

/**
 * Get the type of the partition based on the current offset
 * @param {Number} offset
 * @return {String}
 */
function getPartition(offset){
	var class_name = String(editors.activeEditor.textEditor.getClass());
	if (class_name.toLowerCase().indexOf('xsleditor') != -1)
		return 'text/xsl';
		
	try {

		var fileContext = editors.activeEditor.textEditor.getFileContext();

		if (fileContext !== null && fileContext !== undefined) {
			var partition = fileContext.getPartitionAtOffset(offset);
			return String(partition.getType());
		}
	} catch(e) {}

	return null;
}

/**
 * Возвращает тип текущего редактора (css или html)
 * @return {String|null}
 */
function getEditorType() {
	var content_types = {
		'text/html':  'html',
		'text/xml' :  'xml',
		'text/css' :  'css',
		'text/xsl' :  'xsl'
	};
	
	return content_types[getPartition(editors.activeEditor.currentOffset)];
}

if (!('zen_coding' in this))
	zen_coding = {};

/**
 * Возвращает символ перевода строки, используемый в редакторе
 * @return {String}
 */
zen_coding.getNewLine = function() {
	return editors.activeEditor.lineDelimiter;
}

/**
 * Ищет аббревиатуру в текущем редакторе и возвращает ее
 * @return {String|null}
 */
function findAbbreviation() {
	/** Current editor */
	var editor = editors.activeEditor;
	
	if (editor.selectionRange.startingOffset != editor.selectionRange.endingOffset) {
		// пользователь сам выделил нужную аббревиатуру
		return editor.source.substring(editor.selectionRange.startingOffset, editor.selectionRange.endingOffset);
	}
	
	// будем искать аббревиатуру с текущей позиции каретки
	var original_offset = editor.currentOffset,
		cur_line = editor.getLineAtOffset(original_offset),
		line_offset = editor.getOffsetAtLine(cur_line);
	
	return zen_coding.extractAbbreviation(editor.source.substring(line_offset, original_offset));
}

/**
 * Ищет новую точку вставки каретки
 * @param {Number} Инкремент поиска: -1 — ищем влево, 1 — ищем вправо
 * @param {Number} Начальное смещение относительно текущей позиции курсора
 * @return {Number} Вернет -1, если не была найдена новая позиция
 */
function findNewEditPoint(inc, offset) {
	inc = inc || 1;
	offset = offset || 0;
	var editor = editors.activeEditor,
		cur_point = editor.currentOffset + offset,
		max_len = editor.sourceLength,
		next_point = -1;
	
	function ch(ix) {
		return editor.source.charAt(ix);
	}
		
	while (cur_point < max_len && cur_point > 0) {
		cur_point += inc;
		var cur_char = ch(cur_point),
			next_char = ch(cur_point + 1),
			prev_char = ch(cur_point - 1);
			
		switch (cur_char) {
			case '"':
			case '\'':
				if (next_char == cur_char && prev_char == '=') {
					// пустой атрибут
					next_point = cur_point + 1;
				}
				break;
			case '>':
				if (next_char == '<') {
					// между тэгами
					next_point = cur_point + 1;
				}
				break;
		}
		
		if (next_point != -1)
			break;
	}
	
	return next_point;
}

/**
 * Возвращает отступ текущей строки у редактора
 * @return {String}
 */
function getCurrentLinePadding() {
	var editor = editors.activeEditor,
		cur_line_num = editor.getLineAtOffset(editor.selectionRange.startingOffset),
		end_offset = editor.getOffsetAtLine(cur_line_num + 1) + zen_coding.getNewline().length,
		cur_line = editor.source.substring(editor.getOffsetAtLine(cur_line_num), end_offset);
	return (cur_line.match(/^(\s+)/) || [''])[0];
}

function expandTab() {
	var editor = editors.activeEditor,
		start_offset = editor.selectionRange.startingOffset,
		end_offset = editor.selectionRange.endingOffset,
		start_line = editor.getLineAtOffset(start_offset),
		end_line = editor.getLineAtOffset(end_offset),
		
		indent = zen_settings.variables.indentation;
		
	var start_line_offset = editor.getOffsetAtLine(start_line),
			end_line_offset = editor.getOffsetAtLine(end_line + 1) - zen_coding.getNewline().length;
			
	if (start_line != end_line) {
		// выделили несколько строк, отбиваем их
		content = editor.source.substring(start_line_offset, end_line_offset);
		var new_content = indent + zen_coding.padString(content, 1);
		
		editor.applyEdit(start_line_offset, content.length, new_content);
		editor.selectAndReveal(start_line_offset, indent.length + content.length + end_line - start_line);
	} else {
		// выделение на одной строке, заменяем его на отступ
		editor.applyEdit(start_offset, end_offset - start_offset, indent);
		editor.currentOffset++;
	}
}

/**
 * Заменяет аббревиатуру на ее значение. Отчкой отсчета считается текущая 
 * позиция каретки в редакторе. Многострочное содержимое будет автоматически
 * отбито нужным количеством отступов
 * @param {String} abbr Аббревиатура
 * @param {String} content Содержимое
 */
function replaceAbbreviationWithContent(abbr, content) {
	var editor = editors.activeEditor;
	
	if (!content)
		return;
		
	// заменяем переводы строк на те, что используются в редакторе
	content = content.replace(/\n/g, zen_coding.getNewline());
	
	// ставим отступ у текущей строки
	content = zen_coding.padString(content, getCurrentLinePadding()); 
	
	// получаем позицию, куда нужно поставить курсор
	var start_pos = editor.selectionRange.endingOffset - abbr.length;
	var cursor_pos = content.indexOf('|');
	content = content.replace(/\|/g, '');
	
	// заменяем аббревиатуру на текст
	editor.applyEdit(start_pos, abbr.length, content);
	
	// ставим курсор
	if (cursor_pos != -1)
		editor.currentOffset = start_pos + cursor_pos;
}

function guessProfileName() {
	switch(getEditorType()) {
		 case 'xml':
		 case 'xsl':
		 	return 'xml';
		 case 'html':
		 	// html or xhtml?
		 	return editors.activeEditor.source.search(/<!DOCTYPE[^>]+XHTML.+?>/) != -1 
		 		? 'xhtml'
		 		: 'html';
	}
	
	return 'html';
}

function mainExpandAbbreviation(editor_type, profile_name) {
	profile_name = profile_name || 'xhtml';
	
	var editor = editors.activeEditor,
		start_offset = editor.selectionRange.startingOffset,
		end_offset = editor.selectionRange.endingOffset,
		start_line = editor.getLineAtOffset(start_offset),
		end_line = editor.getLineAtOffset(end_offset),
	
		abbr,
		content = '';
		
	if (start_line == end_line && (abbr = findAbbreviation())) {
		content = zen_coding.expandAbbreviation(abbr, editor_type, profile_name);
		replaceAbbreviationWithContent(abbr, content);
	} else if (use_tab) {
		// аббревиатуры раскрываются с помощью таба, но сама аббревиатура 
		// не найдена, будем делать отступ
		expandTab();
	}
}

function printMessage(message) {
	out.println(message);
}

/**
 * getLexemeList
 *
 * @return {LexemeList}
 */
function getLexemeList() {
	var result = null;
	var fileContext = getFileContext();
	
	if (fileContext !== null && fileContext !== undefined) {
		result = fileContext.getLexemeList();
	}
	
	return result;
}

/**
 * getFileContext
 * 
 * @return {FileContext}
 */
function getFileContext() {
	var result = null;
	
	try	{
		result = editors.activeEditor.textEditor.getFileContext();
	} catch(e) {}
	
	return result;
}

/**
 * Return lexeme from position
 * @param {Number} pos Position where to get lexeme
 * @return {Object}
 */
function getLexemeFromPosition(pos){
	var lexemeList = getLexemeList(), lx;
	if (lexemeList != null && lexemeList.size() > 0){
		for (var i = 0; i < lexemeList.size(); i++){
			lx = lexemeList.get(i);
			if(lx.getStartingOffset() <= pos && lx.getEndingOffset() >= pos){
				return lx;
			}
		}
	}

	return null;
}