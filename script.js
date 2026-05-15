document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile navigation toggle
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.querySelector('.primary-navigation');

    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            primaryNav.setAttribute('data-visible', !isExpanded);
        });

        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.setAttribute('aria-expanded', 'false');
                primaryNav.setAttribute('data-visible', 'false');
            });
        });
    }

    // 6. Inquiry form -> open WhatsApp with prefilled message
    const inquiryForm = document.getElementById('inquiry-form');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Inline validation
            const inputs = inquiryForm.querySelectorAll('.form-input[required], .form-input');
            let valid = true;
            inputs.forEach(inp => {
                const val = inp.value.trim();
                if (inp.hasAttribute('required') && !val) {
                    inp.classList.add('invalid');
                    valid = false;
                } else {
                    inp.classList.remove('invalid');
                    if (val) inp.classList.add('valid');
                }
            });
            if (!valid) {
                // focus first invalid
                const firstInvalid = inquiryForm.querySelector('.form-input.invalid');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            const get = id => (document.getElementById(id) || {}).value || '';
            const fullName = get('fullName').trim();
            const companyName = get('companyName').trim();
            const phone = get('phone').trim();
            const email = get('email').trim();
            // Use the visible option text so the message shows 'Onion Powder' and '25–100kg'
            const productEl = document.getElementById('product');
            const product = productEl && productEl.options && productEl.selectedIndex >= 0
                ? productEl.options[productEl.selectedIndex].text.trim()
                : '';
            const quantityEl = document.getElementById('quantity');
            const quantity = quantityEl && quantityEl.options && quantityEl.selectedIndex >= 0
                ? quantityEl.options[quantityEl.selectedIndex].text.trim()
                : '';
            const message = get('message').trim();

            // Build structured WhatsApp message similar to the example template
            const brandName = (document.querySelector('.brand-name') || {}).textContent || 'Team';
            // Build message using real newlines; we'll encode later for the URL.
            let text = `Hello ${brandName} Team,\n`;
            text += `I would like to inquire about a product:\n\n`;
            text += `═══ Customer Details ═══\n`;
            if (fullName) text += `Name: ${fullName}\n`;
            if (companyName) text += `Company: ${companyName}\n`;
            if (phone) text += `Contact: ${phone}\n`;
            if (email) text += `Email: ${email}\n`;
            // If the form contains an address field, include it. Otherwise skip.
            const addrEl = document.getElementById('address');
            const address = addrEl ? (addrEl.value || '').trim() : '';
            if (address) text += `Address: ${address}\n`;
            text += `\n`;
            text += `═══ Requirement Details ═══\n`;
            if (product) text += `Product Interested In: ${product}\n`;
            if (quantity) text += `Quantity Required: ${quantity}\n`;
            if (message) text += `\nMessage: ${message}\n`;
            text += `\nPlease assist me further.\nThank you.`;

            // Send to WhatsApp (opens in a new tab). Change number here if needed.
            const waNumber = '918200029583';
            const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;

            // Open WhatsApp in a new tab/window
            window.open(waUrl, '_blank');

            // Replace form with thank-you card
            const thank = document.createElement('div');
            thank.className = 'thank-card';
            thank.innerHTML = '🌿 <strong>Thank you!</strong> We\'ll get back to you within 24 hours.';
            inquiryForm.parentElement.replaceChild(thank, inquiryForm);
        });
    }

    // 7. Get a Quote CTA -> scroll to contact form and focus first input
    const quoteCtas = document.querySelectorAll('.btn-cta[href="#quote"], .btn-quote');
    if (quoteCtas && quoteCtas.length) {
        quoteCtas.forEach(quoteCta => {
            quoteCta.addEventListener('click', (ev) => {
                ev.preventDefault();
                // If mobile nav is open, close it for a clean scroll
                if (navToggle && primaryNav) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    primaryNav.setAttribute('data-visible', 'false');
                }

                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // focus first input after a short delay when scrolling finishes
                    setTimeout(() => {
                        const firstInput = document.querySelector('#inquiry-form input, #inquiry-form select, #inquiry-form textarea');
                        if (firstInput) firstInput.focus();
                    }, 600);
                }
            });
        });
    }

    // 2. Sticky Header & Active Section Highlight
    const header = document.querySelector('.site-header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Deepen header background past 60px
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active section highlight
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current) && current !== '') {
                link.classList.add('active');
            }
        });
    });

    // 3. Scroll reveal animations (IntersectionObserver)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Helper to add animate class to many selectors
    const revealSelectors = ['section h2', 'section p', '.pd-card', '.why-card', '.testi-card', '.feature-row', '.customer-type-card', '.cert-card', '.stat-item', '.tl-node', '.process-quote'];
    revealSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.classList.add('animate-on-scroll'));
    });

    // Stagger cards inside grids (left-to-right) — we'll set transitionDelay using the index
    const staggerGrids = document.querySelectorAll('.products-grid, .why-grid, .testi-grid, .cert-row, .customers-flex');
    staggerGrids.forEach(grid => {
        Array.from(grid.children).forEach((child, i) => {
            child.classList.add('animate-on-scroll');
            child.style.transitionDelay = `${i * 0.1}s`;
        });
    });

    const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -6% 0px' };

    if (!prefersReduced) {
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);

                // stat counters
                if (entry.target.classList.contains('stat-item')) {
                    const numEl = entry.target.querySelector('.stat-number');
                    if (numEl) runStatAnimation(numEl);
                }

                // timeline draw: look for .timeline-line-inner inside section
                const line = entry.target.querySelector && entry.target.querySelector('.timeline-line-inner');
                if (line) line.style.width = '100%';
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => revealObserver.observe(el));
    } else {
        // If reduced motion: simply make elements visible
        document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('is-visible'));
        document.querySelectorAll('.stat-number').forEach(el => el.classList.add('is-counting'));
        const line = document.querySelectorAll('.timeline-line-inner');
        line.forEach(l => l.style.width = '100%');
    }

    // 4. Stat counter animation (easeOutQuart)
    function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
    function runStatAnimation(el) {
        if (!el) return;
        // numeric value via data-target (if present)
        const raw = el.getAttribute('data-target');
        if (raw && /^\\d+$/.test(raw)) {
            const target = parseInt(raw, 10);
            const duration = 1400;
            const start = performance.now();
            function tick(now) {
                const elapsed = now - start;
                const t = Math.min(1, elapsed / duration);
                const eased = easeOutQuart(t);
                const val = Math.round(target * eased);
                el.textContent = val + (el.getAttribute('data-suffix') || '');
                el.classList.add('is-counting');
                if (t < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        } else {
            // non-numeric: simple fade+scale
            el.classList.add('is-counting');
        }
    }

    // 5. Custom Cursor (desktop, smooth lerp)
    const cursor = document.querySelector('.custom-cursor');
    if (cursor && window.matchMedia("(pointer: fine)").matches && !prefersReduced) {
        let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
        const lerpAmt = 0.12; // organic lag

        document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; cursor.style.opacity = '1'; });

        function render() {
            cursorX += (mouseX - cursorX) * lerpAmt;
            cursorY += (mouseY - cursorY) * lerpAmt;
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        const hoverTargets = document.querySelectorAll('a, button, .btn, .btn-quote');
        hoverTargets.forEach(t => {
            t.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
            t.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
        });

        document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
    }

    // 8. Generate floating particles in hero (randomized duration + delay)
    (function createParticles(){
        const container = document.querySelector('.particles');
        if (!container || prefersReduced) return;
        const count = 14;
        for (let i=0;i<count;i++){
            const p = document.createElement('div');
            p.className = 'particle';
            const size = 3 + Math.floor(Math.random()*3); // 3-5px
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            const left = 5 + Math.random()*85; // percent
            p.style.left = `${left}%`;
            p.style.bottom = `${10 + Math.random()*40}px`;
            const dur = 7 + Math.random()*7; // 7-14s
            const delay = Math.random()*10; // 0-10s
            const drift = (Math.random()*30)-15; // -15 to 15px
            p.style.animation = `particle-float ${dur}s linear ${delay}s infinite`;
            p.style.setProperty('--drift', `${drift}px`);
            container.appendChild(p);
        }
    })();

    // 9. Nav active state via IntersectionObserver for sections
    if (!prefersReduced) {
        const sectionEls = document.querySelectorAll('section[id]');
        const navMap = {};
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) navMap[href.slice(1)] = link;
        });

        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                const link = navMap[id];
                if (!link) return;
                if (entry.isIntersecting) {
                    document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        }, { threshold: 0.45 });

        sectionEls.forEach(s => navObserver.observe(s));
    }

    // 10. Logo entrance
    const logoSvg = document.querySelector('.logo-svg');
    if (logoSvg && !prefersReduced) logoSvg.classList.add('logo-animate');

    // Page loader: hide once DOM and initial paints are ready
    const loader = document.getElementById('page-loader');
    if (loader) {
        const leaf = loader.querySelector('.loader-leaf');
        if (leaf) leaf.classList.add('loader-animate');
        // ensure loader visible for min 900ms then hide (1.5s max)
        const hide = () => setTimeout(() => { loader.style.transition = 'opacity 320ms ease'; loader.style.opacity = '0'; setTimeout(()=> loader.remove(), 340) }, 900);
        if (document.readyState === 'complete') hide(); else window.addEventListener('load', hide);
    }
});
