(function () {
  'use strict';

  var aside = document.getElementById('toc-aside');
  if (!aside) return;

  var content = document.getElementById('toc-content');
  var toggle = document.getElementById('toc-toggle');
  var postContent = document.querySelector('.post-content');
  if (!postContent) return;

  var headings = Array.prototype.slice.call(
    postContent.querySelectorAll('h2, h3')
  );
  var tocLinks = Array.prototype.slice.call(
    content ? content.querySelectorAll('a[href^="#"]') : []
  );

  // Map: heading id -> TOC link element
  var linkMap = {};
  tocLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.charAt(0) === '#') {
      linkMap[decodeURIComponent(href.slice(1))] = link;
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

    // 还没滚动过任何标题时，不高亮；或高亮第一个
    if (!activeId && headings[0]) {
      var first = headings[0].getBoundingClientRect();
      if (first.top > threshold) {
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

  // 2) TOC 链接点击：平滑滚动 + 关闭移动端面板
  tocLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (!href || href.charAt(0) !== '#') return;
      var target = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!target) return;

      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 60;
      window.scrollTo({ top: top, behavior: 'smooth' });

      if (window.innerWidth < 1200 && aside.classList.contains('is-open')) {
        aside.classList.remove('is-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // 3) 移动端折叠/展开
  if (toggle) {
    toggle.addEventListener('click', function () {
      var isOpen = aside.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }
})();
