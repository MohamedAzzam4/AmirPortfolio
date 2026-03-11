// animations.js
// Masonry Gallery Animation Logic using GSAP

class MasonryGallery {
    constructor(containerSelector, itemsData, isArabic = false) {
        this.container = document.querySelector(containerSelector);
        this.itemsData = itemsData;
        this.isArabic = isArabic;
        this.resizeObserver = null;
        this.grid = [];
        this.imagesReady = false;

        // Configuration
        this.ease = 'power3.out';
        this.duration = 0.6;
        this.stagger = 0.05;
        this.animateFrom = 'bottom';
        this.scaleOnHover = true;
        this.hoverScale = 0.95;
        this.blurToFocus = true;
        this.colorShiftOnHover = true; // Use the overlay defined in CSS

        // Internal state
        this.containerWidth = 0;
        this.hasMounted = false;

        this.init();
    }

    // Determine column count based on width
    getColumns(width) {
        if (width >= 1500) return 4;
        if (width >= 1000) return 3;
        if (width >= 600) return 2;
        if (width >= 400) return 1;
        return 1;
    }

    // Preload images
    async preloadImages() {
        return Promise.all(
            this.itemsData.map(item => {
                return new Promise(resolve => {
                    const img = new Image();
                    img.src = item.img;
                    img.onload = img.onerror = () => resolve();
                });
            })
        );
    }

    getInitialPosition(item) {
        let direction = this.animateFrom;
        if (direction === 'random') {
            const directions = ['top', 'bottom', 'left', 'right'];
            direction = directions[Math.floor(Math.random() * directions.length)];
        }

        switch (direction) {
            case 'top': return { x: item.x, y: -200 };
            case 'bottom': return { x: item.x, y: window.innerHeight + 200 };
            case 'left': return { x: -200, y: item.y };
            case 'right': return { x: window.innerWidth + 200, y: item.y };
            case 'center': return {
                x: this.containerWidth / 2 - item.w / 2,
                y: window.innerHeight / 2 - item.h / 2
            };
            default: return { x: item.x, y: item.y + 100 };
        }
    }

    async init() {
        // Clear container and create HTML structure
        this.container.innerHTML = '';

        this.itemElements = this.itemsData.map((item, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'masonry-item-wrapper';
            wrapper.dataset.index = index;
            wrapper.style.opacity = '0'; // Hide initially

            // Text element
            let textHTML = '';
            if (item.text && item.text.trim() !== '') {
                textHTML = `<p class="masonry-item-text">${item.text}</p>`;
            }

            // Image element
            const overlayHTML = this.colorShiftOnHover ? '<div class="masonry-color-overlay"></div>' : '';
            const imgHTML = `<div class="masonry-item-img" style="background-image: url('${item.img}')">${overlayHTML}</div>`;

            wrapper.innerHTML = textHTML + imgHTML;
            this.container.appendChild(wrapper);

            // Hover events
            wrapper.addEventListener('mouseenter', () => this.handleMouseEnter(wrapper));
            wrapper.addEventListener('mouseleave', () => this.handleMouseLeave(wrapper));

            // Click event to view photo in lightbox
            wrapper.addEventListener('click', () => {
                if (window.openPhotoViewer) {
                    window.openPhotoViewer(item.img);
                }
            });

            return wrapper;
        });

        await this.preloadImages();
        this.imagesReady = true;

        // Setup Resize Observer
        this.resizeObserver = new ResizeObserver(entries => {
            if (entries[0] && entries[0].contentRect) {
                const { width } = entries[0].contentRect;
                if (width && width !== this.containerWidth) {
                    this.containerWidth = width;
                    this.calculateGrid();
                }
            }
        });
        this.resizeObserver.observe(this.container);
    }

    calculateGrid() {
        if (!this.containerWidth || !this.imagesReady) return;

        const columns = this.getColumns(this.containerWidth);
        const colHeights = new Array(columns).fill(0);
        const columnWidth = this.containerWidth / columns;

        this.grid = this.itemsData.map((data, index) => {
            const el = this.itemElements[index];

            // Preserve the original 4:3 image dimensions
            const imgHeight = columnWidth * 0.75;

            // Temporarily set width to let text naturally flow and measure true height
            el.style.width = `${columnWidth}px`;

            // Real physical height required by the text and padding + image height
            const paddingGap = 15; // from gap:12 + padding:15
            const textElement = el.querySelector('.masonry-item-text');
            const textHeight = textElement ? textElement.offsetHeight : 0;

            const totalHeight = imgHeight + textHeight + (textHeight > 0 ? paddingGap : 0) + 30; // 30 is padding padding:15px on top and bottom

            // Now calculate which column to put it in
            const col = colHeights.indexOf(Math.min(...colHeights));
            let x = columnWidth * col;

            // RTL support
            if (this.isArabic) {
                x = this.containerWidth - (columnWidth * (col + 1));
            }

            const y = colHeights[col];

            colHeights[col] += totalHeight;

            // Set image div height
            const imgDiv = el.querySelector('.masonry-item-img');
            if (imgDiv) imgDiv.style.height = `${imgHeight}px`;

            return {
                el,
                x,
                y,
                w: columnWidth,
                h: totalHeight
            };
        });

        // Set container total height
        this.container.style.height = `${Math.max(...colHeights)}px`;

        this.render();
    }

    render() {
        if (typeof gsap === 'undefined') {
            console.error("GSAP is not loaded.");
            return;
        }

        this.grid.forEach((item, index) => {
            const animationProps = {
                x: item.x,
                y: item.y,
                width: item.w,
                height: item.h
            };

            if (!this.hasMounted) {
                const initialPos = this.getInitialPosition(item);
                const initialState = {
                    opacity: 0,
                    x: initialPos.x,
                    y: initialPos.y,
                    width: item.w,
                    height: item.h
                };
                if (this.blurToFocus) initialState.filter = 'blur(10px)';

                // Set initial GSAP state
                gsap.set(item.el, initialState);

                // Animate to final position
                const toState = {
                    opacity: 1,
                    ...animationProps,
                    duration: this.duration,
                    ease: this.ease,
                    delay: (index % 10) * this.stagger // stagger in batches if large
                };
                if (this.blurToFocus) toState.filter = 'blur(0px)';

                gsap.to(item.el, toState);
            } else {
                // Resize animation
                gsap.to(item.el, {
                    ...animationProps,
                    duration: this.duration,
                    ease: this.ease,
                    overwrite: 'auto'
                });
            }
        });

        this.hasMounted = true;
    }

    handleMouseEnter(element) {
        if (typeof gsap === 'undefined') return;
        if (this.scaleOnHover) {
            gsap.to(element, { scale: this.hoverScale, duration: 0.3, ease: 'power2.out' });
        }
        if (this.colorShiftOnHover) {
            const overlay = element.querySelector('.masonry-color-overlay');
            if (overlay) gsap.to(overlay, { opacity: 1, duration: 0.3 });
        }
    }

    handleMouseLeave(element) {
        if (typeof gsap === 'undefined') return;
        if (this.scaleOnHover) {
            gsap.to(element, { scale: 1, duration: 0.3, ease: 'power2.out' });
        }
        if (this.colorShiftOnHover) {
            const overlay = element.querySelector('.masonry-color-overlay');
            if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
        }
    }

    destroy() {
        if (this.resizeObserver) this.resizeObserver.disconnect();
        if (this.container) this.container.innerHTML = '';
        this.hasMounted = false;
        this.imagesReady = false;
    }
}

// ─── 3D PROFILE CARD TILT ANIMATION ────────────────
document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.pc-card');
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -15;
        const rotateY = ((x - centerX) / centerX) * 15;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s ease';
    });
});
