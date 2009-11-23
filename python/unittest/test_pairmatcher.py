'''
Created on Jul 3, 2009

@author: sergey
'''
import unittest
from zencoding import zen_core as zen


class Test(unittest.TestCase):


	def testPairMatcher(self):
		text = 'Say <div>Hello <span>world!</span></div>' 
		
		self.assertEqual([15, 34], zen.get_pair_range(text, 24))
		self.assertEqual([4, 40], zen.get_pair_range(text, 39))
		self.assertEqual([-1, -1], zen.get_pair_range(text, 2))
		self.assertEqual([8, 24], zen.get_pair_range('Testing <!-- comment --> matcher', 18))
		self.assertEqual([8, 14], zen.get_pair_range('Testing <br /> self-closing tag', 10))


if __name__ == "__main__":
	#import sys;sys.argv = ['', 'Test.testPairMatcher']
	unittest.main()