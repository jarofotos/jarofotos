/* Direction 2: develop effect, grease-pencil mark and the shared lightbox. Everything is enhancement: without JS
   the frames are plain links to the large images. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var frames = Array.prototype.slice.call(document.querySelectorAll('.frame'));

  // a hand-drawn loop for the grease pencil, one path per frame
  var NS = 'http://www.w3.org/2000/svg';
  frames.forEach(function (f, i) {
    var link = f.querySelector('.frame__link');
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'mark');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('pathLength', '1');
    // slightly different loop per frame so the marks do not look stamped
    var j = (i % 3) - 1;
    p.setAttribute('d', 'M' + (52 + j * 3) + ' 4 C 82 2, 98 24, 96 52 C 94 82, 70 98, 42 96 C 14 94, 2 70, 4 42 C 6 14, 32 3, 66 7 C 76 9, 84 14, ' + (88 + j * 2) + ' 20');
    svg.appendChild(p);
    link.appendChild(svg);
  });

  var pending = false;
  JFLightbox({
    selector: 'a[data-lightbox]',
    intercept: function (a, open) {
      var f = a.closest('.frame');
      if (f) f.classList.add('is-marked');
      if (reduce) { open(); return; }
      if (pending) return; // a second click or Enter during the pencil stroke must not open twice
      pending = true;
      window.setTimeout(function () { pending = false; open(); }, 460);
    }
  });

  if (reduce || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js-develop');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-developed');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  frames.forEach(function (f, i) {
    f.style.setProperty('--i', i % 5);
    io.observe(f);
  });
})();
