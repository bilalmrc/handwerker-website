(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initReveal() {
    var pending = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    if (!pending.length) return;

    function showAll() {
      while (pending.length) pending.pop().classList.add('is-in');
    }

    if (reduced || !('IntersectionObserver' in window)) {
      showAll();
      return;
    }

    // Versatz je Gruppe vorab setzen, damit CSS die Staffelung macht
    var groups = document.querySelectorAll('[data-stagger]');
    for (var g = 0; g < groups.length; g++) {
      var step = parseInt(groups[g].getAttribute('data-stagger'), 10) || 90;
      var kids = groups[g].querySelectorAll('[data-reveal]');
      for (var k = 0; k < kids.length; k++) {
        kids[k].style.setProperty('--delay', (k * step) + 'ms');
      }
    }

    function show(el) {
      el.classList.add('is-in');
      var i = pending.indexOf(el);
      if (i > -1) pending.splice(i, 1);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        show(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    for (var n = 0; n < pending.length; n++) io.observe(pending[n]);

    // Rückfallebene: löst der Observer mal nicht aus, bliebe der Inhalt
    // dauerhaft auf opacity 0 — also unsichtbar, ohne Fehlermeldung.
    // Lieber ohne Animation zeigen als gar nicht.
    function sweep() {
      for (var i = pending.length - 1; i >= 0; i--) {
        var r = pending[i].getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95 && r.bottom > 0) {
          io.unobserve(pending[i]);
          show(pending[i]);
        }
      }
    }

    var queued = false;
    window.addEventListener('scroll', function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; sweep(); });
    }, { passive: true });
    window.addEventListener('resize', sweep, { passive: true });

    // Die ersten 15s zusätzlich pollen, fängt späte Layoutverschiebungen ab
    var ticks = 0;
    var timer = setInterval(function () {
      sweep();
      if (++ticks > 30 || !pending.length) clearInterval(timer);
    }, 500);
  }

  function initSteps() {
    var steps = document.querySelector('.steps');
    if (!steps) return;

    if (reduced || !('IntersectionObserver' in window)) {
      steps.classList.add('is-in');
      return;
    }

    var kids = steps.querySelectorAll('.step');
    for (var i = 0; i < kids.length; i++) {
      kids[i].style.setProperty('--delay', (i * 160 + 300) + 'ms');
    }

    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        steps.classList.add('is-in');
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(steps);
  }

  function initCounters() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;

    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 1500;
      var t0 = null;

      function frame(now) {
        if (t0 === null) t0 = now;
        var p = Math.min((now - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);   // easeOutCubic
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    if (reduced || !('IntersectionObserver' in window)) {
      for (var i = 0; i < nums.length; i++) {
        nums[i].textContent = nums[i].getAttribute('data-count') +
                              (nums[i].getAttribute('data-suffix') || '');
      }
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        run(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    for (var j = 0; j < nums.length; j++) io.observe(nums[j]);
  }

  // Header, Fortschrittsbalken und Anrufleiste hängen alle am Scrollstand,
  // deshalb ein gemeinsamer Handler statt drei einzelnen
  function initScrollUI() {
    var header = document.querySelector('.site-header');
    var bar    = document.querySelector('.progress');
    var call   = document.querySelector('.call-bar');
    var hero   = document.querySelector('.hero');
    var ticking = false;

    function update() {
      var y = window.pageYOffset || document.documentElement.scrollTop;

      if (header) header.classList.toggle('is-stuck', y > 12);

      if (bar) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
      }

      // Anrufleiste erst nach dem Hero — vorher steht der Button ohnehin im Bild
      if (call) {
        var trigger = hero ? hero.offsetHeight * 0.7 : 400;
        call.classList.toggle('is-visible', y > trigger);
      }

      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  function initCardGlow() {
    if (reduced) return;
    // auf Touch sinnlos, dort gibt es keinen Zeiger zum Folgen
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var cards = document.querySelectorAll('.card');
    for (var i = 0; i < cards.length; i++) {
      (function (card) {
        card.addEventListener('pointermove', function (e) {
          var r = card.getBoundingClientRect();
          card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
          card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
        });
      })(cards[i]);
    }
  }

  function initNavHighlight() {
    var links = document.querySelectorAll('.nav__links a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var map = {};
    var targets = [];
    for (var i = 0; i < links.length; i++) {
      var id = links[i].getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (!section) continue;
      map[id] = links[i];
      targets.push(section);
    }

    // rootMargin oben um die Headerhöhe versetzt, sonst schaltet es zu früh
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          for (var k in map) map[k].classList.remove('is-current');
          link.classList.add('is-current');
        }
      });
    }, { threshold: 0.35, rootMargin: '-84px 0px -55% 0px' });

    for (var t = 0; t < targets.length; t++) io.observe(targets[t]);
  }

  // immer nur eine Antwort offen lassen
  function initFaq() {
    var all = document.querySelectorAll('.faq details');
    for (var i = 0; i < all.length; i++) {
      all[i].addEventListener('toggle', function () {
        if (!this.open) return;
        for (var j = 0; j < all.length; j++) {
          if (all[j] !== this) all[j].open = false;
        }
      });
    }
  }

  // Demo: das Formular hat noch keinen Empfangsweg, siehe README
  function initFormDemo() {
    var form = document.querySelector('.form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form__note');
      if (note) {
        note.textContent = 'Demo — es wurde nichts gesendet und nichts gespeichert.';
        note.style.color = 'var(--brand-500)';
        note.style.fontWeight = '650';
      }
    });
  }

  function init() {
    initReveal();
    initSteps();
    initCounters();
    initScrollUI();
    initCardGlow();
    initNavHighlight();
    initFaq();
    initFormDemo();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
