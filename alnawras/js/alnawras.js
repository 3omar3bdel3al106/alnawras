document.addEventListener('DOMContentLoaded', () => {

  /* ===== Navbar shadow + back-to-top ===== */
  const navbar = document.getElementById('navbar');
  const toTop = document.getElementById('toTop');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
    if (toTop) toTop.classList.toggle('show', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll);
  onScroll();
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ===== Mobile menu ===== */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
  });

  /* ===== Highlight current page in menu ===== */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === page);
  });

  /* ===== Images: keep the placeholder if a photo is missing ===== */
  document.querySelectorAll('.media img').forEach(img => {
    const fail = () => img.classList.add('broken');
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener('error', fail);
  });
  document.querySelectorAll('.marquee img').forEach(img => {
    const hide = () => { img.style.display = 'none'; };
    if (img.complete && img.naturalWidth === 0) hide();
    img.addEventListener('error', hide);
  });

  /* ===== Scroll reveal ===== */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => {
    const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 0.08}s`;
    revealObserver.observe(el);
  });

  /* ===== Animated counters ===== */
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      el.firstChild.textContent = '0';
      const start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / 1800, 1);
        el.firstChild.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(c => counterObserver.observe(c));

  /* ===== Gallery filter ===== */
  const filters = document.querySelectorAll('.filter');
  const items = document.querySelectorAll('.gallery__item');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      items.forEach(item => item.classList.toggle('hide', cat !== 'all' && item.dataset.cat !== cat));
    });
  });

  /* ===== Lightbox ===== */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg = document.getElementById('lightboxImg');
    const lbCap = document.getElementById('lightboxCaption');
    items.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (!img || img.classList.contains('broken')) return;
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lbCap.textContent = item.querySelector('h4').textContent;
        lightbox.classList.add('open');
      });
    });
    const close = () => lightbox.classList.remove('open');
    document.getElementById('lightboxClose').addEventListener('click', close);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  /* ===== Contact form ===== */
  const form = document.getElementById('contactForm');
  if (form) {
    const status = document.getElementById('formStatus');
    const params = new URLSearchParams(location.search);
    if (params.get('product')) {
      const select = form.querySelector('[name="product"]');
      [...select.options].forEach(o => { if (o.value === params.get('product')) o.selected = true; });
    }
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        const ok = field.type === 'email'
          ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())
          : field.value.trim() !== '';
        field.classList.toggle('invalid', !ok);
        if (!ok) valid = false;
      });
      if (!valid) {
        status.textContent = 'Please fill in the required fields correctly.';
        status.className = 'form-status err';
        return;
      }
      // TODO: connect to a real backend or a service like Formspree
      status.textContent = 'Thank you. Our engineering team will contact you shortly.';
      status.className = 'form-status ok';
      form.reset();
    });
  }

  /* ===== Footer year ===== */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
