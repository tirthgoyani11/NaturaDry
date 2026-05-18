document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. Mobile Drawer Navigation & Scroll Lock
    // ==========================================================================
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mobilePanel = document.querySelector('.mobile-panel');

    if (navToggle && mobilePanel) {
        navToggle.addEventListener('click', () => {
            const isVisible = mobilePanel.getAttribute('data-visible') === 'true';
            mobilePanel.setAttribute('data-visible', !isVisible);
            mobilePanel.setAttribute('aria-hidden', isVisible);
            navToggle.setAttribute('aria-expanded', !isVisible);
            
            if (!isVisible) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close mobile panel on link click
        const mobileLinks = mobilePanel.querySelectorAll('a, button');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobilePanel.setAttribute('data-visible', 'false');
                mobilePanel.setAttribute('aria-hidden', 'true');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ==========================================================================
    // 2. Interactive Timeline Specifications Tabs
    // ==========================================================================
    const stepsData = {
        1: {
            title: "Direct Farm Sourcing",
            desc: "We buy bulk crops directly from smallholder farms across Mahuva and Bhavnagar during peak harvest season. This bypasses intermediary traders, ensuring competitive raw material pricing and total agricultural traceability back to the soil.",
            specs: ["✦ Origin: Mahuva & Bhavnagar Farms", "✦ Sourcing: Direct Farmer Relations", "✦ Quality: Seasonal Selection"]
        },
        2: {
            title: "Symmetrical Sorting & Washing",
            desc: "Raw onion bulbs, garlic cloves, and ginger rhizomes are inspected by hand to discard bruised crops. Sorters wash raw crops under pressurized multi-stage clean-water channels to fully remove earth-dirt, soil residues, and organic microbes.",
            specs: ["✦ Sorters: Manual Inspection", "✦ Washing: Pressurized Water Channels", "✦ Sanitation: Clean microbial load"]
        },
        3: {
            title: "Automated Peeling & Slicing",
            desc: "The washed ingredients pass through specialized stainless-steel skin-peelers. Precision automatic slicers then cut the peeled crops into highly symmetrical flakes of exact thickness, ensuring even thermal exposure during the drying cycle.",
            specs: ["✦ Slicers: 3mm - 8mm Symmetrical Cut", "✦ Peelers: Food-Grade Stainless Steel", "✦ Uniformity: High-Exposure Surface"]
        },
        4: {
            title: "Precision Dehydration",
            desc: "Sliced flakes are dried inside modern tray-dryers. Air temperatures are controlled strictly at 55–65°C to slowly remove moisture while ensuring volatile essential oils and natural pungency are perfectly locked in, avoiding scorched flavors.",
            specs: ["✦ Air Drying: 55–65°C Temperature", "✦ Duration: Slow Moisture Removal", "✦ Oils: Max Volatile Preservation"]
        },
        5: {
            title: "Ultra-Fine Grinding",
            desc: "The fully dehydrated flakes are passed to stainless-steel hammer mills. Sifters grind the flakes into fine powders at cool mechanical operations, avoiding friction-heat that might burn aroma profiles or lead to static powder clumping.",
            specs: ["✦ Millers: Cool-Grind Sifters", "✦ Standard Mesh: 60 - 100 Mesh", "✦ Color: Natural Hue Preservation"]
        },
        6: {
            title: "Multi-Level Quality Control",
            desc: "Every single batch is sampled for rigorous laboratory quality checkups. We run rigorous screening tests for moisture balance (≤ 5% max limit), mesh distribution, heavy metal detection, microbiological profiles, and total trace levels.",
            specs: ["✦ Moisture: ≤ 5.0% Max Limits", "✦ Lab Checks: Certificate of Analysis (COA)", "✦ Purity: 100% Additive Free"]
        },
        7: {
            title: "Airtight Protective Packaging",
            desc: "The dry powders are weighed and packaged inside double poly-lined high-density B2B food drums or laminated boxes. The drums prevent environmental humidity ingress, locking in freshness, flavor potency, and providing a stable 12-month shelf-life.",
            specs: ["✦ Containers: Double Poly-Lined Fibre Drums", "✦ Shelf Life: 12 Months Freshness", "✦ Barriers: Complete Moisture Lock"]
        },
        8: {
            title: "Secure B2B Dispatch",
            desc: "Sealed drums are coded with batch traceability markers and loaded onto secure transport networks in Surat GIDC. We ship nationwide to snack manufacturers, export trade hubs, and food houses with fast domestic freight tracking.",
            specs: ["✦ Location: Surat GIDC Logistics Hub", "✦ Logistics: Nationwide Cargo Networks", "✦ Traceability: Barcoded Batch Tracking"]
        }
    };

    const tlNodes = document.querySelectorAll('.tl-node');
    const detailStepNum = document.getElementById('detail-step-num');
    const detailStepTitle = document.getElementById('detail-step-title');
    const detailStepDesc = document.getElementById('detail-step-desc');
    const detailStepSpecs = document.getElementById('detail-step-specs');
    const tlLineInner = document.querySelector('.timeline-line-inner');

    let currentStepIdx = 0;
    let autoPlayInterval = null;
    let resumeTimeout = null;
    const autoPlayDelay = 4000; // Auto-cycle every 4 seconds

    function updateTimelineStep(idx) {
        if (idx < 0 || idx >= tlNodes.length) return;
        currentStepIdx = idx;

        const node = tlNodes[idx];
        // Remove active class from all nodes
        tlNodes.forEach(n => n.classList.remove('active'));
        node.classList.add('active');

        const step = node.getAttribute('data-step');
        const data = stepsData[step];

        if (data) {
            const card = document.getElementById('timeline-detail-card');
            if (card) {
                card.style.opacity = '0';
                card.style.transform = 'translateY(10px)';
                card.style.transition = 'all 200ms ease';

                setTimeout(() => {
                    detailStepNum.textContent = `Step 0${step}`;
                    detailStepTitle.textContent = data.title;
                    detailStepDesc.textContent = data.desc;

                    // Clear and reload specs
                    detailStepSpecs.innerHTML = '';
                    data.specs.forEach(spec => {
                        const badge = document.createElement('div');
                        badge.className = 'detail-spec-badge';
                        badge.textContent = spec;
                        detailStepSpecs.appendChild(badge);
                    });

                    // Position line progress
                    if (tlLineInner) {
                        const percent = (idx / (tlNodes.length - 1)) * 90 + 5;
                        tlLineInner.style.width = `${percent}%`;
                    }

                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 200);
            }
        }
    }

    function startTimelineAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            let nextIdx = (currentStepIdx + 1) % tlNodes.length;
            updateTimelineStep(nextIdx);
        }, autoPlayDelay);
    }

    function stopTimelineAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
        if (resumeTimeout) {
            clearTimeout(resumeTimeout);
            resumeTimeout = null;
        }
    }

    function restartAutoPlayDelayed() {
        if (resumeTimeout) clearTimeout(resumeTimeout);
        resumeTimeout = setTimeout(() => {
            startTimelineAutoPlay();
        }, 12000); // Resume auto-cycling after 12 seconds of inactivity
    }

    if (tlNodes && tlNodes.length && detailStepNum) {
        // Initialize at Step 1
        updateTimelineStep(0);

        tlNodes.forEach((node, idx) => {
            node.addEventListener('click', () => {
                // Pause auto-cycling when manually clicked to let user read
                stopTimelineAutoPlay();
                updateTimelineStep(idx);
                // Restart auto-cycling after user inactivity
                restartAutoPlayDelayed();
            });
        });

        // Smart IntersectionObserver: autoplay only when timeline section is on screen
        if (!prefersReduced && 'IntersectionObserver' in window) {
            const processSection = document.getElementById('process');
            if (processSection) {
                const processObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            startTimelineAutoPlay();
                        } else {
                            stopTimelineAutoPlay();
                        }
                    });
                }, { threshold: 0.15 });
                processObserver.observe(processSection);
            }
        } else {
            startTimelineAutoPlay();
        }
    }

    // ==========================================================================
    // 3. Inquiry Form -> WhatsApp Redirect Constructor
    // ==========================================================================
    const inquiryForm = document.getElementById('inquiry-form');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Form validations
            const inputs = inquiryForm.querySelectorAll('.form-input[required]');
            let valid = true;
            inputs.forEach(inp => {
                const val = inp.value.trim();
                if (!val) {
                    inp.classList.add('invalid');
                    valid = false;
                } else {
                    inp.classList.remove('invalid');
                    inp.classList.add('valid');
                }
            });

            if (!valid) {
                const firstInvalid = inquiryForm.querySelector('.form-input.invalid');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            const get = id => (document.getElementById(id) || {}).value || '';
            const fullName = get('fullName').trim();
            const companyName = get('companyName').trim();
            const phone = get('phone').trim();
            const email = get('email').trim();
            const address = get('address').trim();
            const message = get('message').trim();
            
            const productEl = document.getElementById('product');
            const product = productEl && productEl.options && productEl.selectedIndex >= 0
                ? productEl.options[productEl.selectedIndex].text.trim()
                : '';
                
            const quantityEl = document.getElementById('quantity');
            const quantity = quantityEl && quantityEl.options && quantityEl.selectedIndex >= 0
                ? quantityEl.options[quantityEl.selectedIndex].text.trim()
                : '';

            // Construct Multi-Line Structured WhatsApp Message
            let text = `Hello NaturaDry Team,\n`;
            text += `I would like to request a bulk quote / commercial sample:\n\n`;
            text += `═══ B2B CUSTOMER PROFILE ═══\n`;
            text += `👤 Name: ${fullName}\n`;
            if (companyName) text += `🏢 Company: ${companyName}\n`;
            text += `📞 Contact: ${phone}\n`;
            text += `✉️ Email: ${email}\n`;
            text += `📍 Shipping Destination: ${address}\n\n`;
            text += `═══ INQUIRY DETAILS ═══\n`;
            text += `📦 Product: ${product}\n`;
            text += `📊 Target Purchase Volume: ${quantity}\n`;
            if (message) text += `\n📝 Specs / Special Requests: ${message}\n`;
            text += `\nPlease direct this to the commercial desk.\nThank you.`;

            // Redirect using wa.me API
            const waNumber = '918200029583';
            const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
            window.open(waUrl, '_blank');

            // Replace form with luxurious glassmorphic thank-you card
            const thank = document.createElement('div');
            thank.className = 'thank-card animate-on-scroll is-visible';
            thank.innerHTML = `
                🌿 <strong>Inquiry Sent to WhatsApp!</strong>
                <p style="margin-top: 8px; font-size: 0.95rem; color: #a2cf34;">Thank you for contacting NaturaDry Commercial Ingredients desk.</p>
                <p style="margin-top: 4px; font-size: 0.9rem; color: #6b8c4d;">A sales officer is reviewing your recipe specs and will contact you within 24 hours.</p>
            `;
            inquiryForm.parentElement.replaceChild(thank, inquiryForm);
        });
    }

    // ==========================================================================
    // 4. Request a Quote CTA Scroll Focus
    // ==========================================================================
    const quoteCtas = document.querySelectorAll('.btn-quote');
    if (quoteCtas && quoteCtas.length) {
        quoteCtas.forEach(quoteCta => {
            quoteCta.addEventListener('click', (ev) => {
                ev.preventDefault();
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    
                    // Focus first field after scroll
                    setTimeout(() => {
                        const firstInput = document.getElementById('fullName');
                        if (firstInput) firstInput.focus();
                    }, 800);
                }
            });
        });
    }

    // ==========================================================================
    // 5. Sticky Header scrolled class & Section Highlight Navigation
    // ==========================================================================
    const header = document.querySelector('.site-header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
        }, { threshold: 0.35, rootMargin: '-10% 0px -40% 0px' });

        sectionEls.forEach(s => navObserver.observe(s));
    }

    // ==========================================================================
    // 6. Scroll Reveal Animations (IntersectionObserver)
    // ==========================================================================
    const revealSelectors = [
        'section .section-header', 
        '.about-left', 
        '.about-right', 
        '.pd-card', 
        '.why-card', 
        '.why-right-image', 
        '.testi-card', 
        '.cert-card', 
        '.customer-type-card', 
        '.stat-item', 
        '.timeline-display-card', 
        '.process-quote',
        '.contact-left',
        '.contact-right'
    ];
    
    revealSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.classList.add('animate-on-scroll'));
    });

    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -5% 0px' };

    if (!prefersReduced) {
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);

                // Initialize stat counters
                if (entry.target.classList.contains('stat-item')) {
                    const numEl = entry.target.querySelector('.stat-number');
                    if (numEl) runStatAnimation(numEl);
                }
                
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => revealObserver.observe(el));
    } else {
        document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('is-visible'));
        document.querySelectorAll('.stat-number').forEach(el => el.classList.add('is-counting'));
    }

    // ==========================================================================
    // 7. Stat Numerical Counter Increments (easeOutQuart)
    // ==========================================================================
    function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
    
    function runStatAnimation(el) {
        if (!el) return;
        const raw = el.getAttribute('data-target');
        if (raw && /^\d+$/.test(raw)) {
            const target = parseInt(raw, 10);
            const duration = 1600;
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
            el.classList.add('is-counting');
        }
    }

    // ==========================================================================
    // 8. Premium Organic Custom Cursor Trail (Smooth Lerp)
    // ==========================================================================
    const cursor = document.querySelector('.custom-cursor');
    if (cursor && window.matchMedia("(pointer: fine)").matches && !prefersReduced) {
        let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
        const lerpAmt = 0.12; 

        document.addEventListener('mousemove', e => { 
            mouseX = e.clientX; 
            mouseY = e.clientY; 
            cursor.style.opacity = '1'; 
        });

        function render() {
            cursorX += (mouseX - cursorX) * lerpAmt;
            cursorY += (mouseY - cursorY) * lerpAmt;
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        // Tactile scaling targets
        const hoverTargets = document.querySelectorAll('a, button, .btn, .pd-card, .why-card, .tl-node, .info-card, .hero-image-frame, .blend-image-frame, .operations-image-frame');
        hoverTargets.forEach(t => {
            t.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
            t.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
        });

        document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
    }

    // ==========================================================================
    // 9. Floating Hero Dust Particles Generator
    // ==========================================================================
    (function createParticles(){
        const container = document.querySelector('.particles');
        if (!container || prefersReduced) return;
        
        const count = 16;
        for (let i = 0; i < count; i++){
            const p = document.createElement('div');
            p.className = 'particle';
            const size = 3 + Math.floor(Math.random() * 4); // 3-6px
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            
            const left = 5 + Math.random() * 90; 
            p.style.left = `${left}%`;
            p.style.bottom = `${10 + Math.random() * 40}px`;
            
            const dur = 8 + Math.random() * 8; // 8-16s
            const delay = Math.random() * 8; // 0-8s
            const drift = (Math.random() * 40) - 20; // -20 to 20px
            
            p.style.animation = `particle-float ${dur}s linear ${delay}s infinite`;
            p.style.setProperty('--drift', `${drift}px`);
            container.appendChild(p);
        }
    })();
});
