// ===== SETTINGS: change these 2 lines =====
const FORMSPREE = 'https://formspree.io/f/YOUR_FORM_ID'; // paste your Formspree link
const WHATSAPP  = '85512345678';                         // reception number, no + or spaces
// ==========================================

// 1. Animated headlines: each word slides up
document.querySelectorAll('h1.t').forEach(h => {
  let d = 0;
  const words = h.textContent.trim().split(/\s+/);
  h.innerHTML = words.map(w => `<span class="w"><i style="animation-delay:${(d++ * .12)}s">${w}</i></span>`).join(' ');
});

// 2. Navbar
const nav = document.getElementById('nav'), menu = document.getElementById('menu');
addEventListener('scroll', () => nav.classList.toggle('solid', scrollY > 40));
document.getElementById('burger').addEventListener('click', () => menu.classList.toggle('open'));

// 3. Reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// 4. Page switching (Home, Rooms, Contact)
function show(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('on', p.id === id));
  document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.page === id));
  menu.classList.remove('open');
  scrollTo(0, 0);
}
document.addEventListener('click', e => {
  const a = e.target.closest('[data-page]');
  if (a) { e.preventDefault(); show(a.dataset.page); }
});

// 5. Dates: no past days, check-out after check-in
const today = new Date().toISOString().split('T')[0];
['qi', 'qo', 'ci', 'co'].forEach(id => document.getElementById(id).min = today);
function link(inId, outId) {
  const i = document.getElementById(inId), o = document.getElementById(outId);
  i.addEventListener('change', () => { o.min = i.value || today; if (o.value && o.value < i.value) o.value = ''; });
}
link('qi', 'qo'); link('ci', 'co');

// 6. Quick booking bar sends dates to the booking form
document.getElementById('quick').addEventListener('submit', e => {
  e.preventDefault();
  ci.value = qi.value; co.value = qo.value; cg.selectedIndex = qg.selectedIndex;
  show('contact');
});

// 7. Booking form: email to owner (Formspree) + WhatsApp to reception
document.getElementById('form').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target, msg = document.getElementById('msg');
  const d = Object.fromEntries(new FormData(form));

  const text =
    `New booking - Yuth Hotel\n` +
    `Name: ${d.name}\nPhone: ${d.phone}\nEmail: ${d.email}\n` +
    `Room: ${d.room}\nGuests: ${d.guests}\n` +
    `Check-in: ${d.checkin}\nCheck-out: ${d.checkout}\n` +
    `Request: ${d.request || '-'}`;
  const wa = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

  msg.textContent = 'Sending...';
  let emailOk = false;
  if (!FORMSPREE.includes('YOUR_FORM_ID')) {
    try {
      const r = await fetch(FORMSPREE, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      emailOk = r.ok;
    } catch (err) { emailOk = false; }
  }

  msg.innerHTML = (emailOk ? 'Thank you! Your request was sent. ' : 'Almost done! ') +
    'Tap the button to also send it to our reception on WhatsApp:<br>' +
    `<a class="btn wa" style="margin-top:12px" href="${wa}" target="_blank" rel="noopener">Send to reception on WhatsApp</a>`;
  form.reset();
});