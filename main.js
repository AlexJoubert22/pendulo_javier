// Intersection Observer for Reveal Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lenis
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Reveal animations
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => revealObserver.observe(el));

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll transition for Hero & Concept
    const heroVideo = document.querySelector('.hero-video');
    const conceptSection = document.querySelector('.section-concept');
    const conceptBg = document.querySelector('.concept-map-bg');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Hero Transition (Zoom & Blur)
        const heroProgress = Math.min(scrollY / windowHeight, 1);
        if (heroVideo) {
            heroVideo.style.transform = `translate(-50%, -50%) scale(${1 + heroProgress * 0.3})`;
            heroVideo.style.filter = `blur(${heroProgress * 20}px)`;
            heroVideo.parentElement.style.opacity = 1 - heroProgress * 0.5;
        }

        // Concept Transition (Zoom-Out & De-Blur)
        if (conceptSection && conceptBg) {
            const rect = conceptSection.getBoundingClientRect();

            // Calculate progress based on distance to the center/top of viewport
            // We want the effect to complete by the time the section is fully visible
            const enterPoint = windowHeight;
            const exitPoint = 0;

            let conceptProgress = (rect.top - exitPoint) / (enterPoint - exitPoint);
            conceptProgress = Math.max(0, Math.min(1, conceptProgress));

            // scale 1.5 -> 1.0 (Zoom-Out)
            // blur 40px -> 0px (De-Blur)
            const scale = 1 + (conceptProgress * 0.5);
            const blur = conceptProgress * 40;

            conceptBg.style.transform = `scale(${scale})`;
            conceptBg.style.filter = `blur(${blur}px)`;
        }
    });

    // Smooth scroll for nav links & close mobile menu
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            lenis.scrollTo(this.getAttribute('href'));

            // Close mobile menu if active
            const navbar = document.querySelector('.navbar');
            if (navbar && navbar.classList.contains('mobile-menu-active')) {
                navbar.classList.remove('mobile-menu-active');
                document.body.style.overflow = '';
            }
        });
    });

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            const navbar = document.querySelector('.navbar');
            navbar.classList.toggle('mobile-menu-active');

            // Prevent body scroll when menu is open
            if (navbar.classList.contains('mobile-menu-active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // --- Shopping Cart Logic ---
    const cartToggleBtn = document.querySelector('.cart-toggle-btn');
    const cartCloseBtn = document.querySelector('.cart-close-btn');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartDrawer = document.querySelector('.cart-drawer');
    const cartCtaClose = document.querySelector('.cart-cta-close');

    const openCart = () => {
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeCart = () => {
        cartDrawer.classList.remove('open');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (cartToggleBtn && cartCloseBtn && cartOverlay && cartDrawer) {
        cartToggleBtn.addEventListener('click', openCart);
        cartCloseBtn.addEventListener('click', closeCart);
        cartOverlay.addEventListener('click', closeCart);

        if (cartCtaClose) {
            cartCtaClose.addEventListener('click', closeCart);
        }
    }
});
