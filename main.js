/**
 * AURELIA STUDIO — Main Scripts
 * Intro, scroll reveal, navigation, mobile menu, form, toast system.
 */
(function () {
  'use strict';

  /* ---------------------------------------- */
  /* INTRO                                    */
  /* ---------------------------------------- */
  var introOverlay = document.getElementById('intro-overlay');
  var introCanvas  = document.getElementById('intro-canvas');
  var skipBtn      = document.getElementById('skip-intro');
  var mainSite     = document.getElementById('main-site');
  var finished     = false;
  var autoTimer    = null;

  function exitIntro() {
    if (finished) return;
    finished = true;
    if (autoTimer) clearTimeout(autoTimer);
    introOverlay.classList.add('fade-out');
    document.body.classList.remove('intro-active');
    if (mainSite) {
      mainSite.classList.remove('hidden');
      mainSite.style.opacity = '1';
      mainSite.style.visibility = 'visible';
      mainSite.style.pointerEvents = 'auto';
    }
    setTimeout(function () {
      introOverlay.style.display = 'none';
    }, 900);
  }

  if (skipBtn) skipBtn.addEventListener('click', exitIntro);
  autoTimer = setTimeout(exitIntro, 3500);

  /* ---------------------------------------- */
  /* HERO SLIDESHOW                            */
  /* ---------------------------------------- */
  var slides = document.querySelectorAll('.hero-slide');
  var dots = document.querySelectorAll('.hero-dot');
  var heroCopy = document.getElementById('hero-copy');
  var currentSlide = 0;
  var slideInterval = null;
  var isPaused = false;
  var slideTimer = 5500; // ms per slide

  // Content per slide
  var slideContent = [
    {
      eyebrow: 'New Collection 2026',
      titleFirst: 'Scented Vessels',
      titleAccent: 'for the Home',
      desc: 'Hand-blown glass vessels and ceramic diffusers designed to fragrance a room through presence, not perfume.'
    },
    {
      eyebrow: 'Candle Collection',
      titleFirst: 'Quiet Light',
      titleAccent: 'from Natural Wax',
      desc: 'Pure soy and beeswax candles poured into ceramic vessels. Unscented, or infused with cedar, amber, and white tea.'
    },
    {
      eyebrow: 'Diffuser Oils',
      titleFirst: 'Room Perfume',
      titleAccent: 'by Design',
      desc: 'Reed diffusers and fragrance oils formulated for specific spaces — bedrooms, living rooms, and quiet working areas.'
    }
  ];

  function goToSlide(index) {
    if (index === currentSlide) return;
    if (!slides[index] || !dots[index]) return;

    // Fade out current
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    dots[currentSlide].setAttribute('aria-selected', 'false');

    // Fade text
    if (heroCopy) heroCopy.classList.add('fading');

    setTimeout(function () {
      currentSlide = index;

      // Update text
      if (heroCopy && slideContent[index]) {
        var content = slideContent[index];
        var eyebrow = heroCopy.querySelector('.hero-eyebrow');
        var titleLines = heroCopy.querySelectorAll('.title-line');
        var desc = heroCopy.querySelector('.hero-desc');
        if (eyebrow) eyebrow.textContent = content.eyebrow;
        if (titleLines[0]) titleLines[0].textContent = content.titleFirst;
        if (titleLines[1]) titleLines[1].textContent = content.titleAccent;
        if (desc) desc.textContent = content.desc;
      }

      // Fade in new
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
      dots[currentSlide].setAttribute('aria-selected', 'true');

      setTimeout(function () {
        if (heroCopy) heroCopy.classList.remove('fading');
      }, 50);
    }, 600);
  }

  function nextSlide() {
    var next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }

  function startSlideshow() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(function () {
      if (!isPaused) nextSlide();
    }, slideTimer);
  }

  function stopSlideshow() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  if (slides.length > 1 && dots.length > 1) {

    // --- Reduced motion check (defined early so all handlers can use it) ---
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isPlaying = !prefersReduced; // autoplay state: true by default, false in reduced mode

    // --- Dot click handlers ---
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = parseInt(this.getAttribute('data-goto'));
        if (!isNaN(index)) {
          goToSlide(index);
          // Only reset autoplay timer if slideshow is currently playing
          if (isPlaying) startSlideshow();
        }
      });
    });

    // --- Pause on hover (only when not in reduced-motion mode) ---
    if (!prefersReduced) {
      var heroSection = document.getElementById('hero');
      if (heroSection) {
        heroSection.addEventListener('mouseenter', function () {
          isPaused = true;
        });
        heroSection.addEventListener('mouseleave', function () {
          isPaused = false;
        });
      }
    }

    // --- Keyboard arrows: only when hero or slideshow controls are focused ---
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var focused = document.activeElement;
      var hero = document.getElementById('hero');
      var controls = document.querySelector('.hero-slideshow-controls');
      if (!hero || !controls) return;
      if (!hero.contains(focused) && !controls.contains(focused)) return;
      if (e.key === 'ArrowRight') { nextSlide(); if (isPlaying) startSlideshow(); }
      if (e.key === 'ArrowLeft') {
        var prev = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prev);
        if (isPlaying) startSlideshow();
      }
    });

    // --- Play/pause toggle (always wired) ---
    var toggleBtn = document.getElementById('hero-toggle');
    if (toggleBtn) {
      // Set initial state in reduced-motion mode
      if (prefersReduced) {
        isPaused = true;
        toggleBtn.setAttribute('data-state', 'paused');
        toggleBtn.setAttribute('aria-label', 'Play slideshow');
      }
      toggleBtn.addEventListener('click', function () {
        var state = this.getAttribute('data-state');
        if (state === 'playing') {
          // Pause
          isPaused = true;
          isPlaying = false;
          stopSlideshow();
          this.setAttribute('data-state', 'paused');
          this.setAttribute('aria-label', 'Play slideshow');
        } else {
          // Play
          isPaused = false;
          isPlaying = true;
          startSlideshow();
          this.setAttribute('data-state', 'playing');
          this.setAttribute('aria-label', 'Pause slideshow');
        }
      });
    }

    // --- Auto-start and tab visibility (only in normal motion mode) ---
    if (!prefersReduced) {
      startSlideshow();
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) stopSlideshow(); else startSlideshow();
      });
    }
  }

  /* ---------------------------------------- */
  /* SCROLL REVEAL (IntersectionObserver)     */
  /* ---------------------------------------- */
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.scroll-reveal');
    if (!reveals.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

      reveals.forEach(function (el) { observer.observe(el); });

      // Fallback: reveal visible elements after delay
      setTimeout(function () {
        reveals.forEach(function (el) {
          if (el.getBoundingClientRect().top < window.innerHeight - 40 && !el.classList.contains('revealed')) {
            el.classList.add('revealed');
          }
        });
      }, 800);
    } else {
      reveals.forEach(function (el) { el.classList.add('revealed'); });
    }
  }

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
  } else {
    initScrollReveal();
  }

  /* ---------------------------------------- */
  /* NAVBAR SCROLL STATE                      */
  /* ---------------------------------------- */
  var navbar = document.getElementById('navbar');
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        if (navbar) {
          if (window.scrollY > 80) navbar.classList.add('scrolled');
          else navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ---------------------------------------- */
  /* MOBILE MENU                              */
  /* ---------------------------------------- */
  var mobileToggle = document.getElementById('mobile-menu-toggle');
  var mobilePanel  = document.getElementById('main-nav-mobile');
  var mobileNavLinks = document.querySelectorAll('.nav-links-mobile a');

  function openMobileMenu() {
    mobilePanel.classList.add('open');
    mobilePanel.setAttribute('aria-hidden', 'false');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('intro-active');
  }

  function closeMobileMenu() {
    mobilePanel.classList.remove('open');
    mobilePanel.setAttribute('aria-hidden', 'true');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('intro-active');
  }

  function isMobileMenuOpen() {
    return mobilePanel && mobilePanel.classList.contains('open');
  }

  if (mobileToggle && mobilePanel) {
    mobileToggle.addEventListener('click', function () {
      if (isMobileMenuOpen()) closeMobileMenu(); else openMobileMenu();
    });

    mobileNavLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileMenu();
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isMobileMenuOpen()) {
        closeMobileMenu();
        mobileToggle.focus();
      }
    });

    mobilePanel.addEventListener('click', function (e) {
      if (e.target === mobilePanel) closeMobileMenu();
    });
  }

  /* ---------------------------------------- */
  /* SMOOTH SCROLL                            */
  /* ---------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) { e.preventDefault(); return; }
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        closeMobileMenu();
      }
    });
  });

  /* ---------------------------------------- */
  /* ACTIVE NAV TRACKING                      */
  /* ---------------------------------------- */
  var sections = document.querySelectorAll('section[id]');
  var allNavLinks = document.querySelectorAll('.nav-links a, .nav-links-mobile a');

  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          allNavLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-35% 0px -35% 0px', threshold: 0 });

    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------------------------------------- */
  /* TOAST SYSTEM                             */
  /* ---------------------------------------- */
  var activeToast = null;

  function showToast(message) {
    if (activeToast) {
      activeToast.remove();
      activeToast = null;
    }
    var toast = document.createElement('div');
    toast.className = 'soon-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;
    document.body.appendChild(toast);
    activeToast = toast;
    setTimeout(function () {
      toast.style.opacity = '0';
      if (activeToast === toast) activeToast = null;
      setTimeout(function () {
        if (toast.parentNode) toast.remove();
      }, 400);
    }, 2500);
  }

  /* ---------------------------------------- */
  /* DEAD FOOTER / JOURNAL LINKS              */
  /* ---------------------------------------- */
  document.querySelectorAll('.footer-link-soon, .journal-link[data-coming-soon]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var label = this.getAttribute('data-coming-soon') || this.textContent.trim();
      var name = label.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
      showToast(name + ' — coming soon');
    });
  });

  /* ---------------------------------------- */
  /* FORM HANDLING                            */
  /* ---------------------------------------- */
  var contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = this.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Validate required fields
      var isValid = true;
      this.querySelectorAll('[required]').forEach(function (field) {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = 'rgba(200, 80, 80, 0.5)';
          setTimeout(function () { field.style.borderColor = ''; }, 3000);
        }
      });

      if (!isValid) {
        btn.textContent = originalText;
        btn.disabled = false;
        return;
      }

      setTimeout(function () {
        btn.textContent = 'Message Sent';
        btn.style.borderColor = 'rgba(201, 168, 106, 0.5)';
        btn.style.color = 'var(--gold-light)';
        setTimeout(function () {
          btn.textContent = originalText;
          btn.style.borderColor = '';
          btn.style.color = '';
          btn.disabled = false;
          contactForm.reset();
        }, 3000);
      }, 1200);
    });
  }

})();
