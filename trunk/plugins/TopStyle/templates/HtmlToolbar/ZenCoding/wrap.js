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

// Определяет используемый в тексте тип переноса (CR, LF или CRLF).
function getNewLineMark(text) {
	return ( text.match(/\r\n/m) ? '\r\n' : 
			( text.match(/\r^\n/) ? '\r' : '\n' ) )
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

// Предварительная обработка массива строк. Отрезает левые отступы у всех строк, 
// кроме первой (чтобы компенсировать отступ, который добавит TopStyle), 
// а также находит первую (start) и последнюю (end) непустую строку в тексте. 
function preProcessor(text) {
	var start = -1, end = text.length
	for(var i=0; i < text.length; i++) {
		if (i) text[i] = text[i].replace(/^\s*/, '')

		if (start+1 == i && text[i].match(/^\s*$/))
			start = i
		else if (i > start && text[i].match(/^\s*$/))
			end = (i < end ? i : end)
		else {
			end = text.length
		}
	}

	return {lines: text, start: start+1, end: end-1}
}

function wrap(every) {
	var every = !!every, res = '',
		text = ts.getSelection() || '',

		// Определяем тип переноса (CR, LF или CRLF)
		nl = getNewLineMark(text),

		// Разбиваем выделение по строкам
		lines = ts.getSelection().split(nl),

		// Вырезаем лишние пробелы в тагнэйме 
		tag = trim(document.forms[0].tagname.value),

	    	// Получаем тэг без атрибутов
		tag_name = tag.replace(/([^\s]+).*$/, "$1");

	pre = preProcessor(lines)
	lines = pre.lines

	for(var i=0, len=lines.length; i<len; i++)
	    res += 
		// ставим line feed для всех строк, кроме первой
		(!i ? '' : nl) +
		// обрамляем содержательную часть строки тэгом
		lines[i].replace(/^(\s*)(.*[^\s])(\s*)$/, 
			// сохраняем отступ слева (если есть)
			'$1' + 
			// обрамляем тэгом слева если первая непустая строка или wrap every line
			(every || i==pre.start ? '<'+tag+'>' : '') + 
			// сама строка
			'$2' +  
			// обрамляем тэгом справа если последняя непустая строка или wrap every line
			(every || i==pre.end ? '</'+tag_name+'>' : '') + 
			// сохраняем отступ справа (если есть)
			'$3')

	return preservePipe(res)
}