/*
 * Menu: Zen Coding > Expand Abbreviation
 * Kudos: Sergey Chikuyonok (http://chikuyonok.ru), Vadim Makeev (http://pepelsbey.net)
 * License: EPL 1.0
 * Key: M3+E
 * Listener: commandService().addExecutionListener(this);
 * DOM: http://download.eclipse.org/technology/dash/update/org.eclipse.eclipsemonkey.lang.javascript
 * DOM: http://localhost/com.aptana.ide.scripting
 * 
 * @include "/EclipseMonkey/scripts/monkey-doc.js"
 * @include "settings.js"
 * @include "lib/core.js"
 */
include('settings.js');
include('lib/core.js');

function main() {
	var editor = editors.activeEditor;
	var partition = getPartition(editor.currentOffset);
	
	if (partition != 'text/html' && partition != 'text/xml') {
		printMessage('"Expand abbreviation" works in html editor only.');
		return;
	}
	
	var abbr = zen_coding.findAbbreviation();
	if (abbr) {
		var tree = zen_coding.parseIntoTree(abbr);
		if (tree) {
			var expanded_data = tree.toString(true);
			
			// берем отступ у текущей строки
			var cur_line_num = editor.getLineAtOffset(editor.currentOffset);
			var cur_line = editor.source.substring(editor.getOffsetAtLine(cur_line_num), editor.currentOffset);
			var cur_line_pad = (cur_line.match(/^(\s+)/) || [''])[0];
			expanded_data = zen_coding.padString(expanded_data, cur_line_pad); 
			
			var start_pos = editor.selectionRange.endingOffset - abbr.length;
			var cursor_pos = expanded_data.indexOf('|');
			expanded_data = expanded_data.replace(/\|/g, '');
			
			// заменяем аббревиатуру на текст
			editor.applyEdit(start_pos, abbr.length, expanded_data);
			
			// ставим курсор
			if (cursor_pos != -1)
				editor.currentOffset = start_pos + cursor_pos;
				
		}
	}
}

function printMessage(message) {
	out.println(message);
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