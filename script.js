/* ================================================================
   script.js — Personal site interactivity
   Sections:
     1. Theme toggle (light / dark, persisted to localStorage)
     2. Hamburger menu (mobile sidebar open/close)
     3. Active nav link (highlights current section on scroll)
     4. Back to top button
     5. Post expand / collapse
   ================================================================ */


/* ================================================================
   1. THEME TOGGLE
   ================================================================ */
(function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Apply dark theme if saved, or if OS prefers dark and no saved preference
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

document.getElementById('themeToggle').addEventListener('click', function () {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';

  if (next === 'dark') {
    html.setAttribute('data-theme', 'dark');
  } else {
    html.removeAttribute('data-theme');   // light is the default
  }
  localStorage.setItem('theme', next);
});


/* ================================================================
   2. HAMBURGER MENU  (mobile sidebar)
   ================================================================ */
const hamburger      = document.getElementById('hamburger');
const sidebar        = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

function openSidebar() {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('active');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  hamburger.setAttribute('aria-label', 'Close navigation');
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('active');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Open navigation');
}

hamburger.addEventListener('click', function () {
  sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
});

// Close when clicking the dim overlay
sidebarOverlay.addEventListener('click', closeSidebar);

// Close when a nav link is tapped on mobile
sidebar.querySelectorAll('.nav-link').forEach(function (link) {
  link.addEventListener('click', function () {
    if (window.innerWidth < 900) closeSidebar();
  });
});

// Close if window is resized to desktop width while sidebar is open
window.addEventListener('resize', function () {
  if (window.innerWidth >= 900) closeSidebar();
});


/* ================================================================
   3. ACTIVE NAV LINK  (updates as you scroll through sections)
   ================================================================ */
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main .section');

function updateActiveNav() {
  // Find the section whose top edge has passed 30% down the viewport
  let currentId = '';
  const threshold = window.innerHeight * 0.3;

  sections.forEach(function (section) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= threshold) {
      currentId = section.id;
    }
  });

  navLinks.forEach(function (link) {
    const href = link.getAttribute('href');   // e.g. "#about"
    if (href === '#' + currentId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}


/* ================================================================
   4. BACK TO TOP BUTTON
   ================================================================ */
const backToTopBtn = document.getElementById('backToTop');

function updateScrollUI() {
  // Show back-to-top after scrolling 400px
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }

  updateActiveNav();
}

// Passive listener for smooth performance
window.addEventListener('scroll', updateScrollUI, { passive: true });

// Also run once on load to set initial state
updateScrollUI();

backToTopBtn.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ================================================================
   5. POST EXPAND / COLLAPSE
   Clicking a post header toggles the .open class, which drives
   all expand/collapse styles via CSS (max-height animation).
   ================================================================ */
document.querySelectorAll('.post-header').forEach(function (header) {
  function toggle() {
    const post = header.closest('.post');
    const isOpen = post.classList.contains('open');

    // Collapse all posts first (accordion behaviour — optional)
    // Remove the block below if you want multiple posts open at once
    document.querySelectorAll('.post.open').forEach(function (openPost) {
      openPost.classList.remove('open');
      openPost.querySelector('.post-header').setAttribute('aria-expanded', 'false');
      openPost.querySelector('.post-body').setAttribute('aria-hidden', 'true');
    });

    // If this post wasn't already open, open it
    if (!isOpen) {
      post.classList.add('open');
      header.setAttribute('aria-expanded', 'true');
      post.querySelector('.post-body').setAttribute('aria-hidden', 'false');

      // Scroll the post gently into view after a short delay
      // (lets the animation start before scrolling)
      setTimeout(function () {
        post.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 60);
    }
  }

  // Click
  header.addEventListener('click', toggle);

  // Keyboard: Enter or Space activates it (since role="button")
  header.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });
});
