/*
 * Menu: Zen Coding > Expand Abbreviation
 * Kudos: Sergey Chikuyonok (http://chikuyonok.ru), Vadim Makeev (http://pepelsbey.net)
 * License: EPL 1.0
 * Key: M3+E
 * Listener: commandService().addExecutionListener(this);
 * DOM: http://download.eclipse.org/technology/dash/update/org.eclipse.eclipsemonkey.lang.javascript
 * 
 * @include "/EclipseMonkey/scripts/monkey-doc.js"
 * @include "settings.js"
 * @include "lib/core.js"
 */
include('settings.js');
try {
	include('my-settings.js');
} catch(e){}

include('lib/core.js');

function main() {
	var editor_type = getEditorType();
	if (!editor_type) {
		printMessage('"Expand abbreviation" doesn\'t work in this editor.');
		return;
	}
	
	var abbr = zen_coding.findAbbreviation(),
		content = null;
	if (abbr) {
		if (editor_type == 'html') {
			var tree = zen_coding.parseIntoTree(abbr);
			if (tree) 
				content = tree.toString(true);
		} else {
			try {
				content = zen_settings[editor_type].snippets[abbr];
			} catch(e) {}
		}
		
		replaceAbbreviationWithContent(abbr, content);
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
	
	// берем отступ у текущей строки
	var cur_line_num = editor.getLineAtOffset(editor.currentOffset);
	var cur_line = editor.source.substring(editor.getOffsetAtLine(cur_line_num), editor.currentOffset);
	var cur_line_pad = (cur_line.match(/^(\s+)/) || [''])[0];
	content = zen_coding.padString(content, cur_line_pad); 
	
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

function printMessage(message) {
	out.println(message);
}

/**
 * Возвращает тип текущего редактора (css или html)
 * @return {String|null}
 */
function getEditorType() {
	var content_types = {
		'text/html':  'html',
		'text/xml' :  'html',
		'text/css' :  'css'
	};
	
	return content_types[getPartition(editors.activeEditor.currentOffset)];
}

/**
 * Get the type of the partition based on the current offset
 * @param {Number} offset
 * @return {String}
 */
function getPartition(offset){
	try {

		var fileContext = editors.activeEditor.textEditor.getFileContext();

		if (fileContext !== null && fileContext !== undefined) {
			var partition = fileContext.getPartitionAtOffset(offset);
			return String(partition.getType());
		}
	} catch(e) {
		
	}

	return null;
}

function commandService(){
	var commandServiceClass = Packages.org.eclipse.ui.commands.ICommandService;

	// same as doing ICommandService.class
    var commandService = Packages.org.eclipse.ui.PlatformUI.getWorkbench().getAdapter(commandServiceClass);
    return commandService;
}

/**
 * Called before any/every command is executed, so we must filter on command ID
 */
function preExecute(commandId, event) {
	if (commandId == "com.aptana.ide.editors.views.actions.actionKeyCommand"){
		main();
    }
}

/* Add in all methods required by the interface, even if they are unused */
function postExecuteSuccess(commandId, returnValue) {}

function notHandled(commandId, exception) {}

function postExecuteFailure(commandId, exception) {}