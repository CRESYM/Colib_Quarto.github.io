// Enhanced tutorial with CodeMirror support
let editors = {};

// Initialize CodeMirror editors
function initializeEditors() {
  console.log('Initializing CodeMirror editors...');

  // Editor 1: YAML mode
  const editor1Element = document.getElementById('editor1');
  if (editor1Element && typeof CodeMirror !== 'undefined') {
    editors.editor1 = CodeMirror.fromTextArea(editor1Element, {
      mode: 'yaml',
      theme: '3024-night',
      lineNumbers: true,
      lineWrapping: true,
      placeholder: editor1Element.placeholder,
      autoCloseBrackets: true,
      matchBrackets: true
    });
  }

  // Editor 2: Markdown mode for LaTeX
  const editor2Element = document.getElementById('editor2');
  if (editor2Element && typeof CodeMirror !== 'undefined') {
    editors.editor2 = CodeMirror.fromTextArea(editor2Element, {
      mode: 'markdown',
      theme: 'default',
      lineNumbers: true,
      lineWrapping: true,
      placeholder: editor2Element.placeholder,
      autoCloseBrackets: true,
      matchBrackets: true
    });
  }

  // Editor 3: Markdown mode
  const editor3Element = document.getElementById('editor3');
  if (editor3Element && typeof CodeMirror !== 'undefined') {
    editors.editor3 = CodeMirror.fromTextArea(editor3Element, {
      mode: 'markdown',
      theme: 'default',
      lineNumbers: true,
      lineWrapping: true,
      placeholder: editor3Element.placeholder,
      autoCloseBrackets: true,
      matchBrackets: true
    });
  }

  // Editor 4: Markdown mode
  const editor4Element = document.getElementById('editor4');
  if (editor4Element && typeof CodeMirror !== 'undefined') {
    editors.editor4 = CodeMirror.fromTextArea(editor4Element, {
      mode: 'markdown',
      theme: 'default',
      lineNumbers: true,
      lineWrapping: true,
      placeholder: editor4Element.placeholder,
      autoCloseBrackets: true,
      matchBrackets: true
    });
  }

  // Editor 5: Markdown mode (larger)
  const editor5Element = document.getElementById('editor5');
  if (editor5Element && typeof CodeMirror !== 'undefined') {
    editors.editor5 = CodeMirror.fromTextArea(editor5Element, {
      mode: 'markdown',
      theme: '3024-night',
      lineNumbers: true,
      lineWrapping: true,
      placeholder: editor5Element.placeholder,
      autoCloseBrackets: true,
      matchBrackets: true
    });
    editors.editor5.setSize(null, 300);
  }

  console.log('Editors initialized:', Object.keys(editors));
}

// Get editor value (works with both CodeMirror and textarea)
function getEditorValue(editorName) {
  if (editors[editorName]) {
    return editors[editorName].getValue();
  }
  // Fallback to textarea
  const element = document.getElementById(editorName);
  return element ? element.value : '';
}

// Validation functions
function checkStep1() {
  const input = getEditorValue('editor1');
  const success = document.getElementById('success1');
  const error = document.getElementById('error1');

  const hasTitle = input.includes('title:') && input.toLowerCase().includes('Synchronous Generator Model');
  const hasAuthor = input.includes('author:');
  const hasCategories = input.includes('categories:') && input.includes('model') && input.includes('generator');
  const hasDashes = input.includes('---');

  if (hasTitle && hasAuthor && hasCategories && hasDashes) {
    success.style.display = 'block';
    error.style.display = 'none';
  } else {
    error.style.display = 'block';
    success.style.display = 'none';
  }
}

function checkStep2() {
  const input = getEditorValue('editor2');
  const success = document.getElementById('success2');
  const error = document.getElementById('error2');

  const hasDoubleDollar = input.includes('$$');
  const hasEquation = input.includes('P') && input.includes('E') && input.includes('V') && input.includes('sin');
  const hasLabel = input.includes('{#eq-power}');

  if (hasDoubleDollar && hasEquation && hasLabel) {
    success.style.display = 'block';
    error.style.display = 'none';
  } else {
    error.style.display = 'block';
    success.style.display = 'none';
  }
}

function checkStep3() {
  const input = getEditorValue('editor3');
  const success = document.getElementById('success3');
  const error = document.getElementById('error3');

  const hasHeading = input.toLowerCase().includes('## model description') || input.toLowerCase().includes('##model description');
  const hasCallout = input.includes(':::{.callout-note}') && input.includes(':::');
  const hasParagraph = input.split('\n').some(line =>
    line.trim().length > 20 && !line.includes('#') && !line.includes(':::')
  );

  if (hasHeading && hasCallout && hasParagraph) {
    success.style.display = 'block';
    error.style.display = 'none';
  } else {
    error.style.display = 'block';
    success.style.display = 'none';
  }
}

function checkStep4() {
  const input = getEditorValue('editor4');
  const success = document.getElementById('success4');
  const error = document.getElementById('error4');

  const hasReference = input.includes('@eq-power');

  if (hasReference) {
    success.style.display = 'block';
    error.style.display = 'none';
  } else {
    error.style.display = 'block';
    success.style.display = 'none';
  }
}

function checkStep5() {
  const input = getEditorValue('editor5');
  const success = document.getElementById('success5');
  const error = document.getElementById('error5');

  const hasYAML = input.includes('---') && input.includes('title:');
  const hasEquation = input.includes('$$') && input.includes('{#eq-power}');
  const hasDescription = input.toLowerCase().includes('## model description');
  const hasReference = input.includes('@eq-power');

  if (hasYAML && hasEquation && hasDescription && hasReference) {
    success.style.display = 'block';
    error.style.display = 'none';
    // Celebration effect
    setTimeout(() => {
      success.innerHTML = '🎊 ' + success.innerHTML;
    }, 200);
  } else {
    error.style.display = 'block';
    success.style.display = 'none';
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function () {
  // Wait for CodeMirror to load
  setTimeout(initializeEditors, 100);
});

// Make functions global for onclick handlers
window.checkStep1 = checkStep1;
window.checkStep2 = checkStep2;
window.checkStep3 = checkStep3;
window.checkStep4 = checkStep4;
window.checkStep5 = checkStep5; 
