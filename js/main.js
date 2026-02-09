// Main JavaScript file for LinguaFlow

// Theme Toggle Functionality
(function () {
    console.log('🌓 Main theme toggle script starting...');

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateIcons(theme);
        console.log('✅ Theme set to:', theme);
    }

    function updateIcons(theme) {
        const icons = document.querySelectorAll('.theme-toggle i');
        // console.log('🔄 Updating', icons.length, 'icons to', theme);

        icons.forEach((icon, index) => {
            try {
                // Remove both classes first to be safe
                icon.classList.remove('fa-sun', 'fa-moon');

                if (theme === 'dark') {
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.add('fa-moon');
                }
                // console.log(`✅ Icon ${index} updated to ${theme}`);
            } catch (error) {
                console.error('❌ Error updating icon:', error);
            }
        });
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        console.log('🔄 Toggling from', currentTheme, 'to', newTheme);
        setTheme(newTheme);
    }

    function attachClickListeners() {
        const toggles = document.querySelectorAll('.theme-toggle');
        console.log('🔗 Found', toggles.length, 'theme toggle buttons');

        toggles.forEach((toggle, index) => {
            try {
                // Use onclick to prevent multiple listeners
                toggle.onclick = function (e) {
                    console.log('🖱️ Theme toggle button', index, 'clicked!');
                    e.preventDefault();
                    e.stopPropagation();
                    toggleTheme();
                };
                console.log('✅ Click listener attached to button', index);
            } catch (error) {
                console.error('❌ Error attaching listener to button', index, ':', error);
            }
        });
    }

    // Initialize
    const savedTheme = localStorage.getItem('theme') || 'light';
    console.log('🎯 Initializing theme to:', savedTheme);
    setTheme(savedTheme);

    // Attach listeners
    // Try immediately, content loaded, and window load to be sure
    attachClickListeners();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachClickListeners);
    }

    window.addEventListener('load', attachClickListeners);

    // Also try again after a short delay for dynamic content
    setTimeout(attachClickListeners, 500);

    // Handle storage changes
    window.addEventListener('storage', function (e) {
        if (e.key === 'theme') {
            console.log('💾 Storage changed, updating theme...');
            setTheme(e.newValue || 'light');
        }
    });

    // Observer for dynamic content (like mobile menu being added)
    const observer = new MutationObserver(function (mutations) {
        let shouldReattach = false;
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                const addedNodes = Array.from(mutation.addedNodes);
                if (addedNodes.some(node =>
                    node.nodeType === Node.ELEMENT_NODE &&
                    (node.classList.contains('theme-toggle') || node.querySelector('.theme-toggle'))
                )) {
                    shouldReattach = true;
                }
            }
        });
        if (shouldReattach) {
            console.log('DOM changed, reattaching theme toggles...');
            setTimeout(attachClickListeners, 100);
            // Also update icons for new elements
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            updateIcons(currentTheme);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('✅ Main theme toggle loaded successfully!');
})();

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const overlay = document.getElementById('overlay');
    const body = document.body;

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function () {
            mobileMenu.classList.add('active');
            overlay.classList.add('active');
            body.style.overflow = 'hidden';
        });
    }

    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', function () {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        });
    }

    if (overlay && mobileMenu) {
        overlay.addEventListener('click', function () {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        });
    }

    // Close mobile menu when clicking on links
    const mobileNavLinks = document.querySelectorAll('.mobile-menu-nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function () {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Back to Top Button
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Show/hide back to top button based on scroll
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
    }

    // Smooth scrolling for anchor links only (not regular navigation links)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Only apply smooth scrolling to actual anchor links, not navigation links
        if (anchor.getAttribute('href').startsWith('#') && anchor.getAttribute('href') !== '#') {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    });

    // Handle window resize for mobile menu
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (window.innerWidth > 991 && mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                overlay.classList.remove('active');
                body.style.overflow = '';
            }
        }, 250);
    });

    // Handle page visibility change to ensure theme consistency
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) {
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
            const icons = document.querySelectorAll('.theme-toggle i');
            icons.forEach(icon => {
                if (savedTheme === 'dark') {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            });
        }
    });
});

// FAQ Accordion
document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            // Close other items (optional, but good UX)
            // faqItems.forEach(otherItem => {
            //     if (otherItem !== item) {
            //         otherItem.classList.remove('active');
            //     }
            // });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
});
// Search Tags Functionality for Blog Page
document.addEventListener('DOMContentLoaded', function () {
    const searchTags = document.querySelectorAll('.search-tag');

    if (searchTags.length > 0) {
        searchTags.forEach(tag => {
            tag.addEventListener('click', function () {
                // Update active state
                searchTags.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                // Filter blog posts
                const value = this.getAttribute('data-value');
                if (typeof filterBlogPosts === 'function') {
                    filterBlogPosts('category', value);
                }
            });
        });
    }
});
