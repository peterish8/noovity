document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation library
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Animate nav items
            navItems.forEach((item, index) => {
                if (item.style.animation) {
                    item.style.animation = '';
                } else {
                    item.style.animation = `navItemFade 0.5s ease forwards ${index * 0.1 + 0.3}s`;
                }
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    navItems.forEach(item => {
                        item.style.animation = '';
                    });
                }
            }
        });
    });

    // Particles animation for hero section
    const canvas = document.getElementById('particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Resize canvas when window is resized
        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
                this.color = 'rgba(255, 255, 255, 0.3)';
                this.originalX = this.x;
                this.originalY = this.y;
                this.density = (Math.random() * 30) + 1;
            }

            update(mouse) {
                // Movement with mouse interaction
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let maxDistance = 100;
                let force = (maxDistance - distance) / maxDistance;
                let directionX = forceDirectionX * force * this.density * 0.6;
                let directionY = forceDirectionY * force * this.density * 0.6;

                if (distance < maxDistance) {
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    if (this.x !== this.originalX) {
                        let dx = this.originalX - this.x;
                        this.x += dx / 10;
                    }
                    if (this.y !== this.originalY) {
                        let dy = this.originalY - this.y;
                        this.y += dy / 10;
                    }
                }

                // Boundary check
                if (this.x > canvas.width || this.x < 0) {
                    this.speedX = -this.speedX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.speedY = -this.speedY;
                }

                // Move particle
                this.x += this.speedX;
                this.y += this.speedY;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Mouse position
        let mouse = {
            x: null,
            y: null
        };

        window.addEventListener('mousemove', function(event) {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        // Create particle array
        const particles = [];
        const particleCount = 100;

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Animation function
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update(mouse);
                particles[i].draw();
                
                // Connect particles with lines
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - distance/1000})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }

    // Process section animation
    const processItems = document.querySelectorAll('.process-item');
    
    function checkProcessItems() {
        const triggerBottom = window.innerHeight / 5 * 4;
        
        processItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            
            if (itemTop < triggerBottom) {
                item.classList.add('visible');
            }
        });
    }
    
    window.addEventListener('scroll', checkProcessItems);
    checkProcessItems(); // Run once on load

    // Testimonial slider
    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    let autoSlideInterval;

    function updateTestimonialPosition() {
        testimonialTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update active dot
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
        
        // Update active card
        testimonialCards.forEach(card => card.classList.remove('active'));
        testimonialCards[currentIndex].classList.add('active');
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex === testimonialCards.length - 1) ? 0 : currentIndex + 1;
            updateTestimonialPosition();
        }, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    if (dots.length > 0) {
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                currentIndex = parseInt(this.getAttribute('data-index'));
                updateTestimonialPosition();
                resetAutoSlide();
            });
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentIndex = (currentIndex === 0) ? testimonialCards.length - 1 : currentIndex - 1;
            updateTestimonialPosition();
            resetAutoSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentIndex = (currentIndex === testimonialCards.length - 1) ? 0 : currentIndex + 1;
            updateTestimonialPosition();
            resetAutoSlide();
        });
    }

    // Start auto slide
    startAutoSlide();

    // Pause auto slide on hover
    testimonialTrack.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    testimonialTrack.addEventListener('mouseleave', startAutoSlide);

    // Form submission
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real implementation, you would send the form data to a server
            const formData = new FormData(this);
            const formValues = {};
            
            for (let [key, value] of formData.entries()) {
                formValues[key] = value;
            }
            
            console.log('Form submitted:', formValues);
            
            // Reset form
            this.reset();
            
            // Remove any existing success message
            const existingMessage = this.parentElement.querySelector('.success-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
            successMessage.style.color = '#0a8a5f';
            successMessage.style.padding = '1rem';
            successMessage.style.marginTop = '1rem';
            successMessage.style.backgroundColor = 'rgba(10, 138, 95, 0.1)';
            successMessage.style.borderRadius = '5px';
            successMessage.style.animation = 'fadeIn 0.5s ease forwards';
            
            this.parentElement.appendChild(successMessage);
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.style.animation = 'fadeOut 0.5s ease forwards';
                setTimeout(() => {
                    successMessage.remove();
                }, 500);
            }, 5000);
        });
    }

    // Add animation for nav items
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes navItemFade {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes fadeOut {
            to {
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});
