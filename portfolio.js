// Initialize active state on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set home as active by default
    const homeLink = document.querySelector('.nav-menu a[href="#home"]');
    if (homeLink) {
        homeLink.classList.add('active');
    }
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const menuOverlay = document.querySelector('.menu-overlay');

// Toggle menu when hamburger clicked
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Close menu when clicking on overlay
menuOverlay.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active section detection using Intersection Observer (more accurate)
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
const sections = document.querySelectorAll('section[id]');

// Create a map of sections that have nav links
const sectionsWithNavLinks = Array.from(sections).filter(section => {
    const sectionId = section.getAttribute('id');
    return Array.from(navLinks).some(link => 
        link.getAttribute('href') === `#${sectionId}`
    );
});

// Intersection Observer for section detection
const sectionObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px', // Trigger when section is in middle of viewport
    threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');
            
            // Remove active from all links
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active to corresponding link
            navLinks.forEach(link => {
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, sectionObserverOptions);

// Observe all sections with nav links
sectionsWithNavLinks.forEach(section => {
    sectionObserver.observe(section);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            // Smooth scroll to target
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Wait for scroll to complete before updating active state
            setTimeout(() => {
                // Remove active class from all nav links
                document.querySelectorAll('.nav-menu a').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to clicked link
                this.classList.add('active');
            }, 100);
        }
    });
});

// Intersection Observer for animations
const animationObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, animationObserverOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .project-card, .testimonial-card, .step, .pricing-card').forEach(el => {
    observer.observe(el);
});

// Skill bars animation
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBars = entry.target.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 200);
            });
        }
    });
}, animationObserverOptions);

const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    skillObserver.observe(skillsSection);
}

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const service = formData.get('service');
        const message = formData.get('message');
        
        // Simple form validation
        const requiredFields = this.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                field.style.borderColor = '#e5e7eb';
            }
        });
        
        if (isValid) {
            // Build WhatsApp message
            let whatsappMessage = `🔔 *Pesan Baru dari Website Portfolio*\n\n`;
            whatsappMessage += `👤 *Nama:* ${name}\n`;
            whatsappMessage += `📧 *Email:* ${email}\n`;
            whatsappMessage += `📱 *Telepon:* ${phone}\n`;
            whatsappMessage += `🛠️ *Layanan:* ${service}\n\n`;
            whatsappMessage += `💬 *Pesan:*\n${message}`;
            
            // Encode message for URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            // Open WhatsApp
            const whatsappURL = `https://wa.me/62821199045813?text=${encodedMessage}`;
            window.open(whatsappURL, '_blank');
            
            // Show success message
            showNotification('Mengarahkan ke WhatsApp...', 'success');
            
            // Reset form after short delay
            setTimeout(() => {
                this.reset();
            }, 1000);
        } else {
            showNotification('Mohon lengkapi semua field yang diperlukan.', 'error');
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Typing animation for hero text
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }
    
    updateCounter();
}

// Animate counters when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('h4');
            if (statNumber) {
                const targetValue = parseInt(statNumber.textContent);
                animateCounter(statNumber, targetValue);
                statsObserver.unobserve(entry.target);
            }
        }
    });
}, animationObserverOptions);

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroCards = document.querySelectorAll('.hero-card');
    
    heroCards.forEach((card, index) => {
        const speed = 0.5 + (index * 0.1);
        card.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add loading animation
// window.addEventListener('load', () => {
//     document.body.classList.add('loaded');
// });

// Add CSS for loading state
// const loadingStyles = `
//     body:not(.loaded) {
//         overflow: hidden;
//     }
    
//     body:not(.loaded)::before {
//         content: '';
//         position: fixed;
//         top: 0;
//         left: 0;
//         width: 100%;
//         height: 100%;
//         background: white;
//         z-index: 10000;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//     }
    
//     body:not(.loaded)::after {
//         content: '';
//         width: 50px;
//         height: 50px;
//         border: 3px solid #e5e7eb;
//         border-top: 3px solid #6366f1;
//         border-radius: 50%;
//         animation: spin 1s linear infinite;
//         position: fixed;
//         top: 50%;
//         left: 50%;
//         transform: translate(-50%, -50%);
//         z-index: 10001;
//     }
    
//     @keyframes spin {
//         0% { transform: translate(-50%, -50%) rotate(0deg); }
//         100% { transform: translate(-50%, -50%) rotate(360deg); }
//     }
// `;

// // Add loading styles to head
// const styleSheet = document.createElement('style');
// styleSheet.textContent = loadingStyles;
// document.head.appendChild(styleSheet);

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img').forEach(img => {
    imageObserver.observe(img);
});

// Add hover effects for cards
document.querySelectorAll('.service-card, .project-card, .testimonial-card, .pricing-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// WhatsApp integration
function openWhatsApp(message = '') {
    const phoneNumber = '6281234567890'; // Ganti dengan nomor WhatsApp Anda
    const encodedMessage = encodeURIComponent(message || 'Halo, saya tertarik dengan layanan pembuatan website Anda.');
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
}

// Add WhatsApp click handlers
document.querySelectorAll('a[href*="whatsapp"]').forEach(element => {
    element.addEventListener('click', function(e) {
        e.preventDefault();
        openWhatsApp();
    });
});

// Personal touch - add some personality to the console
// console.log(`
// 🚀 Portfolio Website Loaded Successfully!
// 👨‍💻 Freelance Web Developer Portfolio
// 📧 Ready to work on your next project!

// Interested in working together? Let's connect!
// `);

// Add dynamic year to footer
document.addEventListener('DOMContentLoaded', function() {
    const currentYear = new Date().getFullYear();
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        footerYear.innerHTML = footerYear.innerHTML.replace('2024', currentYear);
    }
});

// Add smooth reveal animation for sections
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Apply reveal animation to sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(section);
});

// Add interactive cursor effect (optional enhancement)
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Enhanced form interaction
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
    field.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    field.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

// Add testimonial slider functionality (if needed)
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');

function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
        testimonial.style.display = i === index ? 'block' : 'none';
    });
}

// Auto-rotate testimonials every 5 seconds (optional)
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}, 5000);


// ===== ORDER & WHATSAPP INTEGRATION =====
const orderButtons = document.querySelectorAll('.order-btn');
const addonCheckboxes = document.querySelectorAll('.addon-checkbox');
const addonCards = document.querySelectorAll('.addon-card');
const whatsappNumber = '6282119904581';

// Format number to Rupiah
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
}

// Handle addon checkbox change
addonCheckboxes.forEach((checkbox, index) => {
    checkbox.addEventListener('change', function() {
        const card = addonCards[index];
        if (this.checked) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
});

// Handle addon card click (toggle checkbox)
addonCards.forEach((card, index) => {
    card.addEventListener('click', function(e) {
        // Don't toggle if clicking the checkbox itself
        if (e.target.classList.contains('addon-checkbox') || 
            e.target.classList.contains('addon-checkbox-label') ||
            e.target.closest('.addon-checkbox-label')) {
            return;
        }
        
        const checkbox = addonCheckboxes[index];
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
    });
});

// Handle order button click
orderButtons.forEach(button => {
    button.addEventListener('click', function() {
        const packageName = this.dataset.package;
        const packagePrice = parseInt(this.dataset.price);
        
        // Get selected addons
        const selectedAddons = [];
        let totalAddonPrice = 0;
        
        addonCheckboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                const card = addonCards[index];
                const addonName = card.dataset.addonName;
                const addonPrice = parseInt(card.dataset.addonPrice);
                selectedAddons.push({ name: addonName, price: addonPrice });
                totalAddonPrice += addonPrice;
            }
        });
        
        // Calculate total
        const totalPrice = packagePrice + totalAddonPrice;
        
        // Build WhatsApp message
        let message = `Halo, saya tertarik memesan:\n\n`;
        message += `*Paket:* ${packageName}\n`;
        message += `*Harga Paket:* ${formatRupiah(packagePrice)}\n`;
        
        if (selectedAddons.length > 0) {
            message += `\n*Add-On yang dipilih:*\n`;
            selectedAddons.forEach(addon => {
                message += `✓ ${addon.name} (${formatRupiah(addon.price)})\n`;
            });
        }
        
        message += `\n*Total Estimasi:* ${formatRupiah(totalPrice)}\n`;
        message += `\nMohon informasi lebih lanjut. Terima kasih!`;
        
        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);
        
        // Open WhatsApp
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
    });
});