/* ═══════════════════════════════════════════════════════
   AMIR PORTFOLIO — INTERACTIVITY
   ═══════════════════════════════════════════════════════ */

// ─── THUMBNAIL FALLBACK LOGIC ────────────────
window.fallbackThumbnail = function (imgElement) {
    if (!imgElement.dataset.triedFallback) {
        // First fallback: Try 'Main.jpg'
        imgElement.dataset.triedFallback = '1';
        imgElement.src = imgElement.src.replace('main.jpg', 'Main.jpg');
    } else if (imgElement.dataset.triedFallback === '1') {
        // Second fallback: Try 'mian.jpg'
        imgElement.dataset.triedFallback = '2';
        imgElement.src = imgElement.src.replace('Main.jpg', 'mian.jpg');
    } else if (imgElement.dataset.triedFallback === '2') {
        // Final fallback: Try '1.jpg' if none of the above exist
        imgElement.dataset.triedFallback = '3';
        imgElement.src = imgElement.src.replace('mian.jpg', '1.jpg');
    }
};

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

    // ─── MASONRY GALLERY MODAL ────────────────────────────────
    const masonryModal = document.getElementById('masonryModal');
    const mmTitle = document.getElementById('mmTitle');
    const mmClose = document.getElementById('mmClose');
    const mmBody = document.getElementById('mmBody');

    // Gallery data
    const galleryData = {
        businesscards: {
            folder: 'images/portfolio/BusinessCards/',
            count: 14,
            files: ['main.jpg', '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg'],
            title: 'Business Card Designs',
            titleAr: 'تصاميم كروت العمل',
            briefs: [
                "Modern corporate identity concept focusing on bold typography and clean lines.",
                "Minimalist design approach for a boutique real estate agency.",
                "Vibrant colors chosen to reflect the brand's energetic and youthful vibe.",
                ""
            ],
            briefsAr: [
                "مفهوم الهوية المؤسسية الحديثة مع التركيز على الطباعة الجريئة والخطوط النظيفة.",
                "نهج تصميم بسيط لوكالة عقارية متخصصة.",
                "ألوان زاهية تم اختيارها لتعكس الحيوية والطاقة للعلامة التجارية.",
                ""
            ]
        },
        banners: {
            folder: 'images/portfolio/Banners/',
            count: 2,
            files: ['main.jpg', '2.jpg'],
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
            files: ['main.jpg', '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg', '11.jpg', '13.jpg'],
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
            files: ['main.jpg', '2.jpg', '3.jpg'],
            title: 'Medical Stationery',
            titleAr: 'قرطاسية طبية',
            briefs: [],
            briefsAr: []
        },
        brochures: {
            folder: 'images/portfolio/Brochures/',
            count: 5,
            files: ['main.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'],
            title: 'Brochure Designs',
            titleAr: 'تصاميم البروشورات',
            briefs: [],
            briefsAr: []
        },
        socialmedia: {
            folder: 'images/portfolio/SocialMedia/',
            count: 6,
            files: ['main.jpg', '136516126.jpg', '1365326236234.jpg', '15325151513-31.jpg', '15325151513-316.jpg', '15325151513-3169.jpg', '2345234523451.jpg', '2351235135236.jpg', '2356216126.jpg', '251251616.jpg', '262626.jpg', '3246346346436.jpg', '345346534634634.jpg', '3561616.jpg', '3612616.jpg'],
            title: 'Social Media Posts',
            titleAr: 'منشورات سوشيال ميديا',
            briefs: [],
            briefsAr: []
        }
    };

    const isArabic = document.documentElement.lang === 'ar';
    let currentMasonryInstance = null;

    async function getPortfolioImages(galleryObj) {
        try {
            const response = await fetch(galleryObj.folder);
            if (response.ok) {
                const htmlText = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, 'text/html');
                const links = Array.from(doc.querySelectorAll('a'));
                let images = links
                    .map(a => a.getAttribute('href'))
                    .filter(href => href && href.match(/\.(jpe?g|png|webp|gif)$/i));

                // Strip paths, keeping just filenames
                images = images.map(img => img.split('/').pop());

                if (images.length > 0) {
                    images = [...new Set(images)];
                    // Sort so that main.jpg is always the very first item
                    images.sort((a, b) => {
                        const aIsMain = a.toLowerCase().startsWith('main');
                        const bIsMain = b.toLowerCase().startsWith('main');
                        if (aIsMain && !bIsMain) return -1;
                        if (!aIsMain && bIsMain) return 1;
                        return a.localeCompare(b, undefined, { numeric: true });
                    });
                    return images;
                }
            }
        } catch (e) {
            console.warn('Auto-fetch failed. Falling back to predefined files list explicitly.', e);
        }
        return galleryObj.files || Array.from({ length: galleryObj.count }, (_, i) => `${i + 1}.jpg`);
    }

    async function openMasonryModal(galleryId) {
        const currentGallery = galleryData[galleryId];
        if (!currentGallery) return;

        // Set title
        if (mmTitle) {
            mmTitle.textContent = isArabic ? currentGallery.titleAr : currentGallery.title;
        }

        // Show modal early and add a loading indicator
        masonryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        masonryModal.scrollTop = 0;
        mmBody.innerHTML = '<div style="opacity:0.6; text-align:center; padding: 4rem; width:100%;">Loading portfolio images...</div>';

        // Fetch the actual physical images in the folder dynamically (with reliable fallback)
        const imageList = await getPortfolioImages(currentGallery);

        // Prepare masonry container element
        mmBody.innerHTML = '<div class="masonry-list"></div>';

        // Prepare items data
        const briefsList = isArabic ? (currentGallery.briefsAr || []) : (currentGallery.briefs || []);
        const itemsData = [];

        for (let i = 0; i < imageList.length; i++) {
            itemsData.push({
                id: `img-${i}`,
                img: currentGallery.folder + imageList[i],
                text: briefsList[i] || ''
            });
        }

        // Cleanup previous instance if exists
        if (currentMasonryInstance) {
            currentMasonryInstance.destroy();
            currentMasonryInstance = null;
        }

        // Slight delay to allow modal display to affect DOM layout before calculating Masonry
        setTimeout(() => {
            if (typeof MasonryGallery !== 'undefined') {
                currentMasonryInstance = new MasonryGallery('.masonry-list', itemsData, isArabic);
            } else {
                console.error("MasonryGallery class not found! Did animations.js load?");
            }
        }, 50);
    }

    function closeMasonryModal() {
        if (masonryModal) {
            masonryModal.classList.remove('active');
            document.body.style.overflow = '';

            // Allow CSS transition to finish before destroying DOM
            setTimeout(() => {
                if (currentMasonryInstance) {
                    currentMasonryInstance.destroy();
                    currentMasonryInstance = null;
                }
                mmBody.innerHTML = ''; // clear completely
            }, 300);
        }
    }

    // Click handlers
    if (masonryModal) {
        document.querySelectorAll('.portfolio-item[data-gallery]').forEach(item => {
            item.addEventListener('click', () => {
                openMasonryModal(item.dataset.gallery);
            });
        });

        if (mmClose) {
            mmClose.addEventListener('click', closeMasonryModal);
        }

        masonryModal.addEventListener('click', (e) => {
            if (e.target === masonryModal || e.target === mmBody) {
                closeMasonryModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (masonryModal.classList.contains('active') && e.key === 'Escape') {
                closeMasonryModal();
            }
        });
    }

    // ─── PHOTO VIEWER MODAL ────────────────────────────────
    const photoViewer = document.getElementById('photoViewer');
    const pvImg = document.getElementById('pvImg');
    const pvClose = document.getElementById('pvClose');

    window.openPhotoViewer = function (imgSrc) {
        if (!photoViewer || !pvImg) return;
        pvImg.src = imgSrc;
        photoViewer.classList.add('active');
    };

    function closePhotoViewer() {
        if (photoViewer) {
            photoViewer.classList.remove('active');
            setTimeout(() => {
                if (pvImg) pvImg.src = '';
            }, 300);
        }
    }

    if (photoViewer) {
        if (pvClose) pvClose.addEventListener('click', closePhotoViewer);
        photoViewer.addEventListener('click', (e) => {
            if (e.target === photoViewer) closePhotoViewer();
        });
        document.addEventListener('keydown', (e) => {
            if (photoViewer.classList.contains('active') && e.key === 'Escape') {
                closePhotoViewer();
            }
        });
    }
    // ─── VIDEO EMBED MODAL ────────────────────────────────
    const videoModal = document.getElementById('videoModal');
    const vmContent = document.getElementById('vmContent');
    const vmClose = document.getElementById('vmClose');

    const videoData = {
        reels: [
            `<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F791451850097917%2F&show_text=false&width=267&t=0" width="267" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`,
            `<iframe src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FKawaderNursingSchool%2Fvideos%2F625695423914535%2F&show_text=false&width=560&t=0" width="560" height="314" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`,
            `<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1457639509147011%2F&show_text=false&width=267&t=0" width="267" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`,
            `<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2FDrkyrillosOncoSurg%2Fvideos%2F1262496435681653%2F&show_text=false&width=267&t=0" width="267" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`,
            `<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1380330543531381%2F&show_text=false&width=267&t=0" width="267" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`,
            `<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1751258952492288%2F&show_text=false&width=267&t=0" width="267" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`,
            `<iframe src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FNeuroman.Mohamed.E.Fayed%2Fvideos%2F1055109063295715%2F&show_text=false&width=560&t=0" width="560" height="314" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`,
            `<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1620104529162239%2F&show_text=false&width=267&t=0" width="267" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`,
            `<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1295255311722643%2F&show_text=false&width=267&t=0" width="267" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`,
            `<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2897565387300236%2F&show_text=false&width=267&t=0" width="267" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`
        ]
    };

    function openVideoModal(videoId) {
        if (!videoModal || !vmContent) return;
        const embeds = videoData[videoId];
        if (!embeds) return;

        vmContent.innerHTML = embeds.join('');
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeVideoModal() {
        if (videoModal) {
            videoModal.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                if (vmContent) vmContent.innerHTML = ''; // Stop video playback
            }, 300);
        }
    }

    if (videoModal) {
        document.querySelectorAll('.portfolio-item[data-video]').forEach(item => {
            item.addEventListener('click', () => {
                openVideoModal(item.dataset.video);
            });
        });

        if (vmClose) vmClose.addEventListener('click', closeVideoModal);
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal || e.target === vmContent) closeVideoModal();
        });
        document.addEventListener('keydown', (e) => {
            if (videoModal.classList.contains('active') && e.key === 'Escape') {
                closeVideoModal();
            }
        });
    }
});
