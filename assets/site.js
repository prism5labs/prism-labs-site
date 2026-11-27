/* ---------- Slow fades (shared, all pages) ---------- */
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  }, {threshold: 0.1});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
} else {
  document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
}

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
