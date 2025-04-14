
document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                if (navLinks && navLinks.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Animation on Scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(element => observer.observe(element));

    // Particles Animation with Cursor Interaction
    const initParticles = () => {
        const canvas = document.getElementById('particles');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let particles = [];
        let mouseX = null;
        let mouseY = null;

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.baseX = this.x;
                this.baseY = this.y;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 3 - 1.5;
                this.speedY = Math.random() * 3 - 1.5;
            }

            update() {
                if (this.x > width || this.x < 0) this.speedX *= -1;
                if (this.y > height || this.y < 0) this.speedY *= -1;
                this.x += this.speedX;
                this.y += this.speedY;

                if (mouseX !== null && mouseY !== null) {
                    const dx = mouseX - this.x;
                    const dy = mouseY - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const maxDistance = 100;
                    if (distance < maxDistance) {
                        const force = (maxDistance - distance) / maxDistance;
                        const angle = Math.atan2(dy, dx);
                        this.x -= Math.cos(angle) * force * 8;
                        this.y -= Math.sin(angle) * force * 8;
                    }
                }

                this.x = Math.max(0, Math.min(this.x, width));
                this.y = Math.max(0, Math.min(this.y, height));
            }

            draw() {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < Math.floor(width / 15); i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            
            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles = [];
            for (let i = 0; i < Math.floor(width / 15); i++) {
                particles.push(new Particle());
            }
        });

        canvas.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        canvas.addEventListener('mouseleave', () => {
            mouseX = null;
            mouseY = null;
        });

        animate();
    };

    // Floating Elements Cursor Interaction
    const initFloatingElements = () => {
        const imageContainer = document.querySelector('.image-container');
        if (!imageContainer) return;

        const floatingElements = imageContainer.querySelectorAll('.floating-element');

        imageContainer.addEventListener('mousemove', (e) => {
            const rect = imageContainer.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            floatingElements.forEach((element) => {
                const elementRect = element.getBoundingClientRect();
                const elementCenterX = elementRect.left - rect.left + elementRect.width / 2;
                const elementCenterY = elementRect.top - rect.top + elementRect.height / 2;

                const dx = mouseX - elementCenterX;
                const dy = mouseY - elementCenterY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 150;

                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    const angle = Math.atan2(dy, dx);
                    const wobbleX = Math.cos(angle) * force * 15;
                    const wobbleY = Math.sin(angle) * force * 15;
                    element.style.transform = `translate(${wobbleX}px, ${wobbleY}px)`;
                } else {
                    element.style.transform = 'translate(0, 0)';
                }
            });
        });

        imageContainer.addEventListener('mouseleave', () => {
            floatingElements.forEach(element => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    };

    // Testimonial Slider
    const initTestimonialSlider = () => {
        const track = document.querySelector('.testimonial-track');
        const cards = document.querySelectorAll('.testimonial-card');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (!track || !cards.length) return;

        let currentIndex = 0;
        let autoSlideInterval;

        const updateSlider = () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            cards.forEach(card => card.classList.remove('active'));
            cards[currentIndex].classList.add('active');
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateSlider();
        };

        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateSlider();
        };

        const startAutoSlide = () => {
            autoSlideInterval = setInterval(nextSlide, 5000);
        };

        updateSlider();
        startAutoSlide();

        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            clearInterval(autoSlideInterval);
            startAutoSlide();
        });

        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            clearInterval(autoSlideInterval);
            startAutoSlide();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateSlider();
                clearInterval(autoSlideInterval);
                startAutoSlide();
            });
        });

        track.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        track.addEventListener('mouseleave', startAutoSlide);
    };

    // Form Submission
    const initContactForm = () => {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = contactForm.querySelector('#name').value.trim();
            const email = contactForm.querySelector('#email').value.trim();
            const message = contactForm.querySelector('#message').value.trim();
            
            if (!name || !email || !message) {
                showFormMessage('Please fill all required fields', 'error');
                return;
            }
            
            if (!/^\S+@\S+\.\S+$/.test(email)) {
                showFormMessage('Please enter a valid email', 'error');
                return;
            }
            
            showFormMessage('Thank you! Your message has been sent.', 'success');
            contactForm.reset();
        });

        const showFormMessage = (text, type) => {
            const existingMessage = document.querySelector('.form-message');
            if (existingMessage) existingMessage.remove();

            const message = document.createElement('div');
            message.className = `form-message ${type}`;
            message.textContent = text;
            
            message.style.cssText = `
                padding: 1rem;
                margin: 1rem 0;
                border-radius: 5px;
                color: ${type === 'error' ? '#721c24' : '#155724'};
                background-color: ${type === 'error' ? '#f8d7da' : '#d4edda'};
                border: 1px solid ${type === 'error' ? '#f5c6cb' : '#c3e6cb'};
            `;

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            contactForm.insertBefore(message, submitBtn);
            
            setTimeout(() => {
                message.style.transition = 'opacity 0.5s';
                message.style.opacity = '0';
                setTimeout(() => message.remove(), 500);
            }, 5000);
        };
    };

    // Initialize all components
    initParticles();
    initFloatingElements();
    initTestimonialSlider();
    initContactForm();
});
