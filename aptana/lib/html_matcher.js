/**
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */(function(){
	// Regular Expressions for parsing tags and attributes
	var start_tag = /^<([\w\:]+)((?:\s+[\w\-:]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
		end_tag = /^<\/([\w\:]+)[^>]*>/,
		attr = /([\w\-:]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;
		
	// Empty Elements - HTML 4.01
	var empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed");

	// Block Elements - HTML 4.01
	var block = makeMap("address,applet,blockquote,button,center,dd,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul");

	// Inline Elements - HTML 4.01
	var inline = makeMap("a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");

	// Elements that you can, intentionally, leave open
	// (and which close themselves)
	var close_self = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");


	// Special Elements (can contain anything)
	// serge.che: parsing data inside <script> elements is a "feature" 
//	var special = makeMap("script,style");
	var special = makeMap("style");
	
	function tag(match, ix) {
		var name = match[1].toLowerCase();
		return  {
			name: name,
			full_tag: match[0],
			start: ix,
			end: ix + match[0].length,
			unary: Boolean(match[3]) || (name in empty),
			type: 'tag',
			close_self: (name in close_self)
		};
	}
	
	function comment(start, end) {
		return {
			start: start,
			end: end,
			type: 'comment'
		};
	}
	
	/**
	 * @return {Array|null}
	 */
	var HTMLPairMatcher = this.HTMLPairMatcher = function(/* String */ html, /* Number */ start_ix){
		var forward_stack = [],
			backward_stack = [],
			/** @type {tag()} */
			opening_tag = null,
			/** @type {tag()} */
			closing_tag = null,
			range = null,
			html_len = html.length,
			m,
			ix;
			
		forward_stack.last = backward_stack.last = function() {
			return this[this.length - 1];
		}
		
		// find opening tag
		ix = start_ix;
		while (ix--) {
			if (html.charAt(ix) == '<') {
				var check_str = html.substring(ix, html_len);
				
				if ( (m = check_str.match(end_tag)) ) // found closing tag
					backward_stack.push( tag(m, ix) );
				
				else if ( (m = check_str.match(start_tag)) ) { // found opening tag
					var tmp_tag = tag(m, ix);
					if (tmp_tag.unary) {
						if (tmp_tag.start < start_ix && tmp_tag.end >= start_ix) // exact match
							return saveMatch(tmp_tag, null, start_ix);
					} else if (backward_stack.last() && backward_stack.last().name == tmp_tag.name) {
						backward_stack.pop();
					} else { // found nearest unclosed tag
						opening_tag = tmp_tag;
						break;
					}
				} else if (check_str.indexOf('<!--') == 0) { // found comment
					var end_ix = check_str.search('-->') + ix + 3;
					if (ix < start_ix && end_ix >= start_ix)
						return saveMatch( comment(ix, end_ix) );
				}
			}
		}
		
		if (!opening_tag)
			return saveMatch(null);
		
		// find closing tag
		ix = start_ix;
		for (var ix = start_ix; ix < html_len; ix++) {
			if (html.charAt(ix) == '<') {
				var check_str = html.substring(ix, html_len);
				
				if ( (m = check_str.match(start_tag)) ) // found opening tag
					forward_stack.push( tag(m, ix) );
				
				else if ( (m = check_str.match(end_tag)) ) { // found closing tag
					var tmp_tag = tag(m, ix);
					if (forward_stack.last() && forward_stack.last().name == tmp_tag.name)
						forward_stack.pop();
					else { // found matched closing tag
						closing_tag = tmp_tag;
						break;
					}
				}
			}
		}
		
		return saveMatch(opening_tag, closing_tag, start_ix);
	}
	
	
	HTMLPairMatcher.start_tag = start_tag;
	HTMLPairMatcher.end_tag = end_tag;
	HTMLPairMatcher.last_match = {
		opening_tag: null,
		closing_tag: null,
		start_ix: -1,
		end_ix: -1
	};
	
	/**
	 * Save matched tag for later use and return found indexes
	 * @param {tag()} opening_tag
	 * @param {tag()} closing_tag
	 * @param {Number} ix
	 * @return {Array|null}
	 */
	function saveMatch(opening_tag, closing_tag, ix) {
		var last = HTMLPairMatcher.last_match;
		last.opening_tag = opening_tag; 
		last.closing_tag = closing_tag;
		
		if (opening_tag && !closing_tag) { //unary element
			last.start_ix = opening_tag.start;
			last.end_ix = opening_tag.end;
		} else if (opening_tag && closing_tag) { // complete element
			if ( 
				(opening_tag.start < ix && opening_tag.end >= ix)
				|| (closing_tag.start < ix && closing_tag.end >= ix)
			) {
				last.start_ix = opening_tag.start;
				last.end_ix = closing_tag.end;
			} else {
				last.start_ix = opening_tag.end;
				last.end_ix = closing_tag.start;
			}
		} else {
			last.start_ix = last.end_ix = -1;
		}
		
		return last.start_ix != -1 ? [last.start_ix, last.end_ix] : null;
	}

	function makeMap(str){
		var obj = {}, items = str.split(",");
		for ( var i = 0; i < items.length; i++ )
			obj[ items[i] ] = true;
		return obj;
	}
	
})();