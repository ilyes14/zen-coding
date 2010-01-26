/**
 * Zen Editor interface for EclipseMonkey  
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 * 
 * @include "/EclipseMonkey/scripts/monkey-doc.js"
 * @include "../../javascript/zen_coding.js"
 */
var zen_editor = (function(){
	/** @type {editors.activeEditor} */
	var editor;
	
	/**
	 * Returns whitrespace padding of string
	 * @param {String} str String line
	 * @return {String}
	 */
	function getStringPadding(str) {
		return (str.match(/^(\s+)/) || [''])[0];
	}
	
	/**
	 * Returns editor's content
	 * @return {String}
	 */
	function getContent() {
		return editor.source;
	}
	
	/**
	 * Get the type of the partition based on the current offset
	 * @param {Number} offset
	 * @return {String}
	 */
	function getPartition(offset){
		var class_name = String(editor.textEditor.getClass());
		if (class_name.toLowerCase().indexOf('xsleditor') != -1)
			return 'text/xsl';
			
		try {
			var fileContext = editor.textEditor.getFileContext();
	
			if (fileContext !== null && fileContext !== undefined) {
				var partition = fileContext.getPartitionAtOffset(offset);
				return String(partition.getType());
			}
		} catch(e) {}
	
		return null;
	}
	
	/**
	 * Returns current editor type ('css', 'html', etc)
	 * @return {String|null}
	 */
	function getEditorType() {
		var content_types = {
			'text/html':  'html',
			'text/xml' :  'xml',
			'text/css' :  'css',
			'text/xsl' :  'xsl'
		};
		
		return content_types[getPartition(editor.currentOffset)];
	}
	
	/**
	 * @return {LexemeList}
	 */
	function getLexemeList() {
		var result = null;
		var fileContext = getFileContext();
		
		if (fileContext !== null && fileContext !== undefined) {
			result = fileContext.getLexemeList();
		}
		
		return result;
	}
	
	/**
	 * @return {FileContext}
	 */
	function getFileContext() {
		var result = null;
		
		try	{
			result = editor.textEditor.getFileContext();
		} catch(e) {}
		
		return result;
	}
	
	/**
	 * Return lexeme from position
	 * @param {Number} pos Position where to get lexeme
	 * @return {Object}
	 */
	function getLexemeFromPosition(pos){
		var lexemeList = getLexemeList(), lx;
		if (lexemeList != null && lexemeList.size() > 0){
			for (var i = 0; i < lexemeList.size(); i++){
				lx = lexemeList.get(i);
				if(lx.getStartingOffset() <= pos && lx.getEndingOffset() >= pos){
					return lx;
				}
			}
		}
	
		return null;
	}
	
	return {
		/**
		 * Depreacted name of <code>setContext</code> method
		 * @deprecated
		 * @alias zen_editor#setContext
		 * @param {Object} obj Context editor
		 */
		setTarget: function(obj) {
			this.setContext(obj);
		},
		
		/**
		 * Setup underlying editor context. You should call this method 
		 * <code>before</code> using any Zen Coding action.
		 * @param {editors.activeEditor} context
		 */
		setContext: function(context) {
			editor = context;
			zen_coding.setNewline(editor.lineDelimiter);
		},
		
		/**
		 * Returns character indexes of selected text: object with <code>start</code>
		 * and <code>end</code> properties
		 * @return {Object}
		 * @example
		 * var selection = zen_editor.getSelectionRange();
		 * alert(selection.start + ', ' + selection.end); 
		 */
		getSelectionRange: function() {
			return {
				start: editor.selectionRange.startingOffset,
				end: editor.selectionRange.endingOffset
			};
		},
		
		/**
		 * Creates selection from <code>start</code> to <code>end</code> character
		 * indexes. If <code>end</code> is ommited, this method should place caret 
		 * and <code>start</code> index
		 * @param {Number} start
		 * @param {Number} [end]
		 * @example
		 * zen_editor.createSelection(10, 40);
		 * 
		 * //move caret to 15th character
		 * zen_editor.createSelection(15);
		 */
		createSelection: function(start, end) {
			if (arguments.length == 1)
				end = start;
			
			editor.selectAndReveal(start, end - start);
		},
		
		/**
		 * Returns current line's start and end indexes and object with <code>start</code>
		 * and <code>end</code> properties
		 * @return {Object}
		 * @example
		 * var range = zen_editor.getCurrentLineRange();
		 * alert(range.start + ', ' + range.end);
		 */
		getCurrentLineRange: function() {
			var range = this.getSelectionRange(),
				cur_line_num = editor.getLineAtOffset(range.start);
			
			return {
				start: editor.getOffsetAtLine(cur_line_num), 
				end: editor.getOffsetAtLine(cur_line_num + 1) - zen_coding.getNewline().length
			};
		},
		
		/**
		 * Returns current caret position
		 * @return {Number|null}
		 */
		getCaretPos: function(){
			return editor.currentOffset;
		},
		
		/**
		 * Set new caret position
		 */
		setCaretPos: function(pos){
			editor.currentOffset = pos;
		},
		
		/**
		 * Returns content of current line
		 * @return {String}
		 */
		getCurrentLine: function() {
			var range = this.getCurrentLineRange();
			return this.getContent().substring(range.start, range.end);
		},
		
		/**
		 * Replace editor's content or it's part (from <code>start</code> to 
		 * <code>end</code> index). If <code>value</code> contains 
		 * <code>caret_placeholder</code>, the editor will put caret into 
		 * this position. If you skip <code>start</code> and <code>end</code>
		 * arguments, the whole target's content will be replaced with 
		 * <code>value</code>. 
		 * 
		 * If you pass <code>start</code> argument only,
		 * the <code>value</code> will be placed at <code>start</code> string 
		 * index of current content. 
		 * 
		 * If you pass <code>start</code> and <code>end</code> arguments,
		 * the corresponding substring of current target's content will be 
		 * replaced with <code>value</code>. 
		 * @param {String} value Content you want to paste
		 * @param {Number} [start] Start index of editor's content
		 * @param {Number} [end] End index of editor's content
		 */
		replaceContent: function(value, start, end) {
			var content = this.getContent(),
				caret_pos = this.getCaretPos(),
				has_start = typeof(start) !== 'undefined',
				has_end = typeof(end) !== 'undefined',
				caret_placeholder = zen_coding.getCaretPlaceholder();
				
			// indent new value
			value = zen_coding.padString(value, getStringPadding(this.getCurrentLine()));
			
			// find new caret position
			var new_pos = value.indexOf(caret_placeholder);
			if (new_pos != -1) {
				caret_pos = (start || 0) + new_pos;
				value = value.split(caret_placeholder).join('');
			} else {
				caret_pos += value.length;
			}
			
//			editor.beginCompoundChange();
			try {
				if (has_start && has_end) {
					editor.applyEdit(start, end - start, value);
				} else if (has_start) {
					editor.applyEdit(start, 0, value);
				} else {
					editor.applyEdit(0, content.length, value);
				}
				
				this.setCaretPos(caret_pos);
			} catch(e){}
//			editor.endCompoundChange();
		},
		
		/**
		 * Returns editor's content
		 * @return {String}
		 */
		getContent: getContent,
		
		/**
		 * Returns current editpr's syntax mode
		 * @return {String}
		 */
		getSyntax: function(){
			return getEditorType() || 'html';
		},
		
		/**
		 * Returns current output profile name (@see zen_coding#setupProfile)
		 * @return {String}
		 */
		getProfileName: function() {
			switch(getEditorType()) {
				 case 'xml':
				 case 'xsl':
				 	return 'xml';
				 case 'html':
				 	// html or xhtml?
				 	return getContent().search(/<!DOCTYPE[^>]+XHTML.+?>/) != -1 
				 		? 'xhtml'
				 		: 'html';
			}
			
			return 'html';
		}
	};
})();