document.addEventListener('DOMContentLoaded', function() {
  // Debug script loading
  console.log('DOM fully loaded');
  console.log('Scripts loaded:', Array.from(document.scripts).map(s => s.src));

  // Enhanced AOS initialization with error handling
  if (typeof AOS === 'undefined') {
    console.error('AOS not loaded! Critical Error!');
    console.error('1. Verify AOS script is loaded before this file');
    console.error('2. Check network tab for failed requests to unpkg.com');
    console.error('3. Disable ad blockers that might block CDN resources');
  } else {
    console.log('AOS successfully loaded, version:', AOS.version);
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      disable: window.innerWidth < 768 // Disable on mobile if needed
    });
    
    // Refresh AOS when all images are loaded
    window.addEventListener('load', function() {
      if (AOS) {
        AOS.refreshHard(); // Force reinitialization
        console.log('AOS refreshed after page load');
      }
    });
  }

  // Header scroll effect
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Mobile menu toggle with animation
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links li');
  
  if (hamburger && navLinks) {
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

  // Enhanced smooth scrolling with offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const offset = 80; // Same as your header height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (navLinks && navLinks.classList.contains('active')) {
          hamburger.classList.remove('active');
          navLinks.classList.remove('active');
          navItems.forEach(item => {
            item.style.animation = '';
          });
        }
      }
    });
  });

  // Particles animation with performance optimization
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let particles = [];
    const particleCount = Math.floor(window.innerWidth / 10); // Dynamic count

    // Handle resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
      }, 200);
    });

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.1})`;
      }

      update(mouse) {
        // Mouse interaction
        if (mouse.x && mouse.y) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 100;
          
          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            this.x -= dx * force * 0.1;
            this.y -= dy * force * 0.1;
          }
        }

        // Boundary check with bounce
        if (this.x > width || this.x < 0) this.speedX *= -1;
        if (this.y > height || this.y < 0) this.speedY *= -1;

        // Movement
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

    // Mouse tracking
    const mouse = { x: null, y: null };
    window.addEventListener('mousemove', function(event) {
      mouse.x = event.x;
      mouse.y = event.y;
    });

    // Initialize particles
    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    // Animation loop with optimized performance
    function animate() {
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update(mouse);
        particle.draw();
      });

      // Connect particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - distance/500})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    }

    initParticles();
    animate();
  }

  // Process section animation with intersection observer
  const processItems = document.querySelectorAll('.process-item');
  if (processItems.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    processItems.forEach(item => {
      observer.observe(item);
    });
  }

  // Testimonial slider with improved touch support
  const testimonialTrack = document.querySelector('.testimonial-track');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  
  if (testimonialTrack && testimonialCards.length > 0) {
    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    let autoSlideInterval;

    // Touch event handlers for mobile
    testimonialTrack.addEventListener('touchstart', touchStart);
    testimonialTrack.addEventListener('touchend', touchEnd);
    testimonialTrack.addEventListener('touchmove', touchMove);

    function touchStart(e) {
      startPos = e.touches[0].clientX;
      isDragging = true;
      clearInterval(autoSlideInterval);
      cancelAnimationFrame(animationID);
    }

    function touchEnd() {
      isDragging = false;
      const movedBy = currentTranslate - prevTranslate;
      
      if (movedBy < -100 && currentIndex < testimonialCards.length - 1) {
        currentIndex += 1;
      }
      
      if (movedBy > 100 && currentIndex > 0) {
        currentIndex -= 1;
      }
      
      setPositionByIndex();
      startAutoSlide();
    }

    function touchMove(e) {
      if (isDragging) {
        const currentPosition = e.touches[0].clientX;
        currentTranslate = prevTranslate + currentPosition - startPos;
        testimonialTrack.style.transform = `translateX(${currentTranslate}px)`;
      }
    }

    function setPositionByIndex() {
      testimonialTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
      prevTranslate = -currentIndex * testimonialTrack.offsetWidth;
      currentTranslate = prevTranslate;
      
      // Update active states
      testimonialCards.forEach((card, index) => {
        card.classList.toggle('active', index === currentIndex);
      });
      
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    function startAutoSlide() {
      autoSlideInterval = setInterval(() => {
        currentIndex = (currentIndex === testimonialCards.length - 1) ? 0 : currentIndex + 1;
        setPositionByIndex();
      }, 5000);
    }

    // Initialize slider
    setPositionByIndex();
    startAutoSlide();

    // Button controls
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = Math.max(0, currentIndex - 1);
        setPositionByIndex();
        resetAutoSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = Math.min(testimonialCards.length - 1, currentIndex + 1);
        setPositionByIndex();
        resetAutoSlide();
      });
    }

    // Dot controls
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentIndex = index;
        setPositionByIndex();
        resetAutoSlide();
      });
    });

    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    }

    // Pause on hover
    testimonialTrack.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    testimonialTrack.addEventListener('mouseleave', startAutoSlide);
  }

  // Form submission with validation
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simple validation
      const name = this.querySelector('#name').value.trim();
      const email = this.querySelector('#email').value.trim();
      const message = this.querySelector('#message').value.trim();
      
      if (!name || !email || !message) {
        showFormMessage('Please fill all required fields', 'error');
        return;
      }
      
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        showFormMessage('Please enter a valid email', 'error');
        return;
      }
      
      // Form data processing
      const formData = new FormData(this);
      const formValues = Object.fromEntries(formData.entries());
      console.log('Form submission:', formValues);
      
      // Simulate successful submission
      showFormMessage('Thank you! Your message has been sent.', 'success');
      this.reset();
    });
    
    function showFormMessage(text, type) {
      // Remove existing messages
      const existing = document.querySelector('.form-message');
      if (existing) existing.remove();
      
      // Create new message
      const message = document.createElement('div');
      message.className = `form-message ${type}`;
      message.textContent = text;
      
      // Style based on type
      const styles = {
        padding: '1rem',
        margin: '1rem 0',
        borderRadius: '5px',
        color: type === 'error' ? '#721c24' : '#155724',
        backgroundColor: type === 'error' ? '#f8d7da' : '#d4edda',
        border: type === 'error' ? '1px solid #f5c6cb' : '1px solid #c3e6cb'
      };
      
      Object.assign(message.style, styles);
      
      // Insert before submit button
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      contactForm.insertBefore(message, submitBtn);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => message.remove(), 500);
      }, 5000);
    }
  }

  // Add animation styles dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes navItemFade {
      from { opacity: 0; transform: translateX(50px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // Final debug check
  console.log('All JavaScript initialized successfully');
});

// Fallback for browsers that don't support DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
