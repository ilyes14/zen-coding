/**
 * Middleware layer that communicates between editor and Zen Coding.
 * This layer describes all available Zen Coding actions, like 
 * "Expand Abbreviation".
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 * 
 * @include "editor.js"
 */

/**
 * Search for abbreviation in editor from current caret position
 * @param {editor} editor Editor instance
 * @return {String|null}
 */
function findAbbreviation(editor) {
	var range = editor.getSelectionRange();
	if (range.start != range.end) {
		// abbreviation is selected by user
		return editor.getContent().substring(range.start, range.end);
	}
	
	// search for new abbreviation from current caret position
	var cur_line = editor.getCurrentLine();
	return zen_coding.extractAbbreviation(editor.getContent().substring(cur_line.start, cur_line.end));
}

/**
 * Find and expand abbreviation in current editor
 * @param {editor} editor Editor instance
 * @param {String} type Syntax type (html, css, etc.)
 * @param {String} profile_name Output profile name (html, xml, xhtml)
 */
function expandAbbreviation(editor, type, profile_name) {
	profile_name = profile_name || 'xhtml';
	
	var caret_pos = editor.getSelectionRange().start,
		abbr,
		content = '';
		
	if ( (abbr = findAbbreviation(editor)) ) {
		content = zen_coding.expandAbbreviation(abbr, type, profile_name);
		if (content)
			editor.replaceContent(content, caret_pos + abbr.length, caret_pos);
	}
}