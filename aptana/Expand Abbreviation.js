/*
 * Menu: Zen Coding > Expand Abbreviation
 * Kudos: Sergey Chikuyonok (http://chikuyonok.ru)
 * License: EPL 1.0
 * Key: M3+E
 * DOM: http://download.eclipse.org/technology/dash/update/org.eclipse.eclipsemonkey.lang.javascript
 * 
 * @include "/EclipseMonkey/scripts/monkey-doc.js"
 * @include "lib/core.js"
 * @include "settings.js"
 */

// init engine
include('zen_settings.js');
try {
	include('my_zen_settings.js');
} catch(e){}

include('lib/zen_coding.js');
include('lib/zen_eclipse.js');

function main() {
	var editor_type;
	try {
		editor_type = getEditorType() || 'html';
		if (!editor_type) {
			if (use_tab)
				expandTab();
			else
				printMessage('"Expand abbreviation" doesn\'t work in this editor.');
			return;
		}
	} catch(e) {
		if (use_tab) 
			expandTab();
	}
	
	mainExpandAbbreviation(editor_type, guessProfileName());
}