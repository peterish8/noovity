// Wait for the DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
    }
    
    // Smooth Scrolling for Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (mobileMenuToggle && mobileMenuToggle.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            }
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header Scroll Effect
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Stats Counter Animation
    const stats = [
        { id: 'years-count', target: 5 },
        { id: 'clients-count', target: 100 },
        { id: 'projects-count', target: 150 },
        { id: 'techs-count', target: 25 }
    ];
    
    const statsSection = document.getElementById('why-us');
    let countersAnimated = false;
    
    function animateCounters() {
        if (countersAnimated) return;
        
        stats.forEach(stat => {
            const element = document.getElementById(stat.id);
            if (!element) return;
            
            let count = 0;
            const increment = Math.ceil(stat.target / 50);
            const duration = 1500; // ms
            const interval = duration / (stat.target / increment);
            
            const counter = setInterval(() => {
                count += increment;
                if (count >= stat.target) {
                    element.textContent = stat.target;
                    clearInterval(counter);
                } else {
                    element.textContent = count;
                }
            }, interval);
        });
        
        countersAnimated = true;
    }
    
    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.control-prev');
    const nextBtn = document.querySelector('.control-next');
    let currentIndex = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active');
            dots[i].classList.remove('active');
        });
        
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }
    
    if (prevBtn && nextBtn && dots.length > 0) {
        prevBtn.addEventListener('click', function() {
            let newIndex = currentIndex - 1;
            if (newIndex < 0) newIndex = testimonials.length - 1;
            showTestimonial(newIndex);
        });
        
        nextBtn.addEventListener('click', function() {
            let newIndex = currentIndex + 1;
            if (newIndex >= testimonials.length) newIndex = 0;
            showTestimonial(newIndex);
        });
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                showTestimonial(index);
            });
        });
        
        // Auto rotate testimonials
        setInterval(function() {
            let newIndex = currentIndex + 1;
            if (newIndex >= testimonials.length) newIndex = 0;
            showTestimonial(newIndex);
        }, 5000);
    }
    
    // Scroll Animation for Sections
    const sections = document.querySelectorAll('section');
    
    function checkSections() {
        const triggerBottom = window.innerHeight * 0.8;
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            
            if (sectionTop < triggerBottom) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
                
                // Trigger counter animation if this is the Why Us section
                if (section.id === 'why-us') {
                    animateCounters();
                }
            }
        });
    }
    
    // Set initial styles for sections
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Initial check and add scroll event
    checkSections();
    window.addEventListener('scroll', checkSections);
    
    // Waterfall Canvas Background
    const canvas = document.getElementById('waterfall-canvas');
    
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        // Set up the canvas
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Particle class for waterfall effect
        class Particle {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * -canvas.height - 50;
                this.size = Math.random() * 2.5 + 0.5; // More varied size
                this.speed = Math.random() * 2 + 1.5; // Slightly faster overall for smoother appearance
                this.opacity = Math.random() * 0.5 + 0.3; // Slightly higher minimum opacity
                
                // Smoother Green color spectrum with better distribution
                const greenValue = Math.floor(Math.random() * 80 + 175); // 175-255 range for green
                const blueValue = Math.floor(Math.random() * 40 + 110);  // 110-150 range for blue
                this.color = `rgba(16, ${greenValue}, ${blueValue}, ${this.opacity})`;
                
                // Add slight horizontal movement for more natural flow
                this.wobble = Math.random() * 1 - 0.5;
            }
            
            update() {
                this.y += this.speed;
                this.x += this.wobble;
                
                // Reset particle when it goes off screen
                if (this.y > canvas.height) {
                    this.reset();
                }
                
                // Reset if particle moves too far left/right
                if (this.x < -50 || this.x > canvas.width + 50) {
                    this.reset();
                }
                
                this.draw();
            }
            
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Create particles
        const particles = [];
        const particleCount = Math.floor((canvas.width * canvas.height) / 8000);
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        // Animation loop for waterfall effect
        let lastTime = 0;
        const fps = 60;
        const frameTime = 1000 / fps;
        
        function animate(timestamp = 0) {
            // Calculate time elapsed and only render if enough time has passed
            // This helps maintain consistent animation speed regardless of device performance
            const elapsed = timestamp - lastTime;
            
            if (elapsed > frameTime) {
                lastTime = timestamp - (elapsed % frameTime);
                
                // Create gradient background
                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, '#10B981'); // Emerald (primary-color)
                gradient.addColorStop(1, '#059669'); // Emerald dark (primary-dark)
                
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Update particles
                particles.forEach(particle => {
                    particle.update();
                });
                
                // Add some flowing lines
                drawFlowingLines();
            }
            
            requestAnimationFrame(animate);
        }
        
        // Draw flowing lines for additional waterfall effect
        function drawFlowingLines() {
            const lineCount = Math.floor(canvas.width / 50);
            
            for (let i = 0; i < lineCount; i++) {
                const x = i * 50 + Math.sin(Date.now() * 0.0005 + i) * 20;
                
                ctx.beginPath();
                ctx.moveTo(x, 0);
                
                // Use more points for smoother curves
                for (let y = 0; y < canvas.height; y += 10) {
                    // Create a wavy line using sine function with slower animation
                    const offsetX = Math.sin((Date.now() * 0.0003) + (y * 0.008) + i) * 20;
                    ctx.lineTo(x + offsetX, y);
                }
                
                // Smoother lines with slightly more opacity
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        }
        
        // Start the animation
        animate();
    }
    
    // Contact Form Submission
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const company = document.getElementById('company').value;
            const message = document.getElementById('message').value;
            
            // Here you would normally send the data to a server
            // For this example, we'll just show a success message
            
            // Clear the form
            contactForm.reset();
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
        });
    }
});
