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
 * Returns current editor type ('css', 'html', etc)
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
		// selecated a few lines, indent them
		content = editor.source.substring(start_line_offset, end_line_offset);
		var new_content = indent + zen_coding.padString(content, 1);
		
		editor.applyEdit(start_line_offset, content.length, new_content);
		editor.selectAndReveal(start_line_offset, indent.length + content.length + end_line - start_line);
	} else {
		// selection spans just a single string, replace indentation
		editor.applyEdit(start_offset, end_offset - start_offset, indent);
		editor.currentOffset++;
	}
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

function printMessage(message) {
	out.println(message);
}

/**
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