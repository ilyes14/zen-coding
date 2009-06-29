/*
 * Menu: Zen Coding > Match pair
 * Kudos: Sergey Chikuyonok (http://chikuyonok.ru)
 * License: EPL 1.0
 * Key: M3+D
 * DOM: http://download.eclipse.org/technology/dash/update/org.eclipse.eclipsemonkey.lang.javascript
 * 
 * @include "/EclipseMonkey/scripts/monkey-doc.js"
 * @include "lib/htmlparser.js"
 * @include "lib/zen_coding.js"
 */

include('lib/htmlparser.js');
include('lib/zen_coding.js');

function main() {
	var editor = editors.activeEditor,
		range = zen_coding.getPairRange(editor.source, editor.currentOffset);
		
	if (range)
		editor.selectAndReveal(range.start, range.end - range.start);
}