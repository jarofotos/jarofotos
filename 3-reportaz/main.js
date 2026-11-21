/* Direction 3: shared lightbox + gentle ScrollTrigger parallax on the spreads.
   Parallax only runs on wide screens and when the visitor has not asked for reduced motion.
   Only transforms are animated (gsap-performance). Content never depends on this script. */
(function () {
  'use strict';
  JFLightbox({ selector: 'a[data-lightbox]' });

  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  var mm = gsap.matchMedia();
  mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', function () {
    gsap.utils.toArray('[data-speed]').forEach(function (el) {
      var s = parseFloat(el.getAttribute('data-speed')) || 0.5;
      el.style.willChange = 'transform';
      gsap.fromTo(el, { y: -30 * s }, {
        y: 30 * s,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    return function () {
      gsap.utils.toArray('[data-speed]').forEach(function (el) { el.style.willChange = ''; });
    };
  });

  // images change the page height as they load
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
