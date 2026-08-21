(function () {
  'use strict';

  var shell = document.querySelector('.shell');
  var navItems = Array.prototype.slice.call(document.querySelectorAll('.nav-item'));
  var frame = document.getElementById('contentFrame');
  var frameLoading = document.getElementById('frameLoading');
  var pageTitle = document.getElementById('pageTitle');
  var crumbEyebrow = document.getElementById('crumbEyebrow');
  var sidebarToggle = document.getElementById('sidebarToggle');
  var mobileMenuBtn = document.getElementById('mobileMenuBtn');
  var sidebarScrim = document.getElementById('sidebarScrim');
  var reloadBtn = document.getElementById('reloadBtn');
  var todayLabel = document.getElementById('todayLabel');

  var SUITE_NAME = 'SCM Analytics Suite';

  // ---- Today label ----
  function setTodayLabel() {
    if (!todayLabel) return;
    var now = new Date();
    var formatted = now.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    todayLabel.textContent = formatted;
  }
  setTodayLabel();

  // ---- Navigation switching ----
  function activateItem(item, opts) {
    opts = opts || {};
    var src = item.getAttribute('data-src');
    var title = item.getAttribute('data-title') || '';
    var num = item.querySelector('.nav-num');
    var numText = num ? num.textContent.trim() : '';

    navItems.forEach(function (btn) {
      btn.classList.toggle('active', btn === item);
    });

    pageTitle.textContent = title;
    crumbEyebrow.textContent = (numText ? numText + ' · ' : '') + SUITE_NAME;

    if (!opts.skipLoad) {
      showLoading(true);
      // Avoid reloading the same page unnecessarily
      var currentSrc = frame.getAttribute('data-current-src');
      if (currentSrc !== src) {
        frame.setAttribute('data-current-src', src);
        frame.src = src;
      } else {
        showLoading(false);
      }
    }

    closeMobileSidebar();
  }

  function showLoading(state) {
    if (!frameLoading) return;
    frameLoading.classList.toggle('visible', !!state);
  }

  frame.addEventListener('load', function () {
    showLoading(false);
  });

  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      activateItem(item);
    });
  });

  // ---- Sidebar collapse (desktop) ----
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function () {
      shell.classList.toggle('collapsed');
    });
  }

  // ---- Sidebar toggle (mobile) ----
  function openMobileSidebar() {
    shell.classList.add('mobile-open');
    sidebarScrim.classList.add('visible');
  }
  function closeMobileSidebar() {
    shell.classList.remove('mobile-open');
    sidebarScrim.classList.remove('visible');
  }
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileSidebar);
  }
  if (sidebarScrim) {
    sidebarScrim.addEventListener('click', closeMobileSidebar);
  }

  // ---- Reload current dashboard ----
  if (reloadBtn) {
    reloadBtn.addEventListener('click', function () {
      reloadBtn.classList.add('spinning');
      showLoading(true);
      frame.src = frame.src;
      setTimeout(function () {
        reloadBtn.classList.remove('spinning');
      }, 600);
    });
  }

  // ---- Init: mark initial src as loaded ----
  frame.setAttribute('data-current-src', frame.getAttribute('src'));
})();
