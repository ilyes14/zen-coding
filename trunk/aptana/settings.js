/**
 * Zen Coding settings
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */var zen_settings = {
	
	/** Inner element indentation */
	indentation: '\t',     // TODO take from Aptana settings
	
	html: {
		snippets: {
			'cc:ie6': '<!--[if lte IE 6]>\n\t${child}|\n<![endif]-->',
			'script:src': '<script type="text/javascript" src="|"></script>'
		},
		
		/** 
		 * Default attributes and values that will be added to the element 
		 */
		default_attributes: {
			a: {
				href: ''
			},
			img: {
				src: ''
			},
			style: {
				type: 'text/css'
			},
			script: {
				type: 'text/javascript'
			},
			link: {
				rel: 'stylesheet',
				href: ''
			}
		},
		
		short_names: {
			bq: 'blockquote'
		},
		
		/**
		 * Expanded patterns (ends with +) 
		 */
		expandos: {
			dl: 'dl>dt+dd',
			table: 'table.data>tr*2>td*2'
		},
		
		empty_elements: "area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed",
		
		block_elements: "address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,link,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul,h1,h2,h3,h4,h5,h6",
		
		inline_elements: "a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var"
	}
};