(function(){
/**
 * Zen Coding settings
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */
var zen_settings = {
	/** 
	 * Variables that can be placed inside snippets or abbreviations as ${variable}
	 * ${child} variable is reserved, don't use it 
	 */
	'variables': {
		'lang': 'en',
		'locale': 'en-US',
		'charset': 'UTF-8',
		'profile': 'xhtml',
		
		/** Inner element indentation */
		'indentation': '\t'     // TODO take from Aptana settings
	},
	
	'css': {
		'snippets': {
			"@i": "@import url(|);",
			"@m": "@media print {\n\t|\n}",
			"@f": "@font-face {\n\tfont-family:|;\n\tsrc:url(|);\n}",
			"!": "!important",
			"pos": "position:|;",
			"pos:s": "position:static;",
			"pos:a": "position:absolute;",
			"pos:r": "position:relative;",
			"pos:f": "position:fixed;",
			"t": "top:|;",
			"t:a": "top:auto;",
			"r": "right:|;",
			"r:a": "right:auto;",
			"b": "bottom:|;",
			"b:a": "bottom:auto;",
			"l": "left:|;",
			"l:a": "left:auto;",
			"z": "z-index:|;",
			"z:a": "z-index:auto;",
			"fl": "float:|;",
			"fl:n": "float:none;",
			"fl:l": "float:left;",
			"fl:r": "float:right;",
			"cl": "clear:|;",
			"cl:n": "clear:none;",
			"cl:l": "clear:left;",
			"cl:r": "clear:right;",
			"cl:b": "clear:both;",
			"d": "display:|;",
			"d:n": "display:none;",
			"d:b": "display:block;",
			"d:ib": "display:inline;",
			"d:li": "display:list-item;",
			"d:ri": "display:run-in;",
			"d:cp": "display:compact;",
			"d:tb": "display:table;",
			"d:itb": "display:inline-table;",
			"d:tbcp": "display:table-caption;",
			"d:tbcl": "display:table-column;",
			"d:tbclg": "display:table-column-group;",
			"d:tbhg": "display:table-header-group;",
			"d:tbfg": "display:table-footer-group;",
			"d:tbr": "display:table-row;",
			"d:tbrg": "display:table-row-group;",
			"d:tbc": "display:table-cell;",
			"d:rb": "display:ruby;",
			"d:rbb": "display:ruby-base;",
			"d:rbbg": "display:ruby-base-group;",
			"d:rbt": "display:ruby-text;",
			"d:rbtg": "display:ruby-text-group;",
			"v": "visibility:|;",
			"v:v": "visibility:visible;",
			"v:h": "visibility:hidden;",
			"v:c": "visibility:collapse;",
			"ov": "overflow:|;",
			"ov:v": "overflow:visible;",
			"ov:h": "overflow:hidden;",
			"ov:s": "overflow:scroll;",
			"ov:a": "overflow:auto;",
			"ovx": "overflow-x:|;",
			"ovx:v": "overflow-x:visible;",
			"ovx:h": "overflow-x:hidden;",
			"ovx:s": "overflow-x:scroll;",
			"ovx:a": "overflow-x:auto;",
			"ovy": "overflow-y:|;",
			"ovy:v": "overflow-y:visible;",
			"ovy:h": "overflow-y:hidden;",
			"ovy:s": "overflow-y:scroll;",
			"ovy:a": "overflow-y:auto;",
			"ovs": "overflow-style:|;",
			"ovs:a": "overflow-style:auto;",
			"ovs:s": "overflow-style:scrollbar;",
			"ovs:p": "overflow-style:panner;",
			"ovs:m": "overflow-style:move;",
			"ovs:mq": "overflow-style:marquee;",
			"zoo": "zoom:1;",
			"cp": "clip:|;",
			"cp:a": "clip:auto;",
			"cp:r": "clip:rect(|);",
			"bxz": "box-sizing:|;",
			"bxz:cb": "box-sizing:content-box;",
			"bxz:bb": "box-sizing:border-box;",
			"bxsh": "box-shadow:|;",
			"bxsh:n": "box-shadow:none;",
			"bxsh:w": "-webkit-box-shadow:0 0 0 #000;",
			"bxsh:m": "-moz-box-shadow:0 0 0 0 #000;",
			"m": "margin:|;",
			"m:a": "margin:auto;",
			"m:0": "margin:0;",
			"m:2": "margin:0 0;",
			"m:3": "margin:0 0 0;",
			"m:4": "margin:0 0 0 0;",
			"mt": "margin-top:|;",
			"mt:a": "margin-top:auto;",
			"mr": "margin-right:|;",
			"mr:a": "margin-right:auto;",
			"mb": "margin-bottom:|;",
			"mb:a": "margin-bottom:auto;",
			"ml": "margin-left:|;",
			"ml:a": "margin-left:auto;",
			"p": "padding:|;",
			"p:0": "padding:0;",
			"p:2": "padding:0 0;",
			"p:3": "padding:0 0 0;",
			"p:4": "padding:0 0 0 0;",
			"pt": "padding-top:|;",
			"pr": "padding-right:|;",
			"pb": "padding-bottom:|;",
			"pl": "padding-left:|;",
			"w": "width:|;",
			"w:a": "width:auto;",
			"h": "height:|;",
			"h:a": "height:auto;",
			"maw": "max-width:|;",
			"maw:n": "max-width:none;",
			"mah": "max-height:|;",
			"mah:n": "max-height:none;",
			"miw": "min-width:|;",
			"mih": "min-height:|;",
			"o": "outline:|;",
			"o:n": "outline:none;",
			"oo": "outline-offset:|;",
			"ow": "outline-width:|;",
			"os": "outline-style:|;",
			"oc": "outline-color:#000;",
			"oc:i": "outline-color:invert;",
			"bd": "border:|;",
			"bd+": "border:1px solid #000;",
			"bd:n": "border:none;",
			"bdbk": "border-break:|;",
			"bdbk:c": "border-break:close;",
			"bdcl": "border-collapse:|;",
			"bdcl:c": "border-collapse:collapse;",
			"bdcl:s": "border-collapse:separate;",
			"bdc": "border-color:#000;",
			"bdi": "border-image:url(|);",
			"bdi:n": "border-image:none;",
			"bdi:w": "-webkit-border-image:url(|) 0 0 0 0 stretch stretch;",
			"bdi:m": "-moz-border-image:url(|) 0 0 0 0 stretch stretch;",
			"bdti": "border-top-image:url(|);",
			"bdti:n": "border-top-image:none;",
			"bdri": "border-right-image:url(|);",
			"bdri:n": "border-right-image:none;",
			"bdbi": "border-bottom-image:url(|);",
			"bdbi:n": "border-bottom-image:none;",
			"bdli": "border-left-image:url(|);",
			"bdli:n": "border-left-image:none;",
			"bdci": "border-corner-image:url(|);",
			"bdci:n": "border-corner-image:none;",
			"bdci:c": "border-corner-image:continue;",
			"bdtli": "border-top-left-image:url(|);",
			"bdtli:n": "border-top-left-image:none;",
			"bdtli:c": "border-top-left-image:continue;",
			"bdtri": "border-top-right-image:url(|);",
			"bdtri:n": "border-top-right-image:none;",
			"bdtri:c": "border-top-right-image:continue;",
			"bdbri": "border-bottom-right-image:url(|);",
			"bdbri:n": "border-bottom-right-image:none;",
			"bdbri:c": "border-bottom-right-image:continue;",
			"bdbli": "border-bottom-left-image:url(|);",
			"bdbli:n": "border-bottom-left-image:none;",
			"bdbli:c": "border-bottom-left-image:continue;",
			"bdf": "border-fit:|;",
			"bdf:c": "border-fit:clip;",
			"bdf:r": "border-fit:repeat;",
			"bdf:sc": "border-fit:scale;",
			"bdf:st": "border-fit:stretch;",
			"bdf:ow": "border-fit:overwrite;",
			"bdf:of": "border-fit:overflow;",
			"bdf:sp": "border-fit:space;",
			"bdl": "border-length:|;",
			"bdl:a": "border-length:auto;",
			"bdsp": "border-spacing:|;",
			"bds": "border-style:|;",
			"bds:n": "border-style:none;",
			"bds:h": "border-style:hidden;",
			"bds:dt": "border-style:dotted;",
			"bds:ds": "border-style:dashed;",
			"bds:s": "border-style:solid;",
			"bds:db": "border-style:double;",
			"bds:dtds": "border-style:dot-dash;",
			"bds:dtdtds": "border-style:dot-dot-dash;",
			"bds:w": "border-style:wave;",
			"bds:g": "border-style:groove;",
			"bds:r": "border-style:ridge;",
			"bds:i": "border-style:inset;",
			"bds:o": "border-style:outset;",
			"bdw": "border-width:|;",
			"bdt": "border-top:|;",
			"bdt+": "border-top:1px solid #000;",
			"bdt:n": "border-top:none;",
			"bdtw": "border-top-width:|;",
			"bdts": "border-top-style:|;",
			"bdts:n": "border-top-style:none;",
			"bdtc": "border-top-color:#000;",
			"bdr": "border-right:|;",
			"bdr+": "border-right:1px solid #000;",
			"bdr:n": "border-right:none;",
			"bdrw": "border-right-width:|;",
			"bdrs": "border-right-style:|;",
			"bdrs:n": "border-right-style:none;",
			"bdrc": "border-right-color:#000;",
			"bdb": "border-bottom:|;",
			"bdb+": "border-bottom:1px solid #000;",
			"bdb:n": "border-bottom:none;",
			"bdbw": "border-bottom-width:|;",
			"bdbs": "border-bottom-style:|;",
			"bdbs:n": "border-bottom-style:none;",
			"bdbc": "border-bottom-color:#000;",
			"bdl": "border-left:|;",
			"bdl+": "border-left:1px solid #000;",
			"bdl:n": "border-left:none;",
			"bdlw": "border-left-width:|;",
			"bdls": "border-left-style:|;",
			"bdls:n": "border-left-style:none;",
			"bdlc": "border-left-color:#000;",
			"bdrs": "border-radius:|;",
			"bdtrrs": "border-top-right-radius:|;",
			"bdtlrs": "border-top-left-radius:|;",
			"bdbrrs": "border-bottom-right-radius:|;",
			"bdblrs": "border-bottom-left-radius:|;",
			"bg": "background:|;",
			"bg+": "background:#FFF url(|) 0 0 no-repeat;",
			"bg:n": "background:none;",
			"bg:ie": "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='|x.png');",
			"bgc": "background-color:#FFF;",
			"bgi": "background-image:url(|);",
			"bgi:n": "background-image:none;",
			"bgr": "background-repeat:|;",
			"bgr:n": "background-repeat:no-repeat;",
			"bgr:x": "background-repeat:repeat-x;",
			"bgr:y": "background-repeat:repeat-y;",
			"bga": "background-attachment:|;",
			"bga:f": "background-attachment:fixed;",
			"bga:s": "background-attachment:scroll;",
			"bgp": "background-position:0 0;",
			"bgpx": "background-position-x:|;",
			"bgpy": "background-position-y:|;",
			"bgbk": "background-break:|;",
			"bgbk:bb": "background-break:bounding-box;",
			"bgbk:eb": "background-break:each-box;",
			"bgbk:c": "background-break:continuous;",
			"bgcp": "background-clip:|;",
			"bgcp:bb": "background-clip:border-box;",
			"bgcp:pb": "background-clip:padding-box;",
			"bgcp:cb": "background-clip:content-box;",
			"bgcp:nc": "background-clip:no-clip;",
			"bgo": "background-origin:|;",
			"bgo:pb": "background-origin:padding-box;",
			"bgo:bb": "background-origin:border-box;",
			"bgo:cb": "background-origin:content-box;",
			"bgz": "background-size:|;",
			"bgz:a": "background-size:auto;",
			"bgz:ct": "background-size:contain;",
			"bgz:cv": "background-size:cover;",
			"c": "color:#000;",
			"tbl": "table-layout:|;",
			"tbl:a": "table-layout:auto;",
			"tbl:f": "table-layout:fixed;",
			"cps": "caption-side:|;",
			"cps:t": "caption-side:top;",
			"cps:b": "caption-side:bottom;",
			"ec": "empty-cells:|;",
			"ec:s": "empty-cells:show;",
			"ec:h": "empty-cells:hide;",
			"lis": "list-style:|;",
			"lis:n": "list-style:none;",
			"lisp": "list-style-position:|;",
			"lisp:i": "list-style-position:inside;",
			"lisp:o": "list-style-position:outside;",
			"list": "list-style-type:|;",
			"list:n": "list-style-type:none;",
			"list:d": "list-style-type:disc;",
			"list:c": "list-style-type:circle;",
			"list:s": "list-style-type:square;",
			"list:dc": "list-style-type:decimal;",
			"list:dclz": "list-style-type:decimal-leading-zero;",
			"list:lr": "list-style-type:lower-roman;",
			"list:ur": "list-style-type:upper-roman;",
			"lisi": "list-style-image:|;",
			"lisi:n": "list-style-image:none;",
			"q": "quotes:|;",
			"q:n": "quotes:none;",
			"q:ru": "quotes:'\00AB' '\00BB' '\201E' '\201C';",
			"q:en": "quotes:'\201C' '\201D' '\2018' '\2019';",
			"ct": "content:|;",
			"ct:n": "content:normal;",
			"ct:oq": "content:open-quote;",
			"ct:noq": "content:no-open-quote;",
			"ct:cq": "content:close-quote;",
			"ct:ncq": "content:no-close-quote;",
			"ct:a": "content:attr(|);",
			"ct:c": "content:counter(|);",
			"ct:cs": "content:counters(|);",
			"coi": "counter-increment:|;",
			"cor": "counter-reset:|;",
			"va": "vertical-align:|;",
			"va:sup": "vertical-align:super;",
			"va:t": "vertical-align:top;",
			"va:tt": "vertical-align:text-top;",
			"va:m": "vertical-align:middle;",
			"va:bl": "vertical-align:baseline;",
			"va:b": "vertical-align:bottom;",
			"va:tb": "vertical-align:text-bottom;",
			"va:sub": "vertical-align:sub;",
			"ta": "text-align:|;",
			"ta:l": "text-align:left;",
			"ta:c": "text-align:center;",
			"ta:r": "text-align:right;",
			"tal": "text-align-last:|;",
			"tal:a": "text-align-last:auto;",
			"tal:l": "text-align-last:left;",
			"tal:c": "text-align-last:center;",
			"tal:r": "text-align-last:right;",
			"td": "text-decoration:|;",
			"td:n": "text-decoration:none;",
			"td:u": "text-decoration:underline;",
			"td:o": "text-decoration:overline;",
			"td:l": "text-decoration:line-through;",
			"te": "text-emphasis:|;",
			"te:n": "text-emphasis:none;",
			"te:ac": "text-emphasis:accent;",
			"te:dt": "text-emphasis:dot;",
			"te:c": "text-emphasis:circle;",
			"te:ds": "text-emphasis:disc;",
			"te:b": "text-emphasis:before;",
			"te:a": "text-emphasis:after;",
			"th": "text-height:|;",
			"th:a": "text-height:auto;",
			"th:f": "text-height:font-size;",
			"th:t": "text-height:text-size;",
			"th:m": "text-height:max-size;",
			"ti": "text-indent:|;",
			"ti:-": "text-indent:-9999px;",
			"tj": "text-justify:|;",
			"tj:a": "text-justify:auto;",
			"tj:iw": "text-justify:inter-word;",
			"tj:ii": "text-justify:inter-ideograph;",
			"tj:ic": "text-justify:inter-cluster;",
			"tj:d": "text-justify:distribute;",
			"tj:k": "text-justify:kashida;",
			"tj:t": "text-justify:tibetan;",
			"to": "text-outline:|;",
			"to+": "text-outline:0 0 #000;",
			"to:n": "text-outline:none;",
			"tr": "text-replace:|;",
			"tr:n": "text-replace:none;",
			"tt": "text-transform:|;",
			"tt:n": "text-transform:none;",
			"tt:c": "text-transform:capitalize;",
			"tt:u": "text-transform:uppercase;",
			"tt:l": "text-transform:lowercase;",
			"tw": "text-wrap:|;",
			"tw:n": "text-wrap:normal;",
			"tw:no": "text-wrap:none;",
			"tw:u": "text-wrap:unrestricted;",
			"tw:s": "text-wrap:suppress;",
			"tsh": "text-shadow:|;",
			"tsh+": "text-shadow:0 0 0 #000;",
			"tsh:n": "text-shadow:none;",
			"lh": "line-height:|;",
			"whs": "white-space:|;",
			"whs:n": "white-space:normal;",
			"whs:p": "white-space:pre;",
			"whs:nw": "white-space:nowrap;",
			"whs:pw": "white-space:pre-wrap;",
			"whs:pl": "white-space:pre-line;",
			"whsc": "white-space-collapse:|;",
			"whsc:n": "white-space-collapse:normal;",
			"whsc:k": "white-space-collapse:keep-all;",
			"whsc:l": "white-space-collapse:loose;",
			"whsc:bs": "white-space-collapse:break-strict;",
			"whsc:ba": "white-space-collapse:break-all;",
			"wob": "word-break:|;",
			"wob:n": "word-break:normal;",
			"wob:k": "word-break:keep-all;",
			"wob:l": "word-break:loose;",
			"wob:bs": "word-break:break-strict;",
			"wob:ba": "word-break:break-all;",
			"wos": "word-spacing:|;",
			"wow": "word-wrap:|;",
			"wow:nm": "word-wrap:normal;",
			"wow:n": "word-wrap:none;",
			"wow:u": "word-wrap:unrestricted;",
			"wow:s": "word-wrap:suppress;",
			"lts": "letter-spacing:|;",
			"f": "font:|;",
			"f+": "font:1em Arial,sans-serif;",
			"fw": "font-weight:|;",
			"fw:n": "font-weight:normal;",
			"fw:b": "font-weight:bold;",
			"fw:br": "font-weight:bolder;",
			"fw:lr": "font-weight:lighter;",
			"fs": "font-style:|;",
			"fs:n": "font-style:normal;",
			"fs:i": "font-style:italic;",
			"fs:o": "font-style:oblique;",
			"fv": "font-variant:|;",
			"fv:n": "font-variant:normal;",
			"fv:sc": "font-variant:small-caps;",
			"fz": "font-size:|;",
			"fza": "font-size-adjust:|;",
			"fza:n": "font-size-adjust:none;",
			"ff": "font-family:|;",
			"ff:s": "font-family:serif;",
			"ff:ss": "font-family:sans-serif;",
			"ff:c": "font-family:cursive;",
			"ff:f": "font-family:fantasy;",
			"ff:m": "font-family:monospace;",
			"fef": "font-effect:|;",
			"fef:n": "font-effect:none;",
			"fef:eg": "font-effect:engrave;",
			"fef:eb": "font-effect:emboss;",
			"fef:o": "font-effect:outline;",
			"fem": "font-emphasize:|;",
			"femp": "font-emphasize-position:|;",
			"femp:b": "font-emphasize-position:before;",
			"femp:a": "font-emphasize-position:after;",
			"fems": "font-emphasize-style:|;",
			"fems:n": "font-emphasize-style:none;",
			"fems:ac": "font-emphasize-style:accent;",
			"fems:dt": "font-emphasize-style:dot;",
			"fems:c": "font-emphasize-style:circle;",
			"fems:ds": "font-emphasize-style:disc;",
			"fsm": "font-smooth:|;",
			"fsm:a": "font-smooth:auto;",
			"fsm:n": "font-smooth:never;",
			"fsm:aw": "font-smooth:always;",
			"fst": "font-stretch:|;",
			"fst:n": "font-stretch:normal;",
			"fst:uc": "font-stretch:ultra-condensed;",
			"fst:ec": "font-stretch:extra-condensed;",
			"fst:c": "font-stretch:condensed;",
			"fst:sc": "font-stretch:semi-condensed;",
			"fst:se": "font-stretch:semi-expanded;",
			"fst:e": "font-stretch:expanded;",
			"fst:ee": "font-stretch:extra-expanded;",
			"fst:ue": "font-stretch:ultra-expanded;",
			"op": "opacity:|;",
			"op:ie": "filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=100);",
			"op:ms": "-ms-filter:'progid:DXImageTransform.Microsoft.Alpha(Opacity=100)';",
			"rz": "resize:|;",
			"rz:n": "resize:none;",
			"rz:b": "resize:both;",
			"rz:h": "resize:horizontal;",
			"rz:v": "resize:vertical;",
			"cur": "cursor:|;",
			"cur:a": "cursor:auto;",
			"cur:d": "cursor:default;",
			"cur:c": "cursor:crosshair;",
			"cur:ha": "cursor:hand;",
			"cur:he": "cursor:help;",
			"cur:m": "cursor:move;",
			"cur:p": "cursor:pointer;",
			"cur:t": "cursor:text;",
			"pgbb": "page-break-before:|;",
			"pgbb:au": "page-break-before:auto;",
			"pgbb:al": "page-break-before:always;",
			"pgbb:l": "page-break-before:left;",
			"pgbb:r": "page-break-before:right;",
			"pgbi": "page-break-inside:|;",
			"pgbi:au": "page-break-inside:auto;",
			"pgbi:av": "page-break-inside:avoid;",
			"pgba": "page-break-after:|;",
			"pgba:au": "page-break-after:auto;",
			"pgba:al": "page-break-after:always;",
			"pgba:l": "page-break-after:left;",
			"pgba:r": "page-break-after:right;",
			"orp": "orphans:|;",
			"wid": "widows:|;"
		}
	},
	
	'html': {
		'snippets': {
			'cc:ie6': '<!--[if lte IE 6]>\n\t${child}|\n<![endif]-->',
			'cc:ie': '<!--[if IE]>\n\t${child}|\n<![endif]-->',
			'cc:noie': '<!--[if !IE]><!-->\n\t${child}|\n<!--<![endif]-->',
			'html:4t': '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">\n' +
					'<html lang="${lang}">\n' +
					'<head>\n' +
					'	<title></title>\n' +
					'	<meta http-equiv="Content-Type" content="text/html;charset=${charset}">\n' +
					'</head>\n' +
					'<body>\n\t${child}|\n</body>\n' +
					'</html>',
			
			'html:4s': '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">\n' +
					'<html lang="${lang}">\n' +
					'<head>\n' +
					'	<title></title>\n' +
					'	<meta http-equiv="Content-Type" content="text/html;charset=${charset}">\n' +
					'</head>\n' +
					'<body>\n\t${child}|\n</body>\n' +
					'</html>',
			
			'html:xt': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n' +
					'<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${lang}">\n' +
					'<head>\n' +
					'	<title></title>\n' +
					'	<meta http-equiv="Content-Type" content="text/html;charset=${charset}" />\n' +
					'</head>\n' +
					'<body>\n\t${child}|\n</body>\n' +
					'</html>',
			
			'html:xs': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n' +
					'<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${lang}">\n' +
					'<head>\n' +
					'	<title></title>\n' +
					'	<meta http-equiv="Content-Type" content="text/html;charset=${charset}" />\n' +
					'</head>\n' +
					'<body>\n\t${child}|\n</body>\n' +
					'</html>',
			
			'html:xxs': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">\n' +
					'<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${lang}">\n' +
					'<head>\n' +
					'	<title></title>\n' +
					'	<meta http-equiv="Content-Type" content="text/html;charset=${charset}" />\n' +
					'</head>\n' +
					'<body>\n\t${child}|\n</body>\n' +
					'</html>',
			
			'html:5': '<!DOCTYPE HTML>\n' +
					'<html lang="${locale}">\n' +
					'<head>\n' +
					'	<title></title>\n' +
					'	<meta charset="${charset}">\n' +
					'</head>\n' +
					'<body>\n\t${child}|\n</body>\n' +
					'</html>'
		},
		
		'abbreviations': {
			'a': '<a href=""></a>',
			'a:link': '<a href="http://|"></a>',
			'a:mail': '<a href="mailto:|"></a>',
			'abbr': '<abbr title=""></abbr>',
			'acronym': '<acronym title=""></acronym>',
			'base': '<base href="" />',
			'bdo': '<bdo dir=""></bdo>',
			'bdo:r': '<bdo dir="rtl"></bdo>',
			'bdo:l': '<bdo dir="ltr"></bdo>',
			'link:css': '<link rel="stylesheet" type="text/css" href="|style.css" media="all" />',
			'link:print': '<link rel="stylesheet" type="text/css" href="|print.css" media="print" />',
			'link:favicon': '<link rel="shortcut icon" type="image/x-icon" href="|favicon.ico" />',
			'link:touch': '<link rel="apple-touch-icon" href="|favicon.png" />',
			'link:rss': '<link rel="alternate" type="application/rss+xml" title="RSS" href="|rss.xml" />',
			'link:atom': '<link rel="alternate" type="application/atom+xml" title="Atom" href="atom.xml" />',
			'meta:utf': '<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />',
			'meta:win': '<meta http-equiv="Content-Type" content="text/html;charset=windows-1251" />',
			'meta:compat': '<meta http-equiv="X-UA-Compatible" content="IE=7" />',
			'style': '<style type="text/css"></style>',
			'script': '<script type="text/javascript"></script>',
			'script:src': '<script type="text/javascript" src=""></script>',
			'img': '<img src="" alt="" />',
			'iframe': '<iframe src="" frameborder="0"></iframe>',
			'embed': '<embed src="" type="" />',
			'object': '<object data="" type=""></object>',
			'param': '<param name="" value="" />',
			'map': '<map name=""></map>',
			'area': '<area shape="" coords="" href="" alt="" />',
			'area:d': '<area shape="default" href="" alt="" />',
			'area:c': '<area shape="circle" coords="" href="" alt="" />',
			'area:r': '<area shape="rect" coords="" href="" alt="" />',
			'area:p': '<area shape="poly" coords="" href="" alt="" />',
			'link': '<link rel="stylesheet" href="" />',
			'form': '<form action=""></form>',
			'form:get': '<form action="" method="get"></form>',
			'form:post': '<form action="" method="post"></form>',
			'label': '<label for=""></label>',
			'input': '<input type="" />',
			'input:hidden': '<input type="hidden" name="" />',
			'input:h': '<input type="hidden" name="" />',
			'input:text': '<input type="text" name="" id="" />',
			'input:t': '<input type="text" name="" id="" />',
			'input:search': '<input type="search" name="" id="" />',
			'input:email': '<input type="email" name="" id="" />',
			'input:url': '<input type="url" name="" id="" />',
			'input:password': '<input type="password" name="" id="" />',
			'input:p': '<input type="password" name="" id="" />',
			'input:datetime': '<input type="datetime" name="" id="" />',
			'input:date': '<input type="date" name="" id="" />',
			'input:datetime-local': '<input type="datetime-local" name="" id="" />',
			'input:month': '<input type="month" name="" id="" />',
			'input:week': '<input type="week" name="" id="" />',
			'input:time': '<input type="time" name="" id="" />',
			'input:number': '<input type="number" name="" id="" />',
			'input:color': '<input type="color" name="" id="" />',
			'input:checkbox': '<input type="checkbox" name="" id="" />',
			'input:c': '<input type="checkbox" name="" id="" />',
			'input:radio': '<input type="radio" name="" id="" />',
			'input:r': '<input type="radio" name="" id="" />',
			'input:range': '<input type="range" name="" id="" />',
			'input:file': '<input type="file" name="" id="" />',
			'input:f': '<input type="file" name="" id="" />',
			'input:submit': '<input type="submit" value="" />',
			'input:s': '<input type="submit" value="" />',
			'input:image': '<input type="image" src="" alt="" />',
			'input:i': '<input type="image" src="" alt="" />',
			'input:reset': '<input type="reset" value="" />',
			'input:button': '<input type="button" value="" />',
			'input:b': '<input type="button" value="" />',
			'select': '<select name="" id=""></select>',
			'option': '<option value=""></option>',
			'textarea': '<textarea name="" id="" cols="30" rows="10"></textarea>',
			'menu:context': '<menu type="context"></menu>',
			'menu:c': '<menu type="context"></menu>',
			'menu:toolbar': '<menu type="toolbar"></menu>',
			'menu:t': '<menu type="toolbar"></menu>',
			'video': '<video src=""></video>',
			'audio': '<audio src=""></audio>',
			'html:xml': '<html xmlns="http://www.w3.org/1999/xhtml"></html>',
			'bq': '<blockquote></blockquote>',
			'acr': '<acronym></acronym>',
			'fig': '<figure></figure>',
			'ifr': '<iframe></iframe>',
			'emb': '<embed></embed>',
			'obj': '<object></object>',
			'src': '<source></source>',
			'cap': '<caption></caption>',
			'colg': '<colgroup></colgroup>',
			'fst': '<fieldset></fieldset>',
			'btn': '<button></button>',
			'optg': '<optgroup></optgroup>',
			'opt': '<option></option>',
			'tarea': '<textarea></textarea>',
			'leg': '<legend></legend>',
			'sect': '<section></section>',
			'art': '<article></article>',
			'hdr': '<header></header>',
			'ftr': '<footer></footer>',
			'adr': '<address></address>',
			'dlg': '<dialog></dialog>',
			'str': '<strong></strong>',
			'prog': '<progress></progress>',
			'fset': '<fieldset></fieldset>',
			'datag': '<datagrid></datagrid>',
			'datal': '<datalist></datalist>',
			'kg': '<keygen></keygen>',
			'out': '<output></output>',
			'det': '<details></details>',
			'cmd': '<command></command>',
			
			// expandos
			'ol+': 'ol>li',
			'ul+': 'ul>li',
			'dl+': 'dl>dt+dd',
			'map+': 'map>area',
			'table+': 'table>tr>td',
			'colgroup+': 'colgroup>col',
			'colg+': 'colgroup>col',
			'tr+': 'tr>td',
			'select+': 'select>option',
			'optgroup+': 'optgroup>option',
			'optg+': 'optgroup>option'

		},
		
		'element_types': {
			'empty': 'area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed,keygen,command',
			'block_level': 'address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,link,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul,h1,h2,h3,h4,h5,h6',
			'inline_level': 'a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var'
		}
	},
	
	'xsl': {
		'extends': 'html', 
		'abbreviations': {
			'tm': '<xsl:template match="" mode=""></xsl:template>',
			'tmatch': 'tm',
			'tn': '<xsl:template name=""></xsl:template>',
			'tname': 'tn',
			'xsl:when': '<xsl:when test=""></xsl:when>',
			'wh': 'xsl:when',
			'var': '<xsl:variable name="">|</xsl:variable>',
			'vare': '<xsl:variable name="" select=""/>',
			'if': '<xsl:if test=""></xsl:if>',
			'call': '<xsl:call-template name=""/>',
			'attr': '<xsl:attribute name=""></xsl:attribute>',
			'wp': '<xsl:with-param name="" select=""/>',
			'par': '<xsl:param name="" select=""/>',
			'val': '<xsl:value-of select=""/>',
			'co': '<xsl:copy-of select=""/>',
			'each': '<xsl:for-each select=""></xsl:for-each>',
			'ap': '<xsl:apply-templates select="" mode=""/>',
			
			//expandos
			'choose+': 'xsl:choose>xsl:when+xsl:otherwise'
		}
	}
};/**
 * High-level editor interface which communicates with other editor (like 
 * TinyMCE, CKEditor, etc.) or browser.
 * Before using any of editor's methods you should initialize it with
 * <code>editor.setTarget(elem)</code> method and pass reference to 
 * &lt;textarea&gt; element.
 * @example
 * var textarea = document.getElemenetsByTagName('textarea')[0];
 * editor.setTarget(textarea);
 * //now you are ready to use editor object
 * editor.getSelectionRange() 
 * 
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 * @include "../../aptana/lib/zen_coding.js"
 */
var zen_editor = (function(){
	/** @param {Element} Source element */
	var target = null,
		/** Textual placeholder that identifies cursor position in pasted text */
		caret_placeholder = '|';
	
		
	// different browser uses different newlines, so we have to figure out
	// native browser newline and sanitize incoming text with them
	var tx = document.createElement('textarea');
	tx.value = '\n';
	zen_coding.setNewline(tx.value);
	tx = null;
	
	/**
	 * Returns content of current target element
	 */
	function getContent() {
		return target.value || '';
	}
	
	/**
	 * Returns selection indexes from element
	 */
	function getSelectionRange() {
		if ('selectionStart' in target) { // W3C's DOM
			var length = target.selectionEnd - target.selectionStart;
			return {
				start: target.selectionStart, 
				end: target.selectionEnd 
			};
		} else if (document.selection) { // IE
			target.focus();
	 
			var range = document.selection.createRange();
			
			if (range === null) {
				return {
					start: 0, 
					end: getContent().length
				};
			}
	 
			var re = target.createTextRange();
			var rc = re.duplicate();
			re.moveToBookmark(range.getBookmark());
			rc.setEndPoint('EndToStart', re);
	 
			return {
				start: rc.text.length, 
				end: rc.text.length + range.text.length
			};
		} else {
			return null;
		}
	}
	
	/**
	 * Creates text selection on target element
	 * @param {Number} start
	 * @param {Number} end
	 */
	function createSelection(start, end) {
		// W3C's DOM
		if (typeof(end) == 'undefined')
			end = start;
			
		if ('setSelectionRange' in target) {
			target.setSelectionRange(start, end);
		} else if ('createTextRange' in target) {
			var t = target.createTextRange();
			
			t.collapse(true);
			var delta = zen_coding.splitByLines(getContent().substring(0, start)).length - 1;
			
			// IE has an issue with handling newlines while creating selection,
			// so we need to adjust start and end indexes
			end -= delta + zen_coding.splitByLines(getContent().substring(start, end)).length - 1;
			start -= delta;
			
			t.moveStart('character', start);
			t.moveEnd('character', end - start);
			t.select();
		}
	}
	
	/**
	 * Find start and end index of text line for <code>from</code> index
	 * @param {String} text 
	 * @param {Number} from 
	 */
	function findNewlineBounds(text, from) {
		var len = text.length,
			start = 0,
			end = len - 1;
		
		// search left
		for (var i = from - 1; i > 0; i--) {
			var ch = text.charAt(i);
			if (ch == '\n' || ch == '\r') {
				start = i + 1;
				break;
			}
		}
		// search right
		for (var j = from; j < len; j++) {
			var ch = text.charAt(j);
			if (ch == '\n' || ch == '\r') {
				end = j;
				break;
			}
		}
		
		return {start: start, end: end};
	}
	
	/**
	 * Returns current caret position
	 */
	function getCaretPos() {
		var selection = getSelectionRange();
		return selection ? selection.start : null;
	}
	
	/**
	 * Returns whitrespace padding of string
	 * @param {String} str String line
	 * @return {String}
	 */
	function getStringPadding(str) {
		return (str.match(/^(\s+)/) || [''])[0];
	}
	
	return {
		setTarget: function(elem) {
			target = elem;
		},
		
		getSelectionRange: getSelectionRange,
		createSelection: createSelection,
		
		/**
		 * Returns current line's start and end indexes
		 */
		getCurrentLineRange: function() {
			var caret_pos = getCaretPos(),
				content = getContent();
			if (caret_pos === null) return null;
			
			return findNewlineBounds(content, caret_pos);
		},
		
		/**
		 * Returns current caret position
		 * @return {Number}
		 */
		getCaretPos: getCaretPos,
		
		/**
		 * Returns content of current line
		 * @return {String}
		 */
		getCurrentLine: function() {
			var range = this.getCurrentLineRange();
			return range.start < range.end ? this.getContent().substring(range.start, range.end) : '';
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
			var content = getContent(),
				caret_pos = getCaretPos(),
				has_start = typeof(start) !== 'undefined',
				has_end = typeof(end) !== 'undefined';
				
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
			
			try {
				if (has_start && has_end) {
					content = content.substring(0, start) + value + content.substring(end);
				} else if (has_start) {
					content = content.substring(0, start) + value + content.substring(start);
				}
				
				target.value = content;
				createSelection(caret_pos, caret_pos);
			} catch(e){}
		},
		
		/**
		 * Returns editor's content
		 * @return {String}
		 */
		getContent: getContent
	}
})();
 /**
 * Middleware layer that communicates between editor and Zen Coding.
 * This layer describes all available Zen Coding actions, like 
 * "Expand Abbreviation".
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 * 
 * @include "editor.js"
 * @include "../../aptana/lib/html_matcher.js"
 * @include "../../aptana/lib/zen_coding.js"
 */

/**
 * Search for abbreviation in editor from current caret position
 * @param {zen_editor} editor Editor instance
 * @return {String|null}
 */
function findAbbreviation(editor) {
	var range = editor.getSelectionRange();
	if (range.start != range.end) {
		// abbreviation is selected by user
		return editor.getContent().substring(range.start, range.end);
	}
	
	// search for new abbreviation from current caret position
	var cur_line = editor.getCurrentLineRange();
	return zen_coding.extractAbbreviation(editor.getContent().substring(cur_line.start, range.start));
}

/**
 * Find from current caret position and expand abbreviation in editor
 * @param {zen_editor} editor Editor instance
 * @param {String} type Syntax type (html, css, etc.)
 * @param {String} profile_name Output profile name (html, xml, xhtml)
 * @return {Boolean} Returns <code>true</code> if abbreviation was expanded 
 * successfully
 */
function expandAbbreviation(editor, type, profile_name) {
	profile_name = profile_name || 'xhtml';
	
	var caret_pos = editor.getSelectionRange().end,
		abbr,
		content = '';
		
	if ( (abbr = findAbbreviation(editor)) ) {
		content = zen_coding.expandAbbreviation(abbr, type, profile_name);
		if (content) {
			editor.replaceContent(content, caret_pos - abbr.length, caret_pos);
			return true;
		}
	}
	
	return false;
}

/**
 * A special version of <code>expandAbbreviation</code> function: if it can't
 * find abbreviation, it will place Tab character at caret position
 * @param {zen_editor} editor Editor instance
 * @param {String} type Syntax type (html, css, etc.)
 * @param {String} profile_name Output profile name (html, xml, xhtml)
 */
function expandAbbreviationWithTab(editor, type, profile_name) {
	if (!expandAbbreviation(editor, type, profile_name))
		editor.replaceContent('\t', editor.getCaretPos());
}

/**
 * Find and select HTML tag pair
 * @param {zen_editor} editor Editor instance
 * @param {String} [direction] Direction of pair matching: 'in' or 'out'. 
 * Default is 'out'
 */
function matchPair(editor, direction) {
	direction = (direction || 'out').toLowerCase();
	
	var range = editor.getSelectionRange(),
		cursor = range.end,
		range_start = range.start, 
		range_end = range.end,
//		content = zen_coding.splitByLines(editor.getContent()).join('\n'),
		content = editor.getContent(),
		range = null,
		_r,
	
		old_open_tag = HTMLPairMatcher.last_match['opening_tag'],
		old_close_tag = HTMLPairMatcher.last_match['closing_tag'];
		
	if (direction == 'in' && old_open_tag && range_start != range_end) {
//		user has previously selected tag and wants to move inward
		if (!old_close_tag) {
//			unary tag was selected, can't move inward
			return false;
		} else if (old_open_tag.start == range_start) {
			if (content[old_open_tag.end] == '<') {
//				test if the first inward tag matches the entire parent tag's content
				_r = HTMLPairMatcher.find(content, old_open_tag.end + 1);
				if (_r[0] == old_open_tag.end && _r[1] == old_close_tag.start) {
					range = HTMLPairMatcher(content, old_open_tag.end + 1);
				} else {
					range = [old_open_tag.end, old_close_tag.start];
				}
			} else {
				range = [old_open_tag.end, old_close_tag.start];
			}
		} else {
			var new_cursor = content.substring(0, old_close_tag.start).indexOf('<', old_open_tag.end);
			var search_pos = new_cursor != -1 ? new_cursor + 1 : old_open_tag.end;
			range = HTMLPairMatcher(content, search_pos);
		}
	} else {
		range = HTMLPairMatcher(content, cursor);
	}
	
	if (range !== null && range[0] != -1) {
//		alert(range[0] + ', '+ range[1]);
		editor.createSelection(range[0], range[1]);
		return true;
	} else {
		return false;
	}
}

/**
 * Wraps content with abbreviation
 * @param {zen_editor} Editor instance
 * @param {String} type Syntax type (html, css, etc.)
 * @param {String} profile_name Output profile name (html, xml, xhtml)
 */
function wrapWithAbbreviation(editor, abbr, type, profile_name) {
	profile_name = profile_name || 'xhtml';
	
	var range = editor.getSelectionRange(),
		start_offset = range.start,
		end_offset = range.end,
		content = editor.getContent();
		
		
	if (!abbr)
		return null; 
	
	if (start_offset == end_offset) {
		// no selection, find tag pair
		range = HTMLPairMatcher(content, start_offset);
		
		if (!range || range[0] == -1) // nothing to wrap
			return null;
			
		start_offset = range[0];
		end_offset = range[1];
			
		// narrow down selection until first non-space character
		var re_space = /\s|\n|\r/;
		function isSpace(ch) {
			return re_space.test(ch);
		}
		
		while (start_offset < end_offset) {
			if (!isSpace(content.charAt(start_offset)))
				break;
				
			start_offset++;
		}
		
		while (end_offset > start_offset) {
			end_offset--;
			if (!isSpace(content.charAt(end_offset))) {
				end_offset++;
				break;
			}
		}
			
	}
	
	var new_content = content.substring(start_offset, end_offset),
		result = zen_coding.wrapWithAbbreviation(abbr, unindent(editor, new_content), type, profile_name);
	
	if (result) {
		editor.createSelection(end_offset);
		editor.replaceContent(result, start_offset, end_offset);
	}
}

/**
 * Unindent content, thus preparing text for tag wrapping
 * @param {zen_editor} Editor instance
 * @param {String} text
 * @return {String}
 */
function unindent(editor, text) {
	var pad = getCurrentLinePadding(editor);
	var lines = zen_coding.splitByLines(text);
	for (var i = 0; i < lines.length; i++) {
		if (lines[i].search(pad) == 0)
			lines[i] = lines[i].substr(pad.length);
	}
	
	return lines.join(zen_coding.getNewline());
}

/**
 * Returns padding of current editor's line
 * @param {zen_editor} Editor instance
 * @return {String}
 */
function getCurrentLinePadding(editor) {
	return (editor.getCurrentLine().match(/^(\s+)/) || [''])[0];
}

/**
 * Search for new caret insertion point
 * @param {zen_editor} editor Editor instance
 * @param {Number} Search increment: -1 — search left, 1 — search right
 * @param {Number} Initial offset relative to current caret position
 * @return {Number} Returns -1 if insertion point wasn't found
 */
function findNewEditPoint(editor, inc, offset) {
	inc = inc || 1;
	offset = offset || 0;
	var cur_point = editor.getCaretPos() + offset,
		content = editor.getContent(),
		max_len = content.length,
		next_point = -1,
		re_empty_line = /^\s+$/;
	
	function ch(ix) {
		return content.charAt(ix);
	}
	
	function getLine(ix) {
		var start = ix;
		while (start >= 0) {
			var c = ch(start);
			if (c == '\n' || c == '\r')
				break;
			start--;
		}
		
		return content.substring(start, ix);
	}
		
	while (cur_point < max_len && cur_point > 0) {
		cur_point += inc;
		var cur_char = ch(cur_point),
			next_char = ch(cur_point + 1),
			prev_char = ch(cur_point - 1);
			
		switch (cur_char) {
			case '"':
			case '\'':
				if (next_char == cur_char && prev_char == '=') {
					// empty attribute
					next_point = cur_point + 1;
				}
				break;
			case '>':
				if (next_char == '<') {
					// between tags
					next_point = cur_point + 1;
				}
				break;
			case '\n':
			case '\r':
				// empty line
				if (re_empty_line.test(getLine(cur_point - 1))) {
					next_point = cur_point;
				}
				break;
		}
		
		if (next_point != -1)
			break;
	}
	
	return next_point;
}

/**
 * Move caret to previous edit point
 * @param {zen_editor} editor Editor instance
 */
function prevEditPoint(editor) {
	var cur_pos = editor.getCaretPos(),
		new_point = findNewEditPoint(editor, -1);
		
	if (new_point == cur_pos)
		// we're still in the same point, try searching from the other place
		new_point = findNewEditPoint(editor, -1, -2);
	
	if (new_point != -1) 
		editor.createSelection(new_point);
}

/**
 * Move caret to next edit point
 * @param {zen_editor} editor Editor instance
 */
function nextEditPoint(editor) {
	var new_point = findNewEditPoint(editor, 1);
	if (new_point != -1)
		editor.createSelection(new_point);
}

/**
 * Inserts newline character with proper indentation
 * @param {zen_editor} editor Editor instance
 * @param {String} mode Syntax mode (only 'html' is implemented)
 */
function insertFormattedNewline(editor, mode) {
	mode = mode || 'html';
	var pad = getCurrentLinePadding(editor),
		caret_pos = editor.getCaretPos();
		
	function insert_nl() {
		editor.replaceContent('\n', caret_pos);
	}
	
	switch (mode) {
		case 'html':
			// let's see if we're breaking newly created tag
			var pair = HTMLPairMatcher.getTags(editor.getContent(), editor.getCaretPos());
			
			if (pair[0] && pair[1] && pair[0].type == 'tag' && pair[0].end == caret_pos && pair[1].start == caret_pos) {
				editor.replaceContent('\n\t|\n', caret_pos);
			} else {
				insert_nl();
			}
			break;
		default:
			insert_nl();
	}
}

/**
 * Select line under cursor
 * @param {zen_editor} editor Editor instance
 */
function selectLine(editor) {
	var range = editor.getCurrentLineRange();
	editor.createSelection(range.start, range.end);
}/**
 * http://www.openjs.com/scripts/events/keyboard_shortcuts/
 * Version : 2.01.B
 * By Binny V A
 * License : BSD
 */
shortcut = {
	'all_shortcuts':{},//All the shortcuts are stored in this array
	'add': function(shortcut_combination,callback,opt) {
		var is_opera = !!window.opera,
			is_mac = /mac\s+os/i.test(navigator.userAgent);
		
		//Provide a set of default options
		var default_options = {
			'type':is_opera ? 'keypress' : 'keydown',
			'propagate':false,
			'disable_in_input':false,
			'target':document,
			'keycode':false
		}
		if(!opt) opt = default_options;
		else {
			for(var dfo in default_options) {
				if(typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
			}
		}

		var ele = opt.target;
		if(typeof opt.target == 'string') ele = document.getElementById(opt.target);
		var ths = this;
		shortcut_combination = shortcut_combination.toLowerCase();

		//The function to be called at keypress
		var func = function(e) {
			e = e || window.event;
			var code;
			
			if(opt['disable_in_input']) { //Don't enable shortcut keys in Input, Textarea fields
				var element;
				if(e.target) element=e.target;
				else if(e.srcElement) element=e.srcElement;
				if(element.nodeType==3) element=element.parentNode;

				if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
			}
	
			//Find Which key is pressed
			if (e.keyCode) code = e.keyCode;
			else if (e.which) code = e.which;
			var character = String.fromCharCode(code).toLowerCase();
			
			if(code == 188) character=","; //If the user presses , when the type is onkeydown
			if(code == 190) character="."; //If the user presses , when the type is onkeydown

			var keys = shortcut_combination.split("+");
			//Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
			var kp = 0;
			
			//Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
			var shift_nums = {
				"`":"~",
				"1":"!",
				"2":"@",
				"3":"#",
				"4":"$",
				"5":"%",
				"6":"^",
				"7":"&",
				"8":"*",
				"9":"(",
				"0":")",
				"-":"_",
				"=":"+",
				";":":",
				"'":"\"",
				",":"<",
				".":">",
				"/":"?",
				"\\":"|"
			}
			//Special Keys - and their codes
			var special_keys = {
				'esc':27,
				'escape':27,
				'tab':9,
				'space':32,
				'return':13,
				'enter':13,
				'backspace':8,
	
				'scrolllock':145,
				'scroll_lock':145,
				'scroll':145,
				'capslock':20,
				'caps_lock':20,
				'caps':20,
				'numlock':144,
				'num_lock':144,
				'num':144,
				
				'pause':19,
				'break':19,
				
				'insert':45,
				'home':36,
				'delete':46,
				'end':35,
				
				'pageup':33,
				'page_up':33,
				'pu':33,
	
				'pagedown':34,
				'page_down':34,
				'pd':34,
				
				'plus': 187,
				'minus': 189,
	
				'left':37,
				'up':38,
				'right':39,
				'down':40,
	
				'f1':112,
				'f2':113,
				'f3':114,
				'f4':115,
				'f5':116,
				'f6':117,
				'f7':118,
				'f8':119,
				'f9':120,
				'f10':121,
				'f11':122,
				'f12':123
			}
	
			var modifiers = { 
				shift: { wanted:false, pressed:false},
				ctrl : { wanted:false, pressed:false},
				alt  : { wanted:false, pressed:false},
				meta : { wanted:false, pressed:false}	//Meta is Mac specific
			};
                        
			if(e.ctrlKey)	modifiers.ctrl.pressed = true;
			if(e.shiftKey)	modifiers.shift.pressed = true;
			if(e.altKey)	modifiers.alt.pressed = true;
			if(e.metaKey)   modifiers.meta.pressed = true;
            
			var k;
			for(var i=0; k=keys[i], i<keys.length; i++) {
				// Due to stupid Opera bug I have to swap Ctrl and Meta keys
				if (is_mac && is_opera) {
					if (k == 'ctrl' || k == 'control')
						k = 'meta';
					else if (k == 'meta')
						k = 'ctrl';
				} else if (!is_mac && k == 'meta') {
					k = 'ctrl';
				}
				
				//Modifiers
				if(k == 'ctrl' || k == 'control') {
					kp++;
					modifiers.ctrl.wanted = true;

				} else if(k == 'shift') {
					kp++;
					modifiers.shift.wanted = true;

				} else if(k == 'alt') {
					kp++;
					modifiers.alt.wanted = true;
				} else if(k == 'meta') {
					kp++;
					modifiers.meta.wanted = true;
				} else if(k.length > 1) { //If it is a special key
					if(special_keys[k] == code) kp++;
					
				} else if(opt['keycode']) {
					if(opt['keycode'] == code) kp++;

				} else { //The special keys did not match
					if(character == k) kp++;
					else {
						if(shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
							character = shift_nums[character]; 
							if(character == k) kp++;
						}
					}
				}
			}
			
			if(kp == keys.length && 
						modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
						modifiers.shift.pressed == modifiers.shift.wanted &&
						modifiers.alt.pressed == modifiers.alt.wanted &&
						modifiers.meta.pressed == modifiers.meta.wanted) {
				
				var result = callback(e);
	
				if(result !== true && !opt['propagate']) { //Stop the event
					//e.cancelBubble is supported by IE - this will kill the bubbling process.
					e.cancelBubble = true;
					e.returnValue = false;
	
					//e.stopPropagation works in Firefox.
					if (e.stopPropagation) {
						e.stopPropagation();
						e.preventDefault();
					}
					return false;
				}
			}
		}
		this.all_shortcuts[shortcut_combination] = {
			'callback':func, 
			'target':ele, 
			'event': opt['type']
		};
		//Attach the function with the event
		if(ele.addEventListener) ele.addEventListener(opt['type'], func, false);
		else if(ele.attachEvent) ele.attachEvent('on'+opt['type'], func);
		else ele['on'+opt['type']] = func;
	},

	//Remove the shortcut - just specify the shortcut and I will remove the binding
	'remove':function(shortcut_combination) {
		shortcut_combination = shortcut_combination.toLowerCase();
		var binding = this.all_shortcuts[shortcut_combination];
		delete(this.all_shortcuts[shortcut_combination])
		if(!binding) return;
		var type = binding['event'];
		var ele = binding['target'];
		var callback = binding['callback'];

		if(ele.detachEvent) ele.detachEvent('on'+type, callback);
		else if(ele.removeEventListener) ele.removeEventListener(type, callback, false);
		else ele['on'+type] = false;
	}
}/**
 * Editor manager that handles all incoming events and runs Zen Coding actions.
 * This manager is also used for setting up editor preferences
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 * 
 * @include "actions.js"
 * @include "editor.js"
 * @include "shortcut.js"
 */zen_textarea = (function(){ // should be global
	var default_options = {
		profile: 'xhtml',
		syntax: 'html',
		use_tab: false,
		pretty_break: false
	},
	
	mac_char_map = {
		'ctrl': '⌃',
		'control': '⌃',
		'meta': '⌘',
		'shift': '⇧',
		'alt': '⌥',
		'enter': '⏎',
		'tab': '⇥',
		'left': '←',
		'right': '→'
	},
	
	pc_char_map = {
		'left': '←',
		'right': '→'
	},
	
	shortcuts = {},
	is_mac = /mac\s+os/i.test(navigator.userAgent),
	
	/** Zen Coding parameter name/value regexp for getting options from element */
	re_param = /\bzc\-(\w+)\-(\w+)/g;
	
	/** @type {default_options} */
	var options = {};
	
	function copyOptions(opt) {
		opt = opt || {};
		var result = {};
		for (var p in default_options) if (default_options.hasOwnProperty(p)) {
			result[p] = (p in opt) ? opt[p] : default_options[p];
		}
		
		return result;
	}
	
	options = copyOptions();
	
	/**
	 * Makes first letter of string in uppercase
	 * @param {String} str
	 */
	function capitalize(str) {
		return str.charAt().toUpperCase() + str.substring(1);
	}
	
	function humanize(str) {
		return capitalize(str.replace(/_(\w)/g, function(s, p){return ' ' + p.toUpperCase()}));
	}
	
	function formatShortcut(char_map, glue) {
		var result = [];
		if (typeof(glue) == 'undefined')
			glue = '+';
			
		for (var p in shortcuts) if (shortcuts.hasOwnProperty(p)) {
			var keys = p.split('+'),
				ar = [],
				lp = p.toLowerCase();
				
			if (lp == 'tab' || lp == 'enter')
				continue;
				
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i].toLowerCase();
				ar.push(key in char_map ? char_map[key] : capitalize(key));
			}
			
			result.push({
				'keystroke': ar.join(glue), 
				'action_name': humanize(shortcuts[p])
			});
		}
		
		return result;
	}
	
	
	/**
	 * Get Zen Coding options from element's class name
	 * @param {Element} elem
	 */
	function getOptionsFromElement(elem) {
		var param_str = elem.className || '',
			m,
			result = copyOptions(options);
			
		while ( (m = re_param.exec(param_str)) ) {
			var key = m[1].toLowerCase(),
				value = m[2].toLowerCase();
			
			if (value == 'true' || value == 'yes' || value == '1')
				value = true;
			else if (value == 'false' || value == 'no' || value == '0')
				value = false;
				
			result[key] = value;
		}
		
		return result;
	}
	
	/**
	 * Returns normalized action name
	 * @param {String} name Action name (like 'Expand Abbreviation')
	 * @return Normalized name for coding (like 'expand_abbreviation')
	 */
	function normalizeActionName(name) {
		return name
			.replace(/(^\s+|\s+$)/g, '') // remove trailing spaces
			.replace(/\s+/g, '_')
			.toLowerCase();
	}
	
	/**
	 * Runs actions called by user
	 * @param {String} name Normalized action name
	 * @param {Event} evt Event object
	 */
	function runAction(name, evt) {
		/** @type {Element} */
		var target_elem = evt.target || evt.srcElement,
			key_code = evt.keyCode || evt.which;
			
		if (target_elem && target_elem.nodeType == 1 && target_elem.nodeName == 'TEXTAREA') {
			zen_editor.setTarget(target_elem);
			
			var options = getOptionsFromElement(target_elem),
				syntax = options.syntax,
				profile_name = options.profile;
			
			switch (name) {
				case 'expand_abbreviation':
					if (key_code == 9) {
						if (options.use_tab)
							expandAbbreviationWithTab(zen_editor, syntax, profile_name);
						else
							// user pressed Tab key but it's forbidden in 
							// Zen Coding: bubble up event
							return true;
							
					} else {
						expandAbbreviation(zen_editor, syntax, profile_name);
					}
					break;
				case 'match_pair_inward':
				case 'balance_tag_inward':
					matchPair(zen_editor, 'in');
					break;
				case 'match_pair_outward':
				case 'balance_tag_outward':
					matchPair(zen_editor, 'out');
					break;
				case 'wrap_with_abbreviation':
					var abbr = prompt('Enter abbreviation', 'div');
					if (abbr)
						wrapWithAbbreviation(zen_editor, abbr, syntax, profile_name);
					break;
				case 'next_edit_point':
					nextEditPoint(zen_editor);
					break;
				case 'previous_edit_point':
				case 'prev_edit_point':
					prevEditPoint(zen_editor);
					break;
				case 'pretty_break':
				case 'format_line_break':
					if (key_code == 13) {
						if (options.pretty_break)
							insertFormattedNewline(zen_editor);
						else
							// user pressed Enter but it's forbidden in 
							// Zen Coding: bubble up event
							return true;
					} else {
						insertFormattedNewline(zen_editor);
					}
					break;
				case 'select_line':
					selectLine(zen_editor);
			}
		} else {
			// allow event bubbling
			return true;
		}
	}
	
	/**
	 * Bind shortcut to Zen Coding action
	 * @param {String} keystroke
	 * @param {String} action_name
	 */
	function addShortcut(keystroke, action_name) {
		action_name = normalizeActionName(action_name);
		shortcuts[keystroke.toLowerCase()] = action_name;
		shortcut.add(keystroke, function(evt){
			return runAction(action_name, evt);
		});
	}
	
	// add default shortcuts
	addShortcut('Meta+E', 'Expand Abbreviation');
	addShortcut('Tab', 'Expand Abbreviation');
	addShortcut('Meta+D', 'Balance Tag Outward');
	addShortcut('Shift+Meta+D', 'Balance Tag inward');
	addShortcut('Shift+Meta+A', 'Wrap with Abbreviation');
	addShortcut('Ctrl+Alt+RIGHT', 'Next Edit Point');
	addShortcut('Ctrl+Alt+LEFT', 'Previous Edit Point');
	addShortcut('Meta+L', 'Select Line');
	addShortcut('Enter', 'Format Line Break');
	
	
	return {
		shortcut: addShortcut,
		
		/**
		 * Removes shortcut binding
		 * @param {String} keystroke
		 */
		unbindShortcut: function(keystroke) {
			keystroke = keystroke.toLowerCase();
			if (keystroke in shortcuts)
				delete shortcuts[keystroke];
			shortcut.remove(keystroke);
		},
		
		/**
		 * Setup editor. Pass object with values defined in 
		 * <code>default_options</code>
		 */
		setup: function(opt) {
			options = copyOptions(opt);
		},
		
		/**
		 * Returns option value
		 */
		getOption: function(name) {
			return options[name];
		},
		
		/**
		 * Returns array of binded actions and their keystrokes
		 * @return {Array}
		 */
		getShortcuts: function() {
			return formatShortcut(is_mac ? mac_char_map : pc_char_map, is_mac ? '' : '+');
		},
		
		/**
		 * Show info window about Zen Coding
		 */
		showInfo: function() {
			var message = 'All textareas on this page are powered by Zen Coding project: ' +
					'a set of tools for fast HTML coding.\n\n' +
					'Available shortcuts:\n';
					
			var sh = this.getShortcuts(),
				actions = [];
				
			for (var i = 0; i < sh.length; i++) {
				actions.push(sh[i].keystroke + ' — ' + sh[i].action_name)
			}
			
			message += actions.join('\n') + '\n\n';
			message += 'More info on http://code.google.com/p/zen-coding/';
			
			alert(message);
			
		}
	}
})();	
})();