#!/usr/bin/env python
# -*- coding: utf-8 -*-

'''
Filter for escaping unsafe XML characters: <, >, &
@author Sergey Chikuyonok (serge.che@gmail.com)
@link http://chikuyonok.ru
'''
import re
from zencoding import zen_core as zen_coding

char_map = {
	'<': '&lt;',
	'>': '&gt;',
	'&': '&amp;'
}

re_chars = re.compile(r'[<>&]')

def escape_chars(text):
	return re_chars.sub(lambda m: char_map[m.group(1)], text)

def process(tree, profile, level):
	for item in tree.children:
		item.start = escape_chars(item.start)
		item.end = escape_chars(item.end)
		
		process(item)
	
	return tree

zen_coding.register_filter('e', process)