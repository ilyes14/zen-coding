function objectTag() {
	var 
		// получаем выделение, удал€€ в нем все переносы строк
		selection = ts.getSelection(false, false).replace(/\s*[\r\n]\s*/mg, ''), 

		// опередел€ем контекст аббревиатуры HTML/CSS
		type = ts.hasParent('style', '', '') ? 'css' : 'html',

		// опередел€ем тип документа: HTML/xHTML 
		profile = ts.isXHTML() ? 'xhtml' : 'html', 

		// разворачиваем аббревиатуру
		text = zen_coding.expandAbbreviation(selection, type, profile);

	if (!text)
		return '';

	text = text.toString(true);

	// ”дал€ем все символы | (позици€ курсора), кроме первого.
	var cursor_pos = text.indexOf('|');
	if (cursor_pos!=-1) {
		text = text.substring(0, cursor_pos+1).concat( text.substring(cursor_pos+1).replace(/\|/gm, '') );
	}

	return text;
}