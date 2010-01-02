#!/usr/bin/env python
# -*- coding: utf-8 -*-

from zen_editor import ZenEditor
from zencoding.zen_actions import wrap_with_abbreviation

editor = ZenEditor()

abbr = editor.prompt('Enter abbreviation')
if abbr is not None:
	wrap_with_abbreviation(editor, abbr, editor.get_syntax(), editor.get_profile_name())