(function () {
  'use strict';

  var aside = document.getElementById('toc-aside');
  var backdrop = document.getElementById('toc-backdrop');
  if (!aside) return;

  var toggle = document.getElementById('toc-toggle');
  var content = document.getElementById('toc-content');
  var postContent = document.querySelector('.post-content');
  if (!postContent) return;

  var STORAGE_KEY = 'yzblog-toc-collapsed';
  var BP = 1280; // 桌面断点，与 toc.css 保持一致

  var headings = Array.prototype.slice.call(
    postContent.querySelectorAll('h2, h3')
  );
  var tocLinks = Array.prototype.slice.call(
    content ? content.querySelectorAll('a[href^="#"]') : []
  );

  // 映射：heading id -> TOC 链接元素
  var linkMap = {};
  tocLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.charAt(0) === '#') {
      linkMap[decodeURIComponent(href.slice(1))] = link;
    }
  });

  // 安全读写 localStorage（Safari 隐私模式会抛错）
  function readState() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function writeState(v) {
    try { localStorage.setItem(STORAGE_KEY, v); } catch (e) { /* ignore */ }
  }

  var body = document.body;

  // 初始化状态：桌面端读取持久化状态（默认展开）；移动端默认关闭
  function initState() {
    if (window.innerWidth >= BP) {
      var saved = readState();
      if (saved === '1') {
        body.classList.add('toc-collapsed');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      } else {
        body.classList.remove('toc-collapsed');
        if (toggle) toggle.setAttribute('aria-expanded', 'true');
      }
      body.classList.remove('toc-open');
    } else {
      body.classList.remove('toc-collapsed');
      body.classList.remove('toc-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
  }
  initState();

  // 窗口 resize 时跨断点重置状态
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      // 跨断点时重置，但不覆盖桌面端持久化偏好
      if (window.innerWidth < BP) {
        body.classList.remove('toc-collapsed');
        if (body.classList.contains('toc-open')) {
          body.classList.remove('toc-open');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
      } else {
        body.classList.remove('toc-open');
        initState();
      }
    }, 120);
  });

  // 切换按钮
  if (toggle) {
    toggle.addEventListener('click', function () {
      if (window.innerWidth >= BP) {
        var isCollapsed = body.classList.toggle('toc-collapsed');
        toggle.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
        writeState(isCollapsed ? '1' : '0');
      } else {
        var isOpen = body.classList.toggle('toc-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    });
  }

  // 点击遮罩关闭抽屉（移动端）
  if (backdrop) {
    backdrop.addEventListener('click', function () {
      if (body.classList.contains('toc-open')) {
        body.classList.remove('toc-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ESC 关闭移动端抽屉
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && body.classList.contains('toc-open')) {
      body.classList.remove('toc-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // 1) 滚动监听：高亮当前章节
  var lastActive = null;

  function updateActive() {
    if (!headings.length || !tocLinks.length) return;

    var threshold = 100;
    var activeId = null;

    for (var i = headings.length - 1; i >= 0; i--) {
      var rect = headings[i].getBoundingClientRect();
      if (rect.top <= threshold) {
        activeId = headings[i].id;
        break;
      }
    }

    if (!activeId && headings[0]) {
      if (headings[0].getBoundingClientRect().top > threshold) {
        activeId = null;
      }
    }

    if (activeId === lastActive) return;
    lastActive = activeId;

    tocLinks.forEach(function (l) { l.classList.remove('active'); });
    if (activeId && linkMap[activeId]) {
      linkMap[activeId].classList.add('active');
    }
  }

  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateActive();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  updateActive();

  // 2) TOC 链接点击：平滑滚动 + 关闭移动端抽屉
  tocLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (!href || href.charAt(0) !== '#') return;
      var target = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!target) return;

      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 60;
      window.scrollTo({ top: top, behavior: 'smooth' });

      if (window.innerWidth < BP && body.classList.contains('toc-open')) {
        body.classList.remove('toc-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
})();
