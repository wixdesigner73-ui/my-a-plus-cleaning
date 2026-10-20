(function () {
  // Icon sprite (stroke icons, 24x24)
  var icons = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    sparkle: '<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/><path d="M19 3v4M17 5h4"/>',
    building: '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/>',
    box: '<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 002.5 2.5"/>',
    repeat: '<path d="M4 11V9a3 3 0 013-3h11l-3-3M20 13v2a3 3 0 01-3 3H6l3 3"/>',
    spray: '<path d="M8 10h6l1 3v8H7v-8z"/><path d="M9 10V7h5l2-2h3M4 6h1M4 9h1M4 3h1"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
    heart: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 9c0 6-8 11-8 11z"/>',
    ear: '<path d="M7 9a5 5 0 0110 0c0 3-3 4-3 7a2.5 2.5 0 01-5 0"/><path d="M11 9a1.5 1.5 0 013 0"/>',
    clip: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM8.5 12l2 2 4-4M8.5 17h7"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    cal: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>'
  };
  var s = '<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">';
  Object.keys(icons).forEach(function (k) {
    s += '<symbol id="i-' + k + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + icons[k] + '</symbol>';
  });
  document.body.insertAdjacentHTML('afterbegin', s + '</svg>');
  // Fill any <svg data-i="name"> placeholders
  document.querySelectorAll('svg[data-i]').forEach(function (el) {
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<use href="#i-' + el.dataset.i + '"/>';
  });

  // Mobile menu
  var btn = document.querySelector('.menu-btn'), list = document.querySelector('.nav ul');
  if (btn) btn.addEventListener('click', function () {
    var open = list.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    btn.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
  });

  // Header shadow
  var hdr = document.querySelector('.site-header');
  function onScroll() { hdr.classList.toggle('scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Scroll reveal
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12 });
    els.forEach(function (el) { io.observe(el); });
  } else els.forEach(function (el) { el.classList.add('in'); });

  // Forms. To store requests, set data-endpoint on the <form> (e.g. a Formspree URL).
  document.querySelectorAll('form.js-form').forEach(function (f) {
    f.setAttribute('novalidate', '');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      f.querySelectorAll('[required]').forEach(function (i) {
        var bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value));
        i.classList.toggle('err', bad); if (bad) ok = false;
      });
      if (!ok) { f.querySelector('.err').focus(); return; }
      var done = function () { f.classList.add('sent'); };
      var url = f.dataset.endpoint;
      if (url) {
        fetch(url, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
          .then(function (r) { if (r.ok) done(); else alert('Sorry, something went wrong. Please call (844) 362-7587.'); })
          .catch(function () { alert('Sorry, something went wrong. Please call (844) 362-7587.'); });
      } else done();
    });
  });
})();
