'''
High-level editor interface that communicates with TextMate editor.
In order to work correctly, you should set set the commands 
input to “Entire Document”
 
@author Sergey Chikuyonok (serge.che@gmail.com)
@link http://chikuyonok.ru
'''
import os
import sys
import zencoding.zen_core as zen
import subprocess

_content = ''
"Editor's content"

def _get_selected_text():
    "Returns selected text"
    return os.getenv('TM_SELECTED_TEXT', '')

def set_context(context=None):
    """
    Setup underlying editor context. You should call this method 
    <code>before</code> using any Zen Coding action.
    @param context: context object
    """
    _content = sys.stdin.read()
    pass
    
def get_selection_range():
    """
    Returns character indexes of selected text
    @return: list of start and end indexes
    """
    nl = zen.get_newline()
    head_lines = sys.stdin.readlines()[0:os.getenv('TM_LINE_NUMBER', 1) - 1]
    head_len = len(nl.join(head_lines)) + len(nl)
    start, end = get_current_line_range()
    
    return start + head_len, end + head_len


def create_selection(start, end=None):
    """
    Creates selection from <code>start</code> to <code>end</code> character
    indexes. If <code>end</code> is ommited, this method should place caret 
    and <code>start</code> index
    """
    set_caret_pos(start)
    if end is not None and _get_selected_text():
        # copy selected text to Mac OS' pasteboard to use it 
        # as a part of macros sequence for 'find next' action
        subprocess.Popen(['pbcopy', '-pboard find'], shell=True, stdin=subprocess.PIPE).communicate(_get_selected_text())

def get_current_line_range():
    """
    Returns current line's start and end indexes
    @return: list of start and end indexes
    @example
    start, end = zen_editor.get_current_line_range();
    print('%s, %s' % (start, end))
    """
    start = os.getenv('TM_LINE_INDEX', 0)
    return start, start + len(_get_selected_text())

def get_caret_pos():
    """ Returns current caret position """
    return get_selection_range()[0]

def set_caret_pos(pos):
    """
    Set new caret position
    @type pos: int
    """
    # figure out line and column vars
    head = zen.split_by_lines(get_content()[0:pos])
    line = len(head)
    column = pos - zen.get_newline().join(head[0:-1])
    
    subprocess.Popen(['open', 'txmt://open/?line=%d&column=%d' % (line, column)], shell=True).communicate()

def get_current_line():
    """
    Returns content of current line
    @return: str
    """
    return os.getenv('TM_CURRENT_LINE', '')

def replace_content(value, start=None, end=None):
    """
    Replace editor's content or it's part (from <code>start</code> to 
    <code>end</code> index). If <code>value</code> contains 
    <code>caret_placeholder</code>, the editor will put caret into 
    this position. If you skip <code>start</code> and <code>end</code>
    arguments, the whole target's content will be replaced with 
    <code>value</code>. 
    
    If you pass <code>start</code> argument only,
    the <code>value</code> will be placed at <code>start</code> string 
    index of current content. 
    
    If you pass <code>start</code> and <code>end</code> arguments,
    the corresponding substring of current target's content will be 
    replaced with <code>value</code> 
    @param value: Content you want to paste
    @type value: str
    @param start: Start index of editor's content
    @type start: int
    @param end: End index of editor's content
    @type end: int
    """
    # For content replacement we need to use macro syntaxt.
    # First, create selection and then write AppleScript file that
    # will replace selected text with new one
    if start is None: start = 0
    if end is None: end = len(get_content())
    create_selection(start, end)
    
    apple_script = os.path.join(os.getenv('TM_BUNDLE_SUPPORT'), 'pasteboard.scpt')
    fp = open(apple_script, 'w')
    fp.write('tell application "TextMate" to insert "%s" with as snippet' % (value.replace('\\', '\\\\').replace('"', '\\"'),))
    fp.close()
    

def get_content():
    """
    Returns editor's content
    @return: str
    """
    return _content

def get_syntax():
    """
    Returns current editor's syntax mode
    @return: str
    """
    return 'html'

def get_profile_name():
    """
    Returns current output profile name (@see zen_coding#setup_profile)
    @return {String}
    """
    return 'xhtml'
