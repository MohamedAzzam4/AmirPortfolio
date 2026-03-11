/* ═══════════════════════════════════════════════════════
   AMIR PORTFOLIO — INTERACTIVITY
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // ─── NAVBAR SCROLL EFFECT ─────────────────────────
    const navbar = document.getElementById('navbar');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ─── MOBILE HAMBURGER MENU ────────────────────────
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ─── ACTIVE NAV LINK HIGHLIGHTING ─────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinkEls = document.querySelectorAll('.nav-link');

    const highlightNav = () => {
        const scrollY = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinkEls.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

    // ─── PORTFOLIO FILTER ─────────────────────────────
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            portfolioItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeInUp 0.5s ease-out forwards';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // ─── SCROLL REVEAL ANIMATION ──────────────────────
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        }
    );

    revealElements.forEach(el => revealObserver.observe(el));

    // ─── ANIMATED COUNTERS ────────────────────────────
    const counters = document.querySelectorAll('.counter');
    let countersAnimated = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const parent = counter.closest('.stat-number');
            const target = parent ? parseInt(parent.dataset.target) : 0;
            const duration = 2000;
            const start = performance.now();

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out quad
                const easedProgress = 1 - (1 - progress) * (1 - progress);
                counter.textContent = Math.floor(easedProgress * target);

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            requestAnimationFrame(updateCounter);
        });
    };

    // Also animate hero stat numbers
    const heroStatNumbers = document.querySelectorAll('.hero-stat-number');

    const animateHeroStats = () => {
        heroStatNumbers.forEach(el => {
            const target = parseInt(el.dataset.target);
            const duration = 1800;
            const start = performance.now();

            const update = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = 1 - (1 - progress) * (1 - progress);
                el.textContent = Math.floor(easedProgress * target);

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = target;
                }
            };

            requestAnimationFrame(update);
        });
    };

    // Trigger hero stats animation when page loads (after small delay for entrance anim)
    setTimeout(animateHeroStats, 1200);

    // Trigger counter animation when stats banner is in view
    const statsBanner = document.querySelector('.stats-banner');
    if (statsBanner) {
        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !countersAnimated) {
                        countersAnimated = true;
                        animateCounters();
                        counterObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );
        counterObserver.observe(statsBanner);
    }

    // ─── CONTACT FORM  ────────────────────────────────
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="ph ph-check-circle"></i> Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                contactForm.reset();
            }, 3000);
        });
    }

    // ─── SMOOTH SCROLL FOR CTA BUTTONS ────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ─── PROJECT MODAL (Scrolling Gallery) ────────────────
    const projectModal = document.getElementById('projectModal');
    const pmTitle = document.getElementById('pmTitle');
    const pmClose = document.getElementById('pmClose');
    const pmBody = document.getElementById('pmBody');

    // Gallery data — maps gallery ID to folder path, image count, titles, and text briefs
    const galleryData = {
        businesscards: {
            folder: 'images/portfolio/BusinessCards/',
            count: 14,
            title: 'Business Card Designs',
            titleAr: 'تصاميم كروت العمل',
            // Optional text briefs for each image (index 0 = image 1, etc.)
            briefs: [
                "Modern corporate identity concept focusing on bold typography and clean lines.",
                "Minimalist design approach for a boutique real estate agency.",
                "Vibrant colors chosen to reflect the brand's energetic and youthful vibe.",
                "", // Leave empty if no brief is needed for a specific image
            ],
            briefsAr: [
                "مفهوم الهوية المؤسسية الحديثة مع التركيز على الطباعة الجريئة والخطوط النظيفة.",
                "نهج تصميم بسيط لوكالة عقارية متخصصة.",
                "ألوان زاهية تم اختيارها لتعكس الحيوية والطاقة للعلامة التجارية.",
                "", // Leave empty for no brief
            ]
        },
        banners: {
            folder: 'images/portfolio/Banners/',
            count: 2,
            title: 'Banner Designs',
            titleAr: 'تصاميم البانرات',
            briefs: [
                "Promotional web banner for a seasonal sale campaign.",
                "Social media header designed to increase click-through rates."
            ],
            briefsAr: [
                "بانر إعلاني لحملة تخفيضات موسمية.",
                "غلاف لوسائل التواصل الاجتماعي مصمم لزيادة معدل النقر."
            ]
        },
        bookcovers: {
            folder: 'images/portfolio/BookCovers/',
            count: 13,
            title: 'Book Cover Designs',
            titleAr: 'تصاميم أغلفة الكتب',
            briefs: [
                "An abstract cover design for a modern tech thriller novel."
            ],
            briefsAr: [
                "تصميم غلاف تجريدي لرواية إثارة تقنية حديثة."
            ]
        },
        medical: {
            folder: 'images/portfolio/MedicalPrescription/',
            count: 3,
            title: 'Medical Stationery',
            titleAr: 'قرطاسية طبية',
            briefs: [],
            briefsAr: []
        }
    };

    const isArabic = document.documentElement.lang === 'ar';

    function openProjectModal(galleryId) {
        const currentGallery = galleryData[galleryId];
        if (!currentGallery) return;

        // Set title
        pmTitle.textContent = isArabic ? currentGallery.titleAr : currentGallery.title;

        // Clear existing content
        pmBody.innerHTML = '';

        // Generate HTML for each design in the project
        const briefsList = isArabic ? (currentGallery.briefsAr || []) : (currentGallery.briefs || []);

        for (let i = 0; i < currentGallery.count; i++) {
            const imgSrc = currentGallery.folder + (i + 1) + '.jpg';
            const briefText = briefsList[i] || ''; // Fallback to empty if not defined

            // Create container
            const itemDiv = document.createElement('div');
            itemDiv.className = 'pm-item';

            // Create image element
            const imgContainer = document.createElement('div');
            imgContainer.className = 'pm-item-img';
            const imgEl = document.createElement('img');
            imgEl.src = imgSrc;
            imgEl.alt = `${currentGallery.title} - Design ${i + 1}`;
            imgEl.loading = "lazy";
            imgContainer.appendChild(imgEl);

            // Create text brief element
            const textEl = document.createElement('p');
            textEl.className = 'pm-item-text';
            if (briefText.trim() === '') {
                textEl.classList.add('empty');
            } else {
                textEl.textContent = briefText;
            }

            // Append elements (Text goes below or above depending on preference; here we put text above image)
            itemDiv.appendChild(textEl);
            itemDiv.appendChild(imgContainer);

            pmBody.appendChild(itemDiv);
        }

        // Show modal
        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        // Scroll modal to top
        projectModal.scrollTop = 0;
    }

    function closeProjectModal() {
        if (projectModal) {
            projectModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Click handlers
    if (projectModal) {
        // Open modal when clicking a gallery thumbnail
        document.querySelectorAll('.portfolio-item[data-gallery]').forEach(item => {
            item.addEventListener('click', () => {
                openProjectModal(item.dataset.gallery);
            });
        });

        // Close button handler
        if (pmClose) {
            pmClose.addEventListener('click', closeProjectModal);
        }

        // Close on background click (clicking outside the internal items)
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal || e.target === document.querySelector('.pm-body')) {
                closeProjectModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (projectModal.classList.contains('active') && e.key === 'Escape') {
                closeProjectModal();
            }
        });
    }
});
