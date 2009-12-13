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
	var 
		// получаем аббревиатуру
		abbr = document.forms[0].tagname.value, 

		// получаем выделение
		selection = ts.getSelection() || '',

		// опеределяем контекст выделения HTML/CSS
		type = ts.hasParent('style', '', '') ? 'css' : 'html',

		// опеределяем тип документа: HTML/xHTML 
		profile = ts.isXHTML() ? 'xhtml' : 'html', 
	
		// заворачиваем выделение в аббревиатуру
		text = zen_coding.wrapWithAbbreviation(abbr, selection, type, profile);


	if (!text)
		return '';

	text = text.toString(true);

	return text;
}