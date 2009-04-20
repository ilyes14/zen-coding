'''
Created on Apr 17, 2009

@author: Sergey Chikuyonok (http://chikuyonok.ru)
'''
zen_settings = {
	'indentation': '\t',
	
	'html': {
		'snippets': {
			'cc:ie6': '<!--[if lte IE 6]>\n\t${child}|\n<![endif]-->',
			'cc:ie': '<!--[if IE]>\n\t${child}|\n<![endif]-->',
			'cc:noie': '<!--[if !IE]><!-->\n\t${child}|\n<!--<![endif]-->',
			'html:4t': '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">\n' +
					'<html lang="ru">\n' +
					'<head>\n' +
					'	<title></title>\n' +
					'	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">\n' +
					'</head>\n' +
					'<body>\n\t${child}|\n</body>\n' +
					'</html>',
			
			'html:4s': '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">\n' +
					'<html lang="ru">\n' +
					'<head>\n' +
					'	<title></title>\n' +
					'	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">\n' +
					'</head>\n' +
					'<body>\n\t${child}|\n</body>\n' +
					'</html>',
			
			'html:xt': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n' +
					'<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ru">\n' +
					'<head>\n' +
					'	<title></title>\n' +
					'	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />\n' +
					'</head>\n' +
					'<body>\n\t${child}|\n</body>\n' +
					'</html>',
			
			'html:xs': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n' +
					'<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ru">\n' +
					'<head>\n' +
					'	<title></title>\n' +
					'	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />\n' +
					'</head>\n' +
					'<body>\n\t${child}|\n</body>\n' +
					'</html>',
			
			'html:xxs': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">\n' +
					'<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ru">\n' +
					'<head>\n' +
					'	<title></title>\n' +
					'	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />\n' +
					'</head>\n' +
					'<body>\n\t${child}|\n</body>\n' +
					'</html>',
			
			'html:5': '<!DOCTYPE HTML>\n' +
					'<html lang="ru-RU">\n' +
					'<head>\n' +
					'	<title></title>\n' +
					'	<meta charset="UTF-8">\n' +
					'</head>\n' +
					'<body>\n\t${child}|\n</body>\n' +
					'</html>'		
		},
			
			
		'default_attributes': {
			'a': {'href': ''},
			'a:link': {'href': 'http://|'},
			'a:mail': {'href': 'mailto:|'},
			'abbr': {'title': ''},
			'acronym': {'title': ''},
			'base': {'href': ''},
			'bdo': {'dir': ''}
		},
		
		'aliases': {
			'link:*': 'link',
			'meta:*': 'meta',
			'area:*': 'area',
			'bdo:*': 'bdo',
			'form:*': 'form',
			'input:*': 'input',
			'script:*': 'script',
			'html:*': 'html',
			'a:*': 'a',
			
			'bq': 'blockquote',
			'acr': 'acronym',
			'fig': 'figure',
			'ifr': 'iframe',
			'emb': 'embed',
			'obj': 'object',
			'src': 'source',
			'cap': 'caption',
			'colg': 'colgroup',
			'fst': 'fieldset',
			'btn': 'button',
			'optg': 'optgroup',
			'opt': 'option',
			'tarea': 'textarea',
			'leg': 'legend'
		},
		
		 # Expanded patterns (ends with +) 
		'expandos': {
			'ol': 'ol>li',
			'ul': 'ul>li',
			'dl': 'dl>dt+dd',
			'map': 'map>area',
			'table': 'table>tr>td',
			'colgroup': 'colgroup>col',
			'colg': 'colgroup>col',
			'tr': 'tr>td',
			'select': 'select>option',
			'optgroup': 'optgroup>option',
			'optg': 'optgroup>option'
		},
		
		'empty_elements': "area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed",
		
		'block_elements': "address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,link,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul,h1,h2,h3,h4,h5,h6",
		
		'inline_elements': "a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var"
	}
}