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

    // ─── LIGHTBOX GALLERY ────────────────────────────────
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCurrent = document.getElementById('lightboxCurrent');
    const lightboxTotal = document.getElementById('lightboxTotal');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    // Gallery data — maps gallery ID to folder path, image count, and title
    const galleryData = {
        businesscards: {
            folder: 'images/portfolio/BusinessCards/',
            count: 14,
            title: 'Business Card Designs',
            titleAr: 'تصاميم كروت العمل'
        },
        banners: {
            folder: 'images/portfolio/Banners/',
            count: 2,
            title: 'Banner Designs',
            titleAr: 'تصاميم البانرات'
        },
        bookcovers: {
            folder: 'images/portfolio/BookCovers/',
            count: 13,
            title: 'Book Cover Designs',
            titleAr: 'تصاميم أغلفة الكتب'
        },
        medical: {
            folder: 'images/portfolio/MedicalPrescription/',
            count: 3,
            title: 'Medical Stationery',
            titleAr: 'قرطاسية طبية'
        }
    };

    let currentGallery = null;
    let currentIndex = 0;
    const isArabic = document.documentElement.lang === 'ar';

    function openLightbox(galleryId, startIndex = 0) {
        currentGallery = galleryData[galleryId];
        if (!currentGallery) return;

        currentIndex = startIndex;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        currentGallery = null;
    }

    function updateLightboxImage() {
        if (!currentGallery) return;

        const imgSrc = currentGallery.folder + (currentIndex + 1) + '.jpg';
        console.log('Lightbox loading:', imgSrc);
        lightboxImg.classList.add('loading');
        lightboxImg.src = imgSrc;
        lightboxImg.onload = () => {
            lightboxImg.classList.remove('loading');
            console.log('Image loaded successfully:', imgSrc);
        };
        lightboxImg.onerror = () => {
            lightboxImg.classList.remove('loading');
            console.error('Failed to load image:', imgSrc);
        };
        lightboxTitle.textContent = isArabic ? currentGallery.titleAr : currentGallery.title;
        lightboxCurrent.textContent = currentIndex + 1;
        lightboxTotal.textContent = currentGallery.count;
    }

    function nextImage() {
        if (!currentGallery) return;
        currentIndex = (currentIndex + 1) % currentGallery.count;
        updateLightboxImage();
    }

    function prevImage() {
        if (!currentGallery) return;
        currentIndex = (currentIndex - 1 + currentGallery.count) % currentGallery.count;
        updateLightboxImage();
    }

    // Click handlers
    if (lightbox) {
        document.querySelectorAll('.portfolio-item[data-gallery]').forEach(item => {
            item.addEventListener('click', () => {
                openLightbox(item.dataset.gallery);
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', prevImage);
        lightboxNext.addEventListener('click', nextImage);

        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;

            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowRight':
                    isArabic ? prevImage() : nextImage();
                    break;
                case 'ArrowLeft':
                    isArabic ? nextImage() : prevImage();
                    break;
            }
        });

        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    isArabic ? prevImage() : nextImage();
                } else {
                    isArabic ? nextImage() : prevImage();
                }
            }
        }, { passive: true });
    }
});
