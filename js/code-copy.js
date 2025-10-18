// 代码块复制功能
document.addEventListener('DOMContentLoaded', function() {
  // 为所有代码块添加复制按钮
  const codeBlocks = document.querySelectorAll('pre code');
  
  codeBlocks.forEach(function(codeBlock) {
    const pre = codeBlock.parentElement;
    
    // 避免重复添加按钮
    if (pre.querySelector('.copy-button')) {
      return;
    }
    
    // 创建代码块头部
    const header = document.createElement('div');
    header.className = 'code-block-header';
    
    // 创建标题
    const title = document.createElement('div');
    title.className = 'code-block-title';
    
    // 检测编程语言
    const language = getLanguageFromCodeBlock(codeBlock);
    title.textContent = language || 'Code';
    
    // 创建复制按钮
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>Copy';
    
    // 组装头部
    header.appendChild(title);
    header.appendChild(copyButton);
    
    // 插入头部到代码块
    pre.insertBefore(header, codeBlock);
    
    // 添加复制功能
    copyButton.addEventListener('click', function() {
      const codeText = codeBlock.textContent;
      
      // 使用现代 Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(codeText).then(function() {
          showCopySuccess(copyButton);
        }).catch(function(err) {
          console.error('Failed to copy: ', err);
          fallbackCopyTextToClipboard(codeText, copyButton);
        });
      } else {
        // 降级方案
        fallbackCopyTextToClipboard(codeText, copyButton);
      }
    });
  });
});

// 从代码块中检测编程语言
function getLanguageFromCodeBlock(codeBlock) {
  const classList = codeBlock.className;
  const languageMatch = classList.match(/language-(\w+)/);
  
  if (languageMatch) {
    const lang = languageMatch[1];
    const languageMap = {
      'go': 'Go',
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'python': 'Python',
      'java': 'Java',
      'cpp': 'C++',
      'c': 'C',
      'html': 'HTML',
      'css': 'CSS',
      'json': 'JSON',
      'xml': 'XML',
      'yaml': 'YAML',
      'yml': 'YAML',
      'bash': 'Bash',
      'shell': 'Shell',
      'sql': 'SQL',
      'php': 'PHP',
      'ruby': 'Ruby',
      'rust': 'Rust',
      'swift': 'Swift',
      'kotlin': 'Kotlin',
      'scala': 'Scala',
      'r': 'R',
      'matlab': 'MATLAB',
      'dockerfile': 'Dockerfile',
      'markdown': 'Markdown',
      'md': 'Markdown'
    };
    
    return languageMap[lang] || lang.toUpperCase();
  }
  
  return 'Code';
}

// 显示复制成功状态
function showCopySuccess(button) {
  const originalText = button.innerHTML;
  button.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>Copied!';
  button.classList.add('copied');
  
  setTimeout(function() {
    button.innerHTML = originalText;
    button.classList.remove('copied');
  }, 2000);
}

// 降级复制方案
function fallbackCopyTextToClipboard(text, button) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  
  // 避免滚动到底部
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showCopySuccess(button);
    } else {
      console.error('Fallback: Copying text command was unsuccessful');
    }
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }
  
  document.body.removeChild(textArea);
}

// 添加键盘快捷键支持 (Ctrl/Cmd + C)
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
    const activeElement = document.activeElement;
    const codeBlock = activeElement.closest('pre');
    
    if (codeBlock) {
      const codeElement = codeBlock.querySelector('code');
      if (codeElement) {
        const copyButton = codeBlock.querySelector('.copy-button');
        if (copyButton) {
          copyButton.click();
          e.preventDefault();
        }
      }
    }
  }
});
