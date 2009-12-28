/**
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */var re_key_value = /^\s*(["']?)((\w+)(?:[\:\w\-]*))\1\s*\:\s*(.+)\,?$/,
	re_attr = /\{(['"]?)([\w\-]+)\1\s*\:\s*(['"]?)(.*?)\3\}/g,
	empty_elements = "area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed,keygen,command".split(',');
	
function tag(name, attrs) {
	var attrs_array = [];
	(attrs || '').replace(re_attr, function(str, p1, p2, p3, p4){
		attrs_array.push(' ' + p2 + '="' + p4 + '"');
	});
	return '<' + name + attrs_array.join('') + ( empty_elements.indexOf(name) != -1 ? ' />' : '></' + name + '>' );
}

/**
 * Parse raw data
 * @param {String} data
 */
function parse(data) {
	var lines = data.split(/\r?\n/),
		result = [];
		
	for (var i = 0; i < lines.length; i++) {
		var m = re_key_value.exec(lines[i]);
		if (m) {
			result.push('\'' + m[2] + '\': \'' + tag(m[3], m[4]) + '\'');
		}
	}
	
	return result;
}

function convert() {
	var parsed_data = parse(document.getElementById('input').value);
	document.getElementById('output').value = parsed_data.join(',\n');
}