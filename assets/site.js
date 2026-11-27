/* ---------- Slow fades (shared, all pages) ---------- */
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  }, {threshold: 0.1});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
} else {
  document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
}
