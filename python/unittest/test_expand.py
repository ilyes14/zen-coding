'''
Created on Jun 19, 2009

@author: sergey
'''
import unittest

from zencoding import zen_core as zen

class Test(unittest.TestCase):

	def testAbbreviations(self):
		self.assertEqual(zen.parse_into_tree('span+em').to_string('plain'), '<span></span><em></em>')
		self.assertEqual(zen.parse_into_tree('span.my.class+em').to_string('plain'), '<span class="my class"></span><em></em>')
		
#		print(zen.parse_into_tree('cc:ie6>p+blockquote#sample$.so.many.classes*2', 'html').to_string('html'))
	def testProfiles(self):
		self.assertEqual(zen.parse_into_tree('p>em*2').to_string('plain'), '<p><em></em><em></em></p>')
		self.assertEqual(zen.parse_into_tree('p>em*2').to_string('xml'), '<p>\n\t<em>\n\t\t|\n\t</em>\n\t<em>\n\t\t|\n\t</em>\n</p>')
		self.assertEqual(zen.parse_into_tree('img+br').to_string('html'), '<img src="|" alt="|">|<br>|')
		self.assertEqual(zen.parse_into_tree('img+br').to_string('xhtml'), '<img src="|" alt="|" />|<br />|')
		self.assertEqual(zen.parse_into_tree('img+br').to_string('xml'), '<img src="|" alt="|"/>|\n<br/>|')
	
	def testExpando(self):
			self.assertEqual(zen.parse_into_tree('ul+').to_string('plain'), '<ul><li></li></ul>')


if __name__ == "__main__":
	#import sys;sys.argv = ['', 'Test.testAbbreviations']
	unittest.main()