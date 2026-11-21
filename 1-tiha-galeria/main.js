/* Direction 1: filter buttons (progressive: without JS every print is shown) and the shared lightbox. */
(function () {
  'use strict';
  JFLightbox({ selector: 'a[data-lightbox]' });

  var bar = document.querySelector('.filters');
  var prints = Array.prototype.slice.call(document.querySelectorAll('#wall .print'));
  if (!bar || !prints.length) return;

  var buttons = Array.prototype.slice.call(bar.querySelectorAll('button'));
  buttons.forEach(function (b) {
    var key = b.getAttribute('data-filter');
    var n = key === 'all' ? prints.length : prints.filter(function (p) {
      return p.getAttribute('data-cat').split(' ').indexOf(key) > -1;
    }).length;
    b.querySelector('[data-count]').textContent = n;
  });
  bar.hidden = false;

  bar.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-filter]');
    if (!b) return;
    var key = b.getAttribute('data-filter');
    buttons.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    var shown = 0;
    prints.forEach(function (p) {
      var show = key === 'all' || p.getAttribute('data-cat').split(' ').indexOf(key) > -1;
      p.hidden = !show;
      if (show) shown++;
    });
    var status = document.getElementById('filter-status');
    if (status) status.textContent = 'Zobrazených ' + shown + ' z ' + prints.length + ' fotografií.';
  });
})();
