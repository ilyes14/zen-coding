/**
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */
 
/**
 * Creates group element
 * @param {String} expr Part of abbreviation that belongs to group item
 * @param {abbrGroup} [parent] Parent group item element
 */function abbrGroup(parent) {
	return {
		expr: '',
		parent: parent || null,
		children: [],
		addChild: function() {
			var child = abbrGroup(this);
			this.children.push(child);
			return child;
		},
		cleanUp: function() {
			for (var i = this.children.length - 1; i >= 0; i--) {
				if (!this.children[i].expr)
					this.children.splice(i, 1);
				else 
					this.children[i].cleanUp();
			}
		}
	}
}

/**
 * Split abbreviation on groups
 * @param {String} abbr
 * @return {abbrGroup()}
 */
function splitByGroups(abbr) {
	var root = abbrGroup(),
		last_parent = root,
//		last = root.addChild(),
		cur_item = root.addChild(),
		i = 0,
		il = abbr.length;
	
	while (i < il) {
		var ch = abbr.charAt(i);
//		console.log(ch);
		switch(ch) {
			case '(':
				// found new group
				var operator = i ? abbr.charAt(i - 1) : '';
				if (operator == '>') {
					last_parent = cur_item;
					cur_item = null;
//					last = last.addChild();
				} else {
//					last_parent = cur_item.parent;
					cur_item = null;
//					last = last.parent.addChild();
				}
				break;
			case ')':
//				last = (last.parent || root).addChild();
				last_parent = last_parent.parent || root;
				cur_item = null;
				var next_char = (i < il - 1) ? abbr.charAt(i + 1) : '';
				if (next_char == '+' || next_char == '>') 
					// next char is group operator, skip it
					i++;
				break;
			default:
				if (!cur_item)
					cur_item = last_parent.addChild();
				cur_item.expr += ch;
		}
		
		i++;
	}
	
	root.cleanUp();
	return root;
}