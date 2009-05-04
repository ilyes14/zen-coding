/*
 * Menu: Zen Coding > Previuos Edit Point
 * Kudos: Sergey Chikuyonok (http://chikuyonok.ru)
 * License: EPL 1.0
 * Key: M3+[
 * Listener: commandService().addExecutionListener(this);
 * DOM: http://download.eclipse.org/technology/dash/update/org.eclipse.eclipsemonkey.lang.javascript
 * 
 * @include "lib/core.js"
 * @include "/EclipseMonkey/scripts/monkey-doc.js"
 */

include('lib/core.js');

function main() {
	var editor = editors.activeEditor,
		new_point = zen_coding.findNewEditPoint(-1);
		
	if (new_point == editor.currentOffset) 
		// вернулись в ту же точку, начнем искать с другого места
		new_point = zen_coding.findNewEditPoint(-1, -2);
	
	if (new_point != -1) 
		editor.currentOffset = new_point;
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