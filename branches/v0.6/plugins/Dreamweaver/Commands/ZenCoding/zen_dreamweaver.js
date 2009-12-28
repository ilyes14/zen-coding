/*
 * Dreamweaver layer for Zen Coding
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 * Adapted to Dreamweaver GreLI (GreLImail@gmail.com)
 */
var ZC_IndentSize, ZC_IndentWithTabs;

function canAcceptCommand() {
	var dom = dw.getActiveWindow();

	if (dom && (dom.getParseMode() == 'html' || dom.getParseMode() == 'xml' || dom.getParseMode() == 'css') &&
		(dw.getFocus(true) == 'html' || dw.getFocus() == 'textView'))
			return true;
	else return false;
}

/**
 * Returns current editor type ('css', 'html', etc)
 * @return {String|null}
 */
getEditorType = function() {
	var dom = dw.getDocumentDOM(),
		parseMode = dom.getParseMode();

	if (dom.documentType.indexOf('XSLT') != -1)
		parseMode = 'xsl';

	if (parseMode != 'css' && parseMode != 'xml') {
		var caret_pos = dom.source.getSelection()[0],
			range = HTMLPairMatcher(dom.source.getText(), caret_pos);

		if (range && range[0] != -1) {
			var current_tag_name = HTMLPairMatcher.last_match.opening_tag.name;
			if (current_tag_name == 'style') parseMode = 'css';
		}
	}

	return parseMode;
}

ZC_checkIndentSettings = function() {
	if (typeof zen_settings !== undefined) {
		var indentSize = dw.getPreferenceInt('Source Format', 'Indent Size', 2),
			useTabs = dw.getPreferenceString('Source Format', 'Use Tabs', 'FALSE'),
			indentStr = '';

		if (ZC_IndentSize !== indentSize && ZC_IndentWithTabs !== useTabs) {
			ZC_IndentSize = indentSize;
			ZC_IndentWithTabs = useTabs;

			while (indentSize--) {
				indentStr += (useTabs.toUpperCase() == 'TRUE') ? '\t' : ' ';
			}

			zen_settings.variables.indentation = indentStr;
		}
	}
}


if (!('zen_coding' in this))
	zen_coding = {};

/**
 * Returns editor's newline character
 * @return {String}
 */
zen_coding.getNewline = function() {
	var newLine = dw.getPreferenceInt('Source Format', 'Line Break Type', 0x0A);
	return (newLine == 0x0D0A) ? '\x0D\x0A' : String.fromCharCode(newLine);
}

/**
 * Returns full line on text for passed character position
 */
function getLine(char_pos) {
	var content = dw.getDocumentDOM().source.getText(0, char_pos),
		start_ix = char_pos,
		end_ix,
		ch;

	function isNewline(ch) {
		return ch == '\n' || ch == '\r';
	}

	// find the beginnig of the line
	while (start_ix--) {
		if (isNewline(content.charAt(start_ix))) {
			start_ix++;
			break;
		}
	}

	// find the end of the line
	for (end_ix = char_pos; end_ix < content.length; end_ix++) {
		if (isNewline(content.charAt(end_ix)))
			break;
	}

	return content.substring(start_ix, end_ix);
}

/**
 * Search for abbreviation in current editor from current caret position
 * @return {String|null}
 */
function findAbbreviation() {
	/** Current editor */
	var dom = dw.getDocumentDOM(),
		selection = dom.source.getSelection();

	if (selection[0] != selection[1]) {
		// abbreviation is selected by user
		return dom.source.getText(selection[0], selection[1]);
	}

	// search for new abbreviation from current caret position
	return zen_coding.extractAbbreviation(getLine(selection[0]));
}

/**
 * Search for new caret insertion point
 * @param {Number} Search increment: -1 — search left, 1 — search right
 * @param {Number} Initial offset relative to current caret position
 * @return {Number} Returns -1 if insertion point wasn't found
 */
function findNewEditPoint(inc, offset) {
	inc = inc || 1;
	offset = offset || 0;
	var dom = dw.getDocumentDOM(),
		cur_point = dom.source.getSelection()[1] + offset,
		source = dom.source.getText(),
		max_len = source.length,
		next_point = -1;

	function ch(ix) {
		return source.charAt(ix);
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
					// empty attribute
					next_point = cur_point + 1;
				}
				break;
			case '>':
				if (next_char == '<') {
					// between tags
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
 * Returns padding of current editor's line
 * @return {String}
 */
function getCurrentLinePadding() {
	var dom = dw.getDocumentDOM();
		cur_line = getLine(dom.source.getSelection()[0]);

	return (cur_line.match(/^(\s+)/) || [''])[0];
}

/**
 * Unindent content, thus preparing text for tag wrapping
 * @param {String} text
 * @return {String}
 */
function unindent(text) {
	var pad = getCurrentLinePadding();
	var lines = zen_coding.splitByLines(text);
	for (var i = 0; i < lines.length; i++) {
		if (lines[i].search(pad) == 0)
			lines[i] = lines[i].substr(pad.length);
	}

	return lines.join(zen_coding.getNewline());
}

/**
 * Replaces current editor's substring with new content. Multiline content
 * will be automatically padded
 * 
 * @param {String} editor_str Current editor's substring
 * @param {String} content New content
 */
function replaceEditorContent(editor_str, content) {
	var dom = dw.getDocumentDOM(),
		selection = dom.source.getSelection();

	if (!content)
		return;

	// add padding for current line
	content = zen_coding.padString(content, getCurrentLinePadding()); 

	// get char index where we need to place cursor
	var start_pos = selection[1] - editor_str.length;
	var cursor_pos = content.indexOf('|');
	content = content.replace(/\|/g, '');

	// replace content in editor
	dom.source.replaceRange(start_pos, selection[1], content);

	// place cursor
	if (cursor_pos != -1)
		dom.source.setSelection(start_pos + cursor_pos, start_pos + cursor_pos);
}

function guessProfileName() {
	var dom = dw.getDocumentDOM();

	switch(dom.documentType) {
		 case 'XML':
		 case 'XSLT':
		 case 'XSLT-fragment':
		 	return 'xml';
		 case 'HTML':
		 	// html or xhtml?
		 	return dom.source.getText().search(/<!DOCTYPE[^>]+XHTML.+?>/) != -1 
		 		? 'xhtml'
		 		: 'html';
	}

	return 'html';
}

function mainExpandAbbreviation() {
	var dom = dw.getDocumentDOM(),
		editor_type = getEditorType(),
		profile_name = guessProfileName() || 'xhtml',
		selection = dom.source.getSelection(),
		start_offset = selection[0],
		end_offset = selection[1],
		start_line = dom.source.getLineFromOffset(start_offset),
		end_line = dom.source.getLineFromOffset(end_offset),

		abbr,
		content = '';

	if (start_line == end_line && (abbr = findAbbreviation())) {
		ZC_checkIndentSettings();
		content = zen_coding.expandAbbreviation(abbr, editor_type, profile_name);
		replaceEditorContent(abbr, content);
	}
}

/**
 * Wraps content with abbreviation
 * @param {String} editor_type
 * @param {String} profile_name
 */
function mainWrapWithAbbreviation() {
	var dom = dw.getDocumentDOM(),
		editor_type = getEditorType(),
		profile_name = guessProfileName() || 'xhtml',
		source = dom.source.getText(),
		selection = dom.source.getSelection(),
		start_offset = selection[0],
		end_offset = selection[1],

		abbr = prompt('Enter abbreviation');

	if (!abbr)
		return null; 

	if (start_offset == end_offset) {
		// no selection, find tag pair
		var range = HTMLPairMatcher(source, start_offset);

		if (!range || range[0] == -1) // nothing to wrap
			return null;

		start_offset = range[0];
		end_offset = range[1];

		// narrow down selection until first non-space character
		var re_space = /\s|\n|\r/;
		function isSpace(ch) {
			return re_space.test(ch);
		}

		while (start_offset < end_offset) {
			if (!isSpace(source.charAt(start_offset)))
				break;

			start_offset++;
		}

		while (end_offset > start_offset) {
			end_offset--;
			if (!isSpace(source.charAt(end_offset))) {
				end_offset++;
				break;
			}
		}

	}

	ZC_checkIndentSettings();

	var content = source.substring(start_offset, end_offset),
		result = zen_coding.wrapWithAbbreviation(abbr, unindent(content), editor_type, profile_name);

	if (result) {
		dom.source.setSelection(end_offset, end_offset);
		replaceEditorContent(content, result);
	}
}

function prevEditPoint() {
	var dom = dw.getDocumentDOM(),
		new_point = findNewEditPoint(-1);

	if (new_point == dom.source.getSelection()[0]) 
		// вернулись в ту же точку, начнем искать с другого места
		new_point = findNewEditPoint(-1, -2);

	if (new_point != -1) 
		dom.source.setSelection(new_point, new_point);
}

function nextEditPoint() {
	var dom = dw.getDocumentDOM(),
		new_point = findNewEditPoint(1);
	if (new_point != -1)
		dom.source.setSelection(new_point, new_point);
}

function mergeLines() {
	var dom = dw.getDocumentDOM(),
		source = dom.source.getText(),
		selection = dom.source.getSelection(),
		start_ix = selection[0],
		end_ix = selection[1];

	if (start_ix == end_ix) {
		// find matching tag
		var pair = HTMLPairMatcher(source, start_ix);

		if (pair) {
			start_ix = pair[0];
			end_ix = pair[1];
		}
	}

	if (start_ix != end_ix) {
		// got range, merge lines
		var text = source.substring(start_ix, end_ix),
			old_length = text.length;
		var lines = text.split(/(\r|\n)/);

		for (var i = 1; i < lines.length; i++) {
			lines[i] = lines[i].replace(/^\s+/, '');
		}

		text = lines.join('').replace(/\s{2,}/, ' ');
		dom.source.replaceRange(start_ix, start_ix + old_length, text);
		dom.source.setSelection(start_ix, start_ix + text.length);
	}

}

function gotoMatchingPair() {
	var dom = dw.getDocumentDOM(),
		source = dom.source.getText();
		caret_pos = dom.source.getSelection()[0];

	if (source.charAt(caret_pos) == '<') 
		// looks like caret is outside of tag pair  
		caret_pos++;

	var range = HTMLPairMatcher(source, caret_pos);

	if (range && range[0] != -1) {
		// match found
		var open_tag = HTMLPairMatcher.last_match.opening_tag,
			close_tag = HTMLPairMatcher.last_match.closing_tag;

		if (close_tag) { // exclude unary tags
			if (open_tag.start <= caret_pos && open_tag.end >= caret_pos)
				dom.source.setSelection(close_tag.start, close_tag.start);
			else if (close_tag.start <= caret_pos && close_tag.end >= caret_pos)
				dom.source.setSelection(open_tag.start, open_tag.start);
		}
	}
}

function formatSelectionWithShowdown() {
	var dom = dw.getDocumentDOM(),
		selection = dom.source.getSelection(),
		start_ix = selection[0],
		end_ix = selection[1];

	if (start_ix != end_ix) {
		var text = dom.source.getText(start_ix, end_ix),
			line_padding = getCurrentLinePadding();

		// удаляем все отступы в начале строки
		if (line_padding) {
			text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n'); 

			var lines = text.split('\n');
			lines[0] = lines[0].replace(/^\s+/, '');
			var re = new RegExp('^' + line_padding);
			for (var i	= 1; i < lines.length; i++) {
				lines[i] = lines[i].replace(re, '');
			}

			text = lines.join('\n');
		}

		var converter = new Showdown.converter();
		var html = converter.makeHtml(text);

		// заменяем переводы строк на те, что используются в редакторе
		//html = html.replace(/\r?\n/g, getNewline());

		// делаем отбивку
		html = zen_coding.padString(html, getCurrentLinePadding());

		// записываем результат
		dom.source.replaceRange(start_ix, end_ix, html);
	}
}
