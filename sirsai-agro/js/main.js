// Sticky Header
const header = document.querySelector('.site-header');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

let isScrolling = false;
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            isScrolling = false;
        });
        isScrolling = true;
    }
});


// Mobile Navigation Toggle
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const isExpanded = navLinks.classList.contains('active');
    mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
});

// Close mobile menu when clicking outside or on a link
document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', false);
    }
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', false);
    });
});

// Lightbox Logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

document.querySelectorAll('.lightbox-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
        const imgBlock = trigger.querySelector('img');
        const title = trigger.getAttribute('data-title');
        if (imgBlock) {
            lightboxImg.src = imgBlock.src;
            lightboxCaption.textContent = title || '';
            lightbox.classList.add('active');
        }
    });
});

lightboxClose?.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

lightbox?.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) {
        lightbox.classList.remove('active');
    }
});

// 3D Scroll Scrub (Hero Sequence Canvas)
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const context = canvas.getContext('2d');
    const frameCount = 240;
    const images = [];
    const sequenceState = { frame: 0 };
    
    // Setting logical base sizing, CSS handles responsiveness natively via object-fit: cover
    canvas.width = 1920;
    canvas.height = 1080;
    
    // Format frame path loader
    const currentFrame = index => (
        `assets/hero_sequence_leaf/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
    );

    // Preload entire array into memory
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }
    
    // Establish paint
    images[0].onload = render;

    function render() {
        if(images[sequenceState.frame] && images[sequenceState.frame].complete) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(images[sequenceState.frame], 0, 0, canvas.width, canvas.height);
        }
    }

    const heroSection = document.querySelector('.hero-sequence-container');

    window.addEventListener('scroll', () => {
        if (!heroSection) return;
        
        // Calculate scroll bounds strictly within the 300vh Hero envelope
        const scrollTop = window.scrollY - heroSection.offsetTop;
        const maxScrollTop = heroSection.scrollHeight - window.innerHeight;
        
        let scrollFraction = scrollTop / maxScrollTop;
        scrollFraction = Math.max(0, Math.min(1, scrollFraction));
        
        // Map scroll fraction tightly to the 120 frames
        const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(scrollFraction * frameCount)
        );
        
        if (sequenceState.frame !== frameIndex) {
            sequenceState.frame = frameIndex;
            window.requestAnimationFrame(render);
        }
    });
}
