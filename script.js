// ================================================
// Portfolio Website JavaScript
// Main functionality: Navigation, Animations, Form Validation
// ================================================

// ================================================
// NAVIGATION & SCROLL FUNCTIONALITY
// ================================================

/**
 * Navbar scroll effect - adds shadow when scrolled
 */
const navbar = document.getElementById('navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

/**
 * Active section highlighting in navigation
 * Updates active nav link based on scroll position
 */
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

function highlightActiveSection() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        // Check if section is in viewport (with 150px offset for better UX)
        if (scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === current) {
            link.classList.add('active');
        }
    });
}

// Listen to scroll events for active section highlighting
window.addEventListener('scroll', highlightActiveSection);

/**
 * Smooth scrolling for navigation links
 */
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

/**
 * Mobile hamburger menu toggle
 */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ================================================
// SCROLL ANIMATIONS
// ================================================

/**
 * Intersection Observer for scroll animations
 * Triggers animations when elements enter viewport
 */
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Animate skill bars when they come into view
            if (entry.target.classList.contains('skill-category')) {
                animateSkillBars(entry.target);
            }
        }
    });
}, observerOptions);

// Observe all elements with data-animate attribute
const animatedElements = document.querySelectorAll('[data-animate]');
animatedElements.forEach(el => observer.observe(el));

/**
 * Animate skill progress bars
 * @param {Element} container - Skill category container
 */
function animateSkillBars(container) {
    const skillBars = container.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        const progress = bar.getAttribute('data-progress');
        
        // Stagger animation for each bar
        setTimeout(() => {
            bar.style.setProperty('--progress-width', progress + '%');
            bar.style.width = progress + '%';
            bar.classList.add('animated');
        }, index * 100);
    });
}

// ================================================
// PROJECT FILTERING
// ================================================

/**
 * Project filter functionality
 * Filters projects based on category selection
 */
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        // Filter projects with animation
        projectCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            
            // Remove animation class first
            card.classList.remove('animate');
            
            if (filterValue === 'all' || category === filterValue) {
                // Show matching cards with staggered animation
                setTimeout(() => {
                    card.classList.remove('hide');
                    card.style.display = 'block';
                    // Trigger reflow for animation
                    void card.offsetWidth;
                    card.classList.add('animate');
                }, index * 50);
            } else {
                // Hide non-matching cards
                card.classList.add('hide');
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ================================================
// CONTACT FORM VALIDATION
// ================================================

const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const formSuccess = document.getElementById('form-success');

/**
 * Validate email format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show error message for a field
 * @param {Element} input - Input element
 * @param {string} message - Error message to display
 */
function showError(input, message) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.form-error');
    
    input.classList.add('error');
    errorElement.textContent = message;
}

/**
 * Clear error message for a field
 * @param {Element} input - Input element
 */
function clearError(input) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.form-error');
    
    input.classList.remove('error');
    errorElement.textContent = '';
}

/**
 * Validate individual field
 * @param {Element} input - Input element to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateField(input) {
    const value = input.value.trim();
    
    // Clear previous error
    clearError(input);
    
    // Name validation
    if (input === nameInput) {
        if (value === '') {
            showError(input, 'Please enter your name');
            return false;
        }
        if (value.length < 2) {
            showError(input, 'Name must be at least 2 characters');
            return false;
        }
    }
    
    // Email validation
    if (input === emailInput) {
        if (value === '') {
            showError(input, 'Please enter your email');
            return false;
        }
        if (!isValidEmail(value)) {
            showError(input, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Message validation
    if (input === messageInput) {
        if (value === '') {
            showError(input, 'Please enter your message');
            return false;
        }
        if (value.length < 10) {
            showError(input, 'Message must be at least 10 characters');
            return false;
        }
    }
    
    return true;
}

/**
 * Real-time validation on input blur
 */
[nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() !== '') {
            validateField(input);
        }
    });
    
    // Clear error on input
    input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
            clearError(input);
        }
    });
});

/**
 * Form submission handler
 */
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isNameValid = validateField(nameInput);
    const isEmailValid = validateField(emailInput);
    const isMessageValid = validateField(messageInput);
    
    // If all fields are valid
    if (isNameValid && isEmailValid && isMessageValid) {
        // Show success message
        formSuccess.classList.add('show');
        
        // Here you would typically send the form data to a server
        // For demonstration, we'll just log the data
        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: messageInput.value.trim()
        };
        
        console.log('Form submitted with data:', formData);
        
        // Reset form after 2 seconds
        setTimeout(() => {
            contactForm.reset();
            formSuccess.classList.remove('show');
        }, 3000);
    } else {
        // Shake the form to indicate error
        contactForm.style.animation = 'shake 0.5s';
        setTimeout(() => {
            contactForm.style.animation = '';
        }, 500);
    }
});

// ================================================
// PAGE LOAD ANIMATIONS
// ================================================

/**
 * Initialize animations when page loads
 */
window.addEventListener('load', () => {
    // Trigger initial section animations for elements in viewport
    highlightActiveSection();
    
    // Add loaded class to body for any CSS transitions
    document.body.classList.add('loaded');
});

// ================================================
// UTILITY FUNCTIONS
// ================================================

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll event listener using debounce
const debouncedScrollHandler = debounce(() => {
    highlightActiveSection();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// ================================================
// EASTER EGG: KEYBOARD SHORTCUTS
// ================================================

/**
 * Keyboard shortcuts for quick navigation
 * Press numbers 1-6 to jump to sections
 */
document.addEventListener('keydown', (e) => {
    // Only trigger if not typing in input/textarea
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        const sectionMap = {
            '1': 'about',
            '2': 'skills',
            '3': 'projects',
            '4': 'experience',
            '5': 'education',
            '6': 'contact'
        };
        
        const sectionId = sectionMap[e.key];
        if (sectionId) {
            e.preventDefault();
            const section = document.getElementById(sectionId);
            if (section) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = section.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }
});

// Add CSS for shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// ================================================
// PERFORMANCE OPTIMIZATION
// ================================================

/**
 * Lazy loading for images (if needed in future)
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    // Observe images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ================================================
// CONSOLE MESSAGE
// ================================================

console.log('%c👋 Hello Developer!', 'font-size: 20px; color: #1a4d2e; font-weight: bold;');
console.log('%cThanks for checking out the code! Feel free to reach out if you want to collaborate.', 'font-size: 14px; color: #d4af37;');
console.log('%cKeyboard shortcuts: Press 1-6 to navigate to different sections', 'font-size: 12px; color: #4a4a4a;');
