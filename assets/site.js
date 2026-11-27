/* ---------- Slow fades (shared, all pages) ---------- */
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  }, {threshold: 0.1});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
} else {
  document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
}

/* ---------- Slide-out menu: the constant navigation ----------
   A hamburger in the header (and a Menu button in the phone thumb
   bar) slides a cream drawer in from the right over a fading scrim.
   Esc, the scrim, the close button, or any link tap closes it. */
(function(){
  var drawer = document.getElementById('siteDrawer');
  var scrim = document.getElementById('siteScrim');
  if (!drawer || !scrim) return;
  var openers = document.querySelectorAll('.drawer-open');
  var closer = drawer.querySelector('.drawer-close');
  var lastFocus = null;
  function setExpanded(v){
    openers.forEach(function(b){ b.setAttribute('aria-expanded', v ? 'true' : 'false'); });
  }
  function open(){
    lastFocus = document.activeElement;
    drawer.classList.add('open'); scrim.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-locked');
    setExpanded(true);
    if (closer) closer.focus();
  }
  function close(){
    drawer.classList.remove('open'); scrim.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-locked');
    setExpanded(false);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  openers.forEach(function(b){ b.addEventListener('click', open); });
  if (closer) closer.addEventListener('click', close);
  scrim.addEventListener('click', close);
  drawer.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', close); });
  document.addEventListener('keydown', function(e){
    if ((e.key === 'Escape' || e.key === 'Esc') && drawer.classList.contains('open')) close();
  });
})();

/* ---------- Welcome film: click-to-play, right file for the screen ----------
   Nothing is fetched until the visitor presses play. Phones get the light
   phone cut; larger screens get the WebM, with the MP4 master as fallback. */
(function(){
  var disc = document.getElementById('filmPlay');
  var screen = document.getElementById('filmScreen');
  if (!disc || !screen) return;
  disc.addEventListener('click', function(){
    var v = document.createElement('video');
    v.setAttribute('controls', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('preload', 'auto');
    v.poster = 'assets/film/welcome-prism-labs-poster.jpg';
    var small = window.matchMedia('(max-width: 640px)').matches;
    if (small) {
      var s1 = document.createElement('source');
      s1.src = 'assets/film/welcome-prism-labs-phone.mp4'; s1.type = 'video/mp4';
      v.appendChild(s1);
    } else {
      var s2 = document.createElement('source');
      s2.src = 'assets/film/welcome-prism-labs.webm'; s2.type = 'video/webm';
      v.appendChild(s2);
      var s3 = document.createElement('source');
      s3.src = 'assets/film/welcome-prism-labs.mp4'; s3.type = 'video/mp4';
      v.appendChild(s3);
    }
    screen.innerHTML = '';
    screen.appendChild(v);
    var p = v.play();
    if (p && p.catch) p.catch(function(){ /* controls are up; visitor can press play */ });
  });
})();
