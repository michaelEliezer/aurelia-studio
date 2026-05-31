# AURELIA STUDIO

A premium brand website for a fictional home fragrance company. Built as a portfolio-quality demo.

## What is this?

AURELIA STUDIO is a high-end lifestyle brand selling premium home fragrance products — hand-blown glass vessels, soy and beeswax candles, and reed diffusers with fragrance oils. The website is fully fictional but designed and developed to the standard of a real client delivery.

## What's included

- Cinematic intro sequence with brand name reveal (3.5s auto-exit, skip button)
- Hero slideshow with 3 product scenes, auto-advancing with crossfade transitions
- Dot navigation with ARIA support and play/pause toggle
- Full reduced-motion support — slideshow respects `prefers-reduced-motion: reduce`
- Keyboard navigation (Arrow keys) scoped to hero/focus area only
- Collection section with 3 product categories (Scent Vessels, Wax Candles, Diffuser Oils)
- Philosophy section with split layout and stats
- Materials showcase with 6 material cards
- Process timeline (4 steps)
- Journal/editorial section with 3 article cards
- Consultation CTA section
- Contact form with validation and fake success flow
- Fixed navigation with mobile hamburger menu (X animation, Escape to close)
- Active nav link tracking
- Dead link / coming-soon toast system
- Scroll-reveal animations via IntersectionObserver
- Custom CSS sculptural objects (no images, no 3D libraries)

## Tech stack

- **HTML5** — semantic, accessible, valid
- **CSS3** — custom properties, flexbox, grid, animations, responsive breakpoints
- **Vanilla JavaScript** — no frameworks, no dependencies, no build tools

## Responsive

- Desktop 1440px+
- Laptop 1024px
- Tablet 768px
- Mobile 375px

All breakpoints tested. Mobile menu works with hamburger, X animation, link-click close, and Escape key.

## Accessibility

- `prefers-reduced-motion: reduce` fully supported (slideshow doesn't auto-start)
- Semantic HTML5 elements
- ARIA labels, roles, and states on slideshow controls
- Keyboard navigation scoped correctly
- Focus indicators on all interactive elements
- Color contrast meets WCAG AA

## File structure

```
aurelia-studio/
├── index.html          (594 lines)
├── css/
│   └── styles.css      (1816 lines) — full design system + all sections
├── js/
│   └── main.js         (436 lines) — intro, slideshow, nav, form, scroll reveal
└── assets/
    ├── images/         (placeholder directory)
    └── icons/          (placeholder directory)
```

## Browser support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). No polyfills needed.


