function initUI() {
	document.forms[0].tagname.value = 'div';
	document.forms[0].tagname.focus();
	document.forms[0].tagname.select();
}

function onOK() {
	// TODO: Tag validation
	return trim(document.forms[0].tagname.value) != ''
}

function objectTag() {
	// определяем собственные профили html/xhtml в которых не будет вставляться позиция курсора
	zen_coding.setupProfile("ts_xhtml", {place_cursor: false});
	zen_coding.setupProfile("ts_html", {place_cursor: false, self_closing_tag: false});

	var 
		// получаем аббревиатуру
		abbr = document.forms[0].tagname.value, 

		// получаем выделение
		selection = ts.getSelection() || '',

		// опеределяем контекст выделения HTML/CSS
		type = ts.hasParent('style', '', '') ? 'css' : 'html',

		// опеределяем тип документа: HTML/xHTML 
		profile = ts.isXHTML() ? 'ts_xhtml' : 'ts_html', 
	
		// заворачиваем выделение в аббревиатуру
		text = zen_coding.wrapWithAbbreviation(abbr, selection, type, profile);


	if (!text)
		return '';

	text = text.toString(true);

	return text;
}