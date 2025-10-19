// 代码块复制功能
document.addEventListener('DOMContentLoaded', function() {
    // 查找所有的代码块
    const codeBlocks = document.querySelectorAll('pre code');

    if (codeBlocks.length === 0) {
        return;
    }

    // 为每个代码块添加复制按钮
    codeBlocks.forEach(function(codeBlock) {
        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = '复制';
        copyButton.setAttribute('aria-label', '复制代码');

        // 为代码块添加容器类名（如果还没有的话）
        const preElement = codeBlock.parentElement;
        if (!preElement.classList.contains('code-block-container')) {
            preElement.classList.add('code-block-container');
        }

        // 添加复制按钮到代码块
        preElement.appendChild(copyButton);

        // 点击复制功能
        copyButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // 获取代码内容
            const codeText = codeBlock.textContent || codeBlock.innerText;

            // 复制到剪贴板
            if (navigator.clipboard && window.isSecureContext) {
                // 使用现代 Clipboard API
                navigator.clipboard.writeText(codeText).then(function() {
                    showCopySuccess(copyButton);
                }).catch(function(err) {
                    console.error('复制失败:', err);
                    fallbackCopyTextToClipboard(codeText, copyButton);
                });
            } else {
                // 降级方案：使用传统的execCommand
                fallbackCopyTextToClipboard(codeText, copyButton);
            }
        });
    });
});

// 复制成功提示
function showCopySuccess(button) {
    const originalText = button.textContent;

    // 显示复制成功状态
    button.classList.add('copied');
    button.textContent = '已复制';

    // 移除伪元素（如果有的话）
    const afterElement = button.querySelector('::after');
    if (afterElement) {
        afterElement.remove();
    }

    // 2秒后恢复原状
    setTimeout(function() {
        button.classList.remove('copied');
        button.textContent = originalText;
    }, 2000);
}

// 降级复制方案（兼容旧浏览器）
function fallbackCopyTextToClipboard(text, button) {
    // 创建临时文本区域
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);

    try {
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess(button);
        } else {
            console.error('复制失败：execCommand 返回 false');
            button.textContent = '复制失败';
            setTimeout(function() {
                button.textContent = '复制';
            }, 2000);
        }
    } catch (err) {
        console.error('复制失败：', err);
        button.textContent = '复制失败';
        setTimeout(function() {
            button.textContent = '复制';
        }, 2000);
    } finally {
        document.body.removeChild(textArea);
    }
}

// 鼠标悬停增强效果（可选）
document.addEventListener('DOMContentLoaded', function() {
    const copyButtons = document.querySelectorAll('.copy-button');

    copyButtons.forEach(function(button) {
        // 鼠标悬停时稍微放大按钮
        button.addEventListener('mouseenter', function() {
            if (!button.classList.contains('copied')) {
                this.style.transform = 'scale(1.05)';
            }
        });

        button.addEventListener('mouseleave', function() {
            if (!button.classList.contains('copied')) {
                this.style.transform = 'scale(1)';
            }
        });
    });
});