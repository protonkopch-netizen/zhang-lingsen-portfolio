const body = document.body;
const loader = document.querySelector('.loader b');
let count = 0;
const counter = setInterval(() => {
  count = Math.min(100, count + Math.ceil(Math.random() * 17));
  loader.textContent = String(count).padStart(2, '0');
  if (count >= 100) {
    clearInterval(counter);
    setTimeout(() => body.classList.add('loaded'), 280);
  }
}, 65);

const cursor = document.querySelector('.cursor');
window.addEventListener('pointermove', (event) => {
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
  cursor.classList.add('on');
});
window.addEventListener('pointerout', (event) => {
  if (!event.relatedTarget) cursor.classList.remove('on');
});
document.querySelectorAll('a').forEach((link) => {
  link.addEventListener('pointerenter', () => cursor.classList.add('big'));
  link.addEventListener('pointerleave', () => cursor.classList.remove('big'));
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.13 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const numberObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const target = entry.target;
    const end = Number(target.dataset.count);
    const suffix = target.querySelector('small')?.outerHTML || '';
    const started = performance.now();
    const duration = 1100;
    const tick = (now) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      const value = end * eased;
      target.innerHTML = `${Number.isInteger(end) ? Math.round(value) : value.toFixed(2)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    numberObserver.unobserve(target);
  });
}, { threshold: 0.4 });
document.querySelectorAll('.stat strong[data-count]').forEach((element) => numberObserver.observe(element));

const preview = document.querySelector('.preview');
const previewImg = preview.querySelector('img');
document.querySelectorAll('.project-row').forEach((row) => {
  row.addEventListener('pointerenter', () => {
    previewImg.src = row.dataset.image;
    preview.classList.add('show');
  });
  row.addEventListener('pointermove', (event) => {
    preview.style.left = `${event.clientX}px`;
    preview.style.top = `${event.clientY}px`;
  });
  row.addEventListener('pointerleave', () => preview.classList.remove('show'));
});

const glow = document.querySelector('.hero-glow');
window.addEventListener('pointermove', (event) => {
  if (window.innerWidth < 700) return;
  const x = (event.clientX / window.innerWidth - .5) * 18;
  const y = (event.clientY / window.innerHeight - .5) * 18;
  glow.style.transform = `translate(${x}px, ${y}px)`;
});
