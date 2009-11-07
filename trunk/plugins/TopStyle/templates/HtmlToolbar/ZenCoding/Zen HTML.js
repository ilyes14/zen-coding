function objectTag() {
	var 
		selection = ts.getSelection(false, true).replace(/^[\s\t\n]+/m, '').replace(/[\s\t\n]+$/m, ''), 
		text = zen_coding.parseIntoTree( selection, zen_coding.getEditorType() )
	
	if (!text)
		return ''

	text = text.toString(true)

	// Удаляем все символы | (позиция курсора), кроме первого.
	var cursor_pos = text.indexOf('|')
	if (cursor_pos!=-1){
		text = text.substring(0, cursor_pos+1).concat( text.substring(cursor_pos+1).replace(/\|/gm, '') )
	}

	// Если выделение содержит отступ слева - сохраняем его.
	return zen_coding.getCurrentLinePadding() + text 
}