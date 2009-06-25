/*
 * Menu: Zen Coding > Select Tag
 * Kudos: Sergey Chikuyonok (http://chikuyonok.ru)
 * License: EPL 1.0
 * Key: M3+D
 * DOM: http://download.eclipse.org/technology/dash/update/org.eclipse.eclipsemonkey.lang.javascript
 * 
 * @include "/EclipseMonkey/scripts/monkey-doc.js"
 * @include "lib/htmlparser.js"
 */

include('lib/htmlparser.js');

function main() {
	var editor = editors.activeEditor,
		source = editor.source,
		cursor_pos = editor.currentOffset,
		delta = 0,
		range;
	
	var iters = 0;
	while (true) {
		range = getTagRange(source, cursor_pos);
		if (!isValidRange(range))
			break;
		
		if (range[0] > cursor_pos || range[1] < cursor_pos) {
			// cursor is out of range, going up
			source = source.substring(0, range[0]) + source.substring(range[1]);
			if (cursor_pos > range[1]) {
				var d = range[1] - range[0];
				cursor_pos -= d;
				delta += d;
			}
			
		} else {
			// found range
			break;
		}
		
		if (++iters > 200) break; // endless loop
	}
	
	if (isValidRange(range)) {
		editor.selectAndReveal(range[0], range[1] - range[0] + delta);
	}
}

function isValidRange(range) {
	return range[0] != range[1] && range[0] > -1 && range[1] > -1;
}

/**
 * Returns two indicies indicating start and end of selection of current tag
 * @requires HTMLParser
 * @param {String} html Full HTML code
 * @param {Number} cursor_pos Current cursor position inside HTML code
 */
function getTagRange(html, cursor_pos) {
	// find nearest leftmost tag
	var start_pos = cursor_pos,
		end_pos = cursor_pos,
		found = false;
		
	while (--start_pos > 0) {
		if (
			html.charAt(start_pos) == '<' 
			&& HTMLParser.startTag.test(html.substring(start_pos, 1024))
		) {
			found = true;
			break;
		}
	}
	
	if (found) {
		// found position of tag, start searching closing one
		var tag_name = null, 
			opened_tags = 0;
		
		var handler = {
			start: function(name, attrs, unary, ix_start, ix_end) {
				if (tag_name === null) // first run
					tag_name = name;
					
				if (name == tag_name) {
					if (unary) {
						handler.stop = true;
						end_pos = start_pos + ix_end;
					} else {
						opened_tags++;
					}
				}
			},
			
			end: function(name, ix_start, ix_end) {
				if (name == tag_name)
					opened_tags--;
				
				if (!opened_tags) { // found it
					handler.stop = true;
					end_pos = start_pos + ix_end;
				}
			}
		};
		
		HTMLParser(html.substring(start_pos), handler);
	}
	
	return [start_pos, end_pos];
}