// Sinag Events — site interactions
document.addEventListener('DOMContentLoaded', () => {

  // Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu toggle
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Reveal-on-scroll for section content
  const revealTargets = document.querySelectorAll(
    '.section__label-col, .section__body-col, .events__inner, .footer'
  );
  revealTargets.forEach(el => el.setAttribute('data-reveal', ''));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => io.observe(el));

  // Hero star-trail now animates continuously via CSS (see .hero__trail path)

  // ---------------------------------------------------------
  // Workshops announcement — temporary campaign
  // Popup auto-opens once per browser session; the "Workshops"
  // nav link and homepage banner let people reopen it (or read
  // the schedule directly) any time, even after they close it.
  // Everything tagged .js-campaign-only disappears on its own
  // once the last workshop's end date passes.
  // ---------------------------------------------------------
  const PROMO_CAMPAIGN_END = new Date('2026-09-06T00:00:00+03:00'); // day after last workshop ends
  const PROMO_SESSION_KEY = 'sinagWorkshopsPromoSeen';
  const campaignActive = new Date() < PROMO_CAMPAIGN_END;

  const promoBackdrop = document.getElementById('promoBackdrop');
  if (promoBackdrop) {
    const openPromo = () => {
      promoBackdrop.hidden = false;
      requestAnimationFrame(() => promoBackdrop.classList.add('is-visible'));
      document.body.style.overflow = 'hidden';
    };
    const closePromo = () => {
      promoBackdrop.classList.remove('is-visible');
      document.body.style.overflow = '';
      sessionStorage.setItem(PROMO_SESSION_KEY, '1');
      setTimeout(() => { promoBackdrop.hidden = true; }, 350);
    };

    if (campaignActive && !sessionStorage.getItem(PROMO_SESSION_KEY)) {
      setTimeout(openPromo, 1200);
    }

    document.getElementById('promoClose')?.addEventListener('click', closePromo);
    promoBackdrop.addEventListener('click', (e) => {
      if (e.target === promoBackdrop) closePromo();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !promoBackdrop.hidden) closePromo();
    });

    // Any element with data-open-promo reopens the same modal on demand
    document.querySelectorAll('[data-open-promo]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openPromo();
      });
    });
  }

  // Once the campaign window passes, quietly remove every
  // campaign-only element (nav link, homepage banner, popup)
  if (!campaignActive) {
    document.querySelectorAll('.js-campaign-only').forEach((el) => el.remove());
  }

  // ---------------------------------------------------------
  // Hero star field — subtle, versatile twinkle, kept out of
  // the way of the logo/text for readability
  // ---------------------------------------------------------
  const starField = document.getElementById('heroStars');
  if (starField) {
    const STAR_COUNT = 26;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < STAR_COUNT; i++) {
      const star = document.createElement('span');
      const isDot = Math.random() > 0.6;
      star.className = isDot ? 'star star--dot' : 'star';

      // keep stars mostly along the edges / corners, away from
      // the centered logo and tagline
      let top, left;
      const zone = Math.random();
      if (zone < 0.4) {
        // top band
        top = 4 + Math.random() * 22;
        left = 3 + Math.random() * 94;
      } else if (zone < 0.75) {
        // side columns
        top = 18 + Math.random() * 55;
        left = Math.random() > 0.5 ? (2 + Math.random() * 14) : (84 + Math.random() * 14);
      } else {
        // lower band, above the services line
        top = 62 + Math.random() * 16;
        left = 3 + Math.random() * 94;
      }

      const size = (2 + Math.random() * 3).toFixed(1);
      const duration = (3 + Math.random() * 4).toFixed(1);
      const delay = (Math.random() * 6).toFixed(1);
      const peak = (0.3 + Math.random() * 0.35).toFixed(2);

      star.style.top = `${top}%`;
      star.style.left = `${left}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.setProperty('--peak', peak);
      star.style.animationDuration = `${duration}s`;
      star.style.animationDelay = `${delay}s`;

      frag.appendChild(star);
    }
    starField.appendChild(frag);
  }

  // ---------------------------------------------------------
  // Booking form — sends details via WhatsApp or email, no backend
  // ---------------------------------------------------------
  const bookingForm = document.getElementById('bookingForm');
  const bookingNote = document.getElementById('bookingFormNote');
  const STUDIO_WHATSAPP = '97433043148';
  const STUDIO_EMAIL = 'hello@sinagevents.com'; // TODO: replace with your real inbox

  function buildBookingMessage(data) {
    const lines = [
      'New enquiry from the Sinag Events website:',
      `Name: ${data.name || '-'}`,
      `Phone: ${data.phone || '-'}`,
      `Email: ${data.email || '-'}`,
      `Service: ${data.service || '-'}`,
      `Preferred date: ${data.date || '-'}`,
      `Details: ${data.message || '-'}`,
    ];
    return lines.join('\n');
  }

  if (bookingForm) {
    bookingForm.querySelectorAll('button[data-send]').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();

        const requiredOk = bookingForm.checkValidity();
        if (!requiredOk) {
          bookingForm.reportValidity();
          bookingNote.textContent = 'Please fill in the required fields first.';
          bookingNote.className = 'booking-form__note is-error';
          return;
        }

        const data = Object.fromEntries(new FormData(bookingForm).entries());
        const message = buildBookingMessage(data);
        const mode = button.getAttribute('data-send');

        if (mode === 'whatsapp') {
          window.open(`https://wa.me/${STUDIO_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
          bookingNote.textContent = 'Opening WhatsApp with your details filled in…';
        } else {
          const subject = encodeURIComponent(`Booking enquiry — ${data.service || 'Sinag Events'}`);
          const body = encodeURIComponent(message);
          window.location.href = `mailto:${STUDIO_EMAIL}?subject=${subject}&body=${body}`;
          bookingNote.textContent = 'Opening your email app with your details filled in…';
        }
        bookingNote.className = 'booking-form__note is-success';
      });
    });
  }

  // ---------------------------------------------------------
  // Live hours: open 2:00 PM–10:00 PM every day, closed Friday
  // Doha is UTC+3 year-round (no daylight saving)
  // ---------------------------------------------------------
  function getDohaNow() {
    const utc = new Date(Date.now());
    const utcMillis = utc.getTime() + utc.getTimezoneOffset() * 60000;
    return new Date(utcMillis + 3 * 60 * 60000);
  }

  function computeStatus() {
    const now = getDohaNow();
    const day = now.getDay(); // 0 Sun ... 5 Fri ... 6 Sat
    const minutes = now.getHours() * 60 + now.getMinutes();

    const isFriday = day === 5;
    const openMin = 14 * 60;  // 2:00 PM
    const closeMin = 22 * 60; // 10:00 PM

    const isOpen = !isFriday && minutes >= openMin && minutes < closeMin;
    return { isOpen, day, isFriday };
  }

  function paintStatus(pill, dot, text) {
    if (!pill) return;
    const { isOpen } = computeStatus();
    pill.classList.remove('is-open', 'is-closed');
    pill.classList.add(isOpen ? 'is-open' : 'is-closed');
    if (text) text.textContent = isOpen ? 'Open now' : 'Closed now';
  }

  function updateAllStatus() {
    paintStatus(document.getElementById('statusPill'), document.getElementById('statusDot'), document.getElementById('statusText'));
    paintStatus(document.getElementById('statusPillMobile'), document.getElementById('statusDotMobile'), document.getElementById('statusTextMobile'));
    paintStatus(document.getElementById('statusPillLarge'), document.getElementById('statusDotLarge'), document.getElementById('statusTextLarge'));

    // Highlight today's row in the hours list
    const { day } = computeStatus();
    document.querySelectorAll('.hours__list li').forEach(li => {
      li.classList.toggle('is-active-day', Number(li.getAttribute('data-day')) === day);
    });
  }

  updateAllStatus();
  setInterval(updateAllStatus, 60 * 1000); // refresh every minute

  // ---------------------------------------------------------
  // Floating WhatsApp button — opens a small menu to choose
  // between the two contact numbers
  // ---------------------------------------------------------
  const floatWaToggle = document.getElementById('floatWaToggle');
  const floatWaMenu = document.getElementById('floatWaMenu');
  if (floatWaToggle && floatWaMenu) {
    const closeWaMenu = () => {
      floatWaMenu.classList.remove('is-open');
      floatWaMenu.setAttribute('aria-hidden', 'true');
      floatWaToggle.setAttribute('aria-expanded', 'false');
    };
    const openWaMenu = () => {
      floatWaMenu.classList.add('is-open');
      floatWaMenu.setAttribute('aria-hidden', 'false');
      floatWaToggle.setAttribute('aria-expanded', 'true');
    };

    floatWaToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = floatWaMenu.classList.contains('is-open');
      isOpen ? closeWaMenu() : openWaMenu();
    });
    document.addEventListener('click', (e) => {
      if (!floatWaMenu.contains(e.target) && e.target !== floatWaToggle) closeWaMenu();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeWaMenu();
    });
  }

  // ---------------------------------------------------------
  // Back to top
  // ---------------------------------------------------------
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.hidden = false; // let CSS opacity/transform handle visibility
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 700);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------------------------------------------------------
  // Hero cursor sparkle trail — small gold stars that follow
  // the pointer through the hero, desktop only, very light touch
  // ---------------------------------------------------------
  const heroSection = document.querySelector('.hero');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (heroSection && isFinePointer && !prefersReducedMotion) {
    let lastSpark = 0;
    heroSection.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastSpark < 70) return; // throttle so it stays subtle, not a firehose
      lastSpark = now;

      const sparkle = document.createElement('span');
      sparkle.className = 'sparkle';
      sparkle.style.left = `${e.clientX}px`;
      sparkle.style.top = `${e.clientY}px`;
      const size = 3 + Math.random() * 4;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 950);
    });
  }

  // Slim the nav bar shadow after scrolling
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.background = window.scrollY > 40
        ? 'linear-gradient(to bottom, rgba(10,9,8,.98), rgba(10,9,8,.85))'
        : 'linear-gradient(to bottom, rgba(10,9,8,.92), rgba(10,9,8,0))';
    }, { passive: true });
  }
});
