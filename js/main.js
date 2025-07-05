/*
=============================================================================
Fashion Designer Portfolio - Main JavaScript
Handles navigation, animations, and portfolio downloads
=============================================================================
*/

'use strict';

// DOM Elements
const elements = {
    navigation: document.getElementById('navigation'),
    navToggle: document.getElementById('nav-toggle'),
    navMenu: document.getElementById('nav-menu'),
    navMenuMain: document.querySelector('.nav-menu-main'),
    navLinks: document.querySelectorAll('.nav-link'),
    backToTop: document.getElementById('back-to-top'),
    contactForm: document.getElementById('contact-form'),
    fadeElements: document.querySelectorAll('.fade-in'),
    heroImage: document.querySelector('.hero-image')
};

// Configuration
const config = {
    scrollThreshold: 100,
    animationDelay: 100,
    scrollDuration: 800,
    debounceDelay: 16,
    intersectionThreshold: 0.1,
    portfolioAssets: [
        { name: 'boho-chic', title: 'Boho Chic', description: 'Click to Download PDF' },
        { name: 'cozy_coastal', title: 'Cozy Coastal', description: 'Click to Download PDF' },
        { name: 'instrument', title: 'Instrument', description: 'Click to Download PDF' }
    ]
};

// Utility Functions
const utils = {
    // Debounce function to limit function calls
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Smooth scroll to element
    smoothScrollTo(element, duration = config.scrollDuration) {
        const targetPosition = element.offsetTop - 80; // Account for fixed nav
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = utils.easeInOutQuart(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        requestAnimationFrame(animation);
    },

    // Easing function for smooth animations
    easeInOutQuart(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t * t + b;
        t -= 2;
        return -c / 2 * (t * t * t * t - 2) + b;
    },

    // Get element's position relative to viewport
    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset
        };
    },

    // Check if element is in viewport
    isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= -threshold &&
            rect.left >= -threshold &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + threshold &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) + threshold
        );
    }
};

// Navigation functionality
const navigation = {
    init() {
        this.bindEvents();
        this.setActiveLink();
    },

    bindEvents() {
        // Mobile menu toggle
        if (elements.navToggle) {
            elements.navToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Navigation links
        elements.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });

        // Scroll events
        window.addEventListener('scroll', utils.throttle(this.handleScroll.bind(this), config.debounceDelay));
        
        // Resize events
        window.addEventListener('resize', utils.debounce(this.handleResize.bind(this), 250));
    },

    toggleMobileMenu() {
        elements.navMenu.classList.toggle('active');
        elements.navToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (elements.navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    },

    closeMobileMenu() {
        elements.navMenu.classList.remove('active');
        elements.navToggle.classList.remove('active');
        document.body.style.overflow = '';
    },

    handleNavClick(e) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        
        if (href.startsWith('#')) {
            const targetElement = document.querySelector(href);
            if (targetElement) {
                // Use native browser scroll for fast navigation like the CTA button
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                this.setActiveLink(e.target);
                this.closeMobileMenu();
            }
        }
    },

    handleScroll() {
        const scrollY = window.pageYOffset;
        
        // Update navigation background
        if (scrollY > config.scrollThreshold) {
            elements.navigation.classList.add('scrolled');
        } else {
            elements.navigation.classList.remove('scrolled');
        }

        // Update active navigation link based on scroll position
        if (typeof this.updateActiveLink === 'function') {
            this.updateActiveLink();
        }
        
        // Show/hide back to top button
        backToTop.toggle(scrollY > config.scrollThreshold * 2);
    },

    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
    },

    setActiveLink(activeLink = null) {
        elements.navLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) {
            activeLink.classList.add('active');
        } else {
            // Set home as active by default
            const homeLink = document.querySelector('.nav-link[href="#home"]');
            if (homeLink) homeLink.classList.add('active');
        }
    },

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                elements.navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }
};

// Back to top functionality
const backToTop = {
    init() {
        if (elements.backToTop) {
            elements.backToTop.addEventListener('click', this.scrollToTop.bind(this));
        }
    },

    toggle(show) {
        if (!elements.backToTop) return;
        
        if (show) {
            elements.backToTop.classList.add('visible');
        } else {
            elements.backToTop.classList.remove('visible');
        }
    },

    scrollToTop() {
        utils.smoothScrollTo(document.body, 600);
    }
};

// Portfolio dynamic loading
const portfolioManager = {
    init() {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
            this.loadPortfolioItems();
        });
    },

    loadPortfolioItems() {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        
        if (!portfolioGrid) {
            // Retry after a delay
            setTimeout(() => {
                this.loadPortfolioItems();
            }, 1000);
            return;
        }

        // Check if fallback items exist
        const fallbackItems = portfolioGrid.querySelectorAll('.portfolio-item.fallback');
        
        if (fallbackItems.length > 0) {
            // Use fallback items and bind events
            this.bindPortfolioEvents();
            return;
        }

        // Clear existing items and create dynamic ones
        portfolioGrid.innerHTML = '';

        // Create portfolio items dynamically
        config.portfolioAssets.forEach((asset, index) => {
            const portfolioItem = this.createPortfolioItem(asset);
            portfolioGrid.appendChild(portfolioItem);
        });

        // Reinitialize portfolio item events
        this.bindPortfolioEvents();
    },

    createPortfolioItem(asset) {
        const article = document.createElement('article');
        article.className = 'portfolio-item';
        article.setAttribute('data-pdf', `${asset.name}.pdf`);

        article.innerHTML = `
            <div class="portfolio-image-container">
                <img src="./assets/portfolios/${asset.name}.png" alt="${asset.title} Portfolio Preview" class="portfolio-image">
                <div class="portfolio-overlay">
                    <h3 class="portfolio-title">${asset.title}</h3>
                    <p class="portfolio-description">${asset.description}</p>
                </div>
                <div class="pdf-indicator">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                </div>
            </div>
        `;

        return article;
    },

    bindPortfolioEvents() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(item => {
            item.addEventListener('click', this.downloadPDF.bind(this));
        });
        
        // Setup accessibility for newly created portfolio items
        if (typeof accessibility !== 'undefined') {
            accessibility.setupPortfolioKeyboardNavigation();
            accessibility.setupPortfolioAriaLabels();
        }
    },

    downloadPDF(e) {
        const pdfFileName = e.currentTarget.getAttribute('data-pdf');
        const pdfUrl = `./assets/portfolios/${pdfFileName}`;
        
        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = pdfUrl;
        downloadLink.download = pdfFileName;
        downloadLink.style.display = 'none';
        
        // Add to DOM and trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        
        // Clean up
        document.body.removeChild(downloadLink);
    }
};

// Contact form functionality
const contactForm = {
    init() {
        if (elements.contactForm) {
            elements.contactForm.addEventListener('submit', this.handleSubmit.bind(this));
            this.bindValidation();
        }
    },

    bindValidation() {
        const inputs = elements.contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', this.validateField.bind(this));
            input.addEventListener('input', this.clearFieldError.bind(this));
        });
    },

    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        this.clearFieldError(e);

        // Validation rules
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    },

    clearFieldError(e) {
        const field = e.target;
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    },

    showFieldError(field, message) {
        field.classList.add('error');
        
        // Add error styling
        if (!field.style.borderColor) {
            field.style.borderColor = '#e74c3c';
        }
        
        // Create error message element
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #e74c3c;
            font-size: 0.875rem;
            margin-top: 0.5rem;
            display: block;
        `;
        
        field.parentNode.appendChild(errorElement);
    },

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(elements.contactForm);
        const data = Object.fromEntries(formData.entries());
        
        // Check for honeypot (spam protection)
        if (data.website) {
            return; // Silent fail for bots
        }

        // Validate all fields
        const inputs = elements.contactForm.querySelectorAll('input[required], textarea[required]');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField({ target: input })) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showFormMessage('Please correct the errors above.', 'error');
            return;
        }

        // Show loading state
        const submitButton = elements.contactForm.querySelector('.form-submit');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        try {
            // Here you would typically send the data to your server
            // For now, we'll simulate a successful submission
            await this.simulateFormSubmission(data);
            
            this.showFormMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
            elements.contactForm.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    },

    async simulateFormSubmission(data) {
        // Simulate API call delay
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form data:', data);
                resolve();
            }, 1500);
        });
    },

    showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = elements.contactForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message--${type}`;
        messageElement.textContent = message;
        messageElement.style.cssText = `
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 4px;
            font-size: 0.95rem;
            font-weight: 500;
            background-color: ${type === 'success' ? '#d4edda' : '#f8d7da'};
            color: ${type === 'success' ? '#155724' : '#721c24'};
            border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
        `;

        elements.contactForm.appendChild(messageElement);

        // Auto-remove success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 5000);
        }
    }
};

// Scroll animations with Intersection Observer
const scrollAnimations = {
    init() {
        this.createObserver();
        this.observeElements();
    },

    createObserver() {
        const options = {
            threshold: config.intersectionThreshold,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Unobserve element after animation to improve performance
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    },

    observeElements() {
        // Observe fade-in elements
        const fadeElements = document.querySelectorAll('.fade-in, .portfolio-item, .philosophy-item');
        fadeElements.forEach((element, index) => {
            // Add staggered animation delay
            element.style.animationDelay = `${index * config.animationDelay}ms`;
            this.observer.observe(element);
        });
    }
};

// Performance optimizations
const performance = {
    init() {
        this.lazyLoadImages();
        this.optimizeScrollEvents();
        this.preloadCriticalResources();
    },

    lazyLoadImages() {
        // Native lazy loading is already implemented in HTML
        // This is a fallback for older browsers
        if ('loading' in HTMLImageElement.prototype) {
            return; // Native lazy loading is supported
        }

        const images = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('loading');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    },

    optimizeScrollEvents() {
        // Use passive event listeners for better performance
        window.addEventListener('scroll', navigation.handleScroll, { passive: true });
        window.addEventListener('touchstart', () => {}, { passive: true });
    },

    preloadCriticalResources() {
        // Preload hero image and portfolio thumbnail images
        const criticalImages = [
            './images/hero-image.jpg',
            './images/designer-portrait-cropped.png',
            './assets/portfolios/boho-chic.png',
            './assets/portfolios/cozy_coastal.png',
            './assets/portfolios/instrument.png'
        ];
        
        // Simple image preloading
        criticalImages.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
};

// Accessibility enhancements
const accessibility = {
    init() {
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
    },

    setupKeyboardNavigation() {
        // Enable keyboard navigation for portfolio items (called after they're created)
        this.setupPortfolioKeyboardNavigation();

        // Add keyboard navigation for social links
        const socialLinks = document.querySelectorAll('.nav-social-link, .social-link');
        socialLinks.forEach(link => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (link.href) {
                        window.open(link.href, '_blank', 'noopener,noreferrer');
                    }
                }
            });
        });
    },

    setupPortfolioKeyboardNavigation() {
        // This will be called after portfolio items are created
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(item => {
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.click();
                }
            });
        });
    },

    setupScreenReaderSupport() {
        // Add aria-labels for better screen reader support (called after portfolio items are created)
        this.setupPortfolioAriaLabels();
    },

    setupPortfolioAriaLabels() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach((item, index) => {
            const title = item.querySelector('.portfolio-title')?.textContent || `Portfolio item ${index + 1}`;
            item.setAttribute('aria-label', `Download ${title} portfolio PDF`);
        });
    }
};

// Hero Slider functionality
const heroSlider = {
    currentSlide: 0,
    totalSlides: 0,
    autoPlayInterval: null,
    autoPlayDelay: 5000, // 5 seconds

    init() {
        // Wait for DOM to be fully ready
        setTimeout(() => {
            this.slides = document.querySelectorAll('.hero-slide');
            this.dots = document.querySelectorAll('.hero-dot');
            
            console.log('Hero Slider Init:', {
                slides: this.slides.length,
                dots: this.dots.length
            });
            
            if (this.slides.length === 0) {
                console.warn('No hero slides found');
                return;
            }
            
            this.totalSlides = this.slides.length;
            this.bindEvents();
            this.startAutoPlay();
            
            console.log('Hero Slider initialized successfully');
        }, 100);
    },

    bindEvents() {
        // Dot navigation with improved click handling
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Dot clicked:', index);
                this.goToSlide(index);
            });
            
            // Add hover effect for better UX
            dot.addEventListener('mouseenter', () => {
                dot.style.transform = 'scale(1.2)';
            });
            
            dot.addEventListener('mouseleave', () => {
                dot.style.transform = 'scale(1)';
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });

        // Pause autoplay on hover
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => {
                this.pauseAutoPlay();
            });

            heroSection.addEventListener('mouseleave', () => {
                this.startAutoPlay();
            });
        }

        // Touch/swipe support for mobile
        this.setupTouchSupport();
    },

    setupTouchSupport() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        let startX = 0;
        let endX = 0;

        heroSection.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        heroSection.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        }, { passive: true });
    },

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    },

    goToSlide(index) {
        if (index < 0 || index >= this.totalSlides) {
            console.warn('Invalid slide index:', index);
            return;
        }

        console.log('Going to slide:', index, 'from:', this.currentSlide);

        // Remove active class from current slide and dot
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');

        // Update current slide
        this.currentSlide = index;

        // Add active class to new slide and dot
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');

        // Reset autoplay timer
        this.resetAutoPlay();
    },

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    },

    prevSlide() {
        const prevIndex = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.goToSlide(prevIndex);
    },

    startAutoPlay() {
        if (this.autoPlayInterval) {
            console.log('Auto-play already running');
            return;
        }
        
        console.log('Starting auto-play with delay:', this.autoPlayDelay);
        this.autoPlayInterval = setInterval(() => {
            console.log('Auto-play: next slide');
            this.nextSlide();
        }, this.autoPlayDelay);
    },

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    },

    resetAutoPlay() {
        this.pauseAutoPlay();
        this.startAutoPlay();
    },

    // Test function to manually trigger slide change
    testSlideChange() {
        console.log('Testing slide change...');
        this.nextSlide();
    }
};

// Add global test function for debugging
window.testHeroSlider = function() {
    if (heroSlider && typeof heroSlider.testSlideChange === 'function') {
        heroSlider.testSlideChange();
    } else {
        console.error('Hero slider not available');
    }
};

// Main initialization
const app = {
    init() {
        // Check if DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', this.start.bind(this));
        } else {
            this.start();
        }
    },

    start() {
        console.log('Fashion Portfolio application started');
        
        this.setupErrorHandling();
        
        // Initialize all modules
        navigation.init();
        backToTop.init();
        heroSlider.init(); // Initialize hero slider
        portfolioManager.init(); // Initialize portfolio manager first
        contactForm.init();
        scrollAnimations.init();
        performance.init();
        accessibility.init();
        
        // Performance monitoring
        if (window.performance && window.performance.mark) {
            window.performance.mark('app-start');
        }
        
        // Preload critical resources
        performance.preloadCriticalResources();
        
        // Setup optimizations
        performance.optimizeScrollEvents();
        
        // Mark app as ready
        document.body.classList.add('app-ready');
        
        if (window.performance && window.performance.mark) {
            window.performance.mark('app-ready');
            window.performance.measure('app-initialization', 'app-start', 'app-ready');
        }
    },

    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Runtime error:', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
        });
    }
};

// Initialize the application
app.init();

// Export for potential external use
window.FashionPortfolio = {
    navigation,
    contactForm,
    utils
}; 