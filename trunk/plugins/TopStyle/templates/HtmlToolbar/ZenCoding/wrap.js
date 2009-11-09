/** 
  * Wrap in Tag plugin for TopStyle 4.0
  * Author: Vladimir Zhuravlev (private.face@gmail.com)
  */

function initUI() {
	document.forms[0].tagname.value = 'span';
	document.forms[0].tagname.focus();
	document.forms[0].tagname.select();
}

function onOK() {
	// TODO: Tag validation
	return trim(document.forms[0].tagname.value) != ''
}

// Определяет используемый в тексте тип переноса (CRLF или LF).
function getNewLineMark(text) {
	return ( text.match(/\r\n/m) ? '\r\n' : '\n' )
}

// Сохраняет символы "|" в тексте.
function preservePipe(text) {
	/* 
	   Символ "|" интерпретируется TopStyle как маркер позиции курсора, поэтому, если исходный текст его содержит,
	   то чтобы он не затерся, нужно добавлять еще один в начало.
	*/
	if (text.match(/\|/m))
		return text.replace(/^(\s*)/, '$1|')
	else 
		return text
}

// Отрезает пробельные символы справа и слева в строке.
function trim(s) {
	return s.replace(/^\s+/, '').replace(/\s+$/, '')
}


function wrap(every) {
	var every = !!every,
		text = ts.getSelection() || '',

		// Определяем тип переноса (CRLF или LF)
		nl = getNewLineMark(text),

		// Разбиваем выделение по строкам
		lines = ts.getSelection().split(nl),

		// Вырезаем лишние пробелы в тагнэйме 
		tag = trim(document.forms[0].tagname.value),

	    	// Получаем тэг без атрибутов
		tag_name = tag.replace(/([^\s]+).*$/, "$1")

	// Если выделение однострочное оборачиваем его в тэг
	if (lines.length == 1) {
		res = lines[0].replace(/([^\s].*[^\s])|([^\s])/, '<' + tag + '>$1$2<' + tag_name + '>')
	}
	else {
		// Первую строку оборачиваем тэгом без ликвидации отступа слева (TopStyle ее не отбивает).
		res = lines[0].replace(/([^\s].*[^\s])|([^\s])/, '<'+tag+'>$1$2' + 
			(every ? '</'+tag_name+'>' : '') )

		// У остальных строк перед заворачиванием в тэг удаляем пробелы слева, 
		// чтобы скомпенсировать отступ, который автоматически добавит TopStyle.
		for(var i=1, len=lines.length; i<len; i++)
		    res += nl + lines[i].replace(/(\s*)(([^\s].*[^\s])|([^\s]))/, 
			(every ? '<'+tag+'>' : '') + '$2$4' +  
			(every || i==len-1 ? '</'+tag_name+'>' : ''))
	}

	return preservePipe(res)
}