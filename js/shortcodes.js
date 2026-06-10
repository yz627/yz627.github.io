/* Hugo Shortcodes 交互脚本 */

(function () {
  "use strict";

  // === Tabs 切换 ===
  function initTabs() {
    document.querySelectorAll(".shortcode-tabs").forEach(function (tabsEl) {
      var nav = tabsEl.querySelector(".shortcode-tabs-nav");
      var panels = tabsEl.querySelectorAll(".shortcode-tab-panel");

      if (!nav || panels.length === 0) return;

      panels.forEach(function (panel, i) {
        var btn = document.createElement("button");
        btn.className = "shortcode-tab-btn";
        btn.textContent = panel.dataset.tabName || "Tab " + (i + 1);
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-selected", i === 0 ? "true" : "false");

        btn.addEventListener("click", function () {
          nav
            .querySelectorAll(".shortcode-tab-btn")
            .forEach(function (b) {
              b.classList.remove("active");
              b.setAttribute("aria-selected", "false");
            });
          panels.forEach(function (p) {
            p.classList.remove("active");
          });

          btn.classList.add("active");
          btn.setAttribute("aria-selected", "true");
          panel.classList.add("active");
        });

        nav.appendChild(btn);
      });

      panels[0].classList.add("active");
      var firstBtn = nav.querySelector(".shortcode-tab-btn");
      if (firstBtn) firstBtn.classList.add("active");
    });
  }

  // === Gallery 灯箱 ===
  function initGalleryLightbox() {
    var lightbox = null;

    document.addEventListener("click", function (e) {
      var img = e.target.closest(".shortcode-gallery-item img");
      if (!img) return;

      e.preventDefault();

      lightbox = document.createElement("div");
      lightbox.className = "gallery-lightbox";
      lightbox.innerHTML =
        '<img src="' + img.src + '" alt="' + (img.alt || "") + '">';
      document.body.appendChild(lightbox);

      requestAnimationFrame(function () {
        lightbox.classList.add("active");
      });

      lightbox.addEventListener("click", function () {
        lightbox.classList.remove("active");
        setTimeout(function () {
          if (lightbox && lightbox.parentNode) {
            lightbox.parentNode.removeChild(lightbox);
          }
          lightbox = null;
        }, 300);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox) {
        lightbox.click();
      }
    });
  }

  // 初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initTabs();
      initGalleryLightbox();
    });
  } else {
    initTabs();
    initGalleryLightbox();
  }
})();
