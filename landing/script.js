// SponsorLens Landing — Interaction Layer
// No tracking. No analytics. No external calls.

(function() {
  'use strict';

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Sticky nav background on scroll
  var nav = document.getElementById('nav');
  if (nav) {
    var lastScroll = 0;
    window.addEventListener('scroll', function() {
      var current = window.scrollY;
      if (current > 40) {
        nav.style.borderBottomColor = 'rgba(216, 222, 228, 0.8)';
        nav.style.background = 'rgba(250, 251, 252, 0.95)';
      } else {
        nav.style.borderBottomColor = 'rgba(232, 236, 240, 1)';
        nav.style.background = 'rgba(250, 251, 252, 0.85)';
      }
      lastScroll = current;
    }, { passive: true });
  }

  // Intersection Observer — fade-in on scroll
  if ('IntersectionObserver' in window) {
    var targets = document.querySelectorAll('.card, .feature, .demo-card, .trust-item, .install-step, .message-studio');
    
    // Reset initial state
    targets.forEach(function(el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.animation = 'none';
    });

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.animation = '';
          entry.target.style.opacity = '';
          entry.target.style.transform = '';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function(el) {
      observer.observe(el);
    });
  }

  // Message studio variant switching
  var variants = document.querySelectorAll('.variant');
  var messages = [
    "Could you confirm whether candidates with F-1 OPT/CPT work authorization are considered for this role? I understand this depends on company policy and role requirements.",
    "I'm very interested in this position and wanted to reach out directly. I'm currently authorized to work in the U.S. through F-1 OPT and would appreciate knowing whether this role considers candidates who may require future sponsorship. I understand this varies by role and company policy.",
    "As a candidate with demonstrated work authorization through the F-1 OPT program, I bring both immediate eligibility and a strong commitment to contributing long-term. I'd welcome the opportunity to discuss how my background aligns with this role's requirements."
  ];
  
  var messageEl = document.querySelector('.studio-message p');
  variants.forEach(function(btn, index) {
    btn.addEventListener('click', function() {
      variants.forEach(function(v) { v.classList.remove('active'); });
      btn.classList.add('active');
      if (messageEl && messages[index]) {
        messageEl.textContent = '"' + messages[index] + '"';
      }
    });
  });
})();
