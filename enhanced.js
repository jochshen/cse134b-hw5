// Add this to a new file called enhanced.js

document.addEventListener('DOMContentLoaded', function() {
    // Animate skill bars on scroll
    const skillSection = document.getElementById('skills');
    const skillBars = document.querySelectorAll('.skill-progress');
    
    if (skillSection && skillBars.length) {
      // Initially set width to 0
      skillBars.forEach(bar => {
        bar.style.width = '0';
      });
      
      // Animate when scrolled into view
      const animateSkills = () => {
        const sectionTop = skillSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
          skillBars.forEach(bar => {
            // Get the width from the style attribute
            const targetWidth = bar.parentElement.parentElement.getAttribute('data-skill-level') || 
                               bar.getAttribute('style').match(/width:\s*(\d+)%/) && 
                               bar.getAttribute('style').match(/width:\s*(\d+)%/)[1] + '%';
            
            // Animate to the target width
            setTimeout(() => {
              bar.style.width = targetWidth;
            }, 100);
          });
          
          // Remove the scroll listener once animation is triggered
          window.removeEventListener('scroll', animateSkills);
        }
      };
      
      window.addEventListener('scroll', animateSkills);
      // Check on initial load as well
      animateSkills();
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Only process internal links
        if (this.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 80, // Offset for header
              behavior: 'smooth'
            });
          }
        }
      });
    });
    
    // Back to top button
    const createBackToTopButton = () => {
      const button = document.createElement('button');
      button.id = 'back-to-top';
      button.innerHTML = '↑';
      button.setAttribute('aria-label', 'Back to top');
      button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: var(--primary-color);
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s, transform 0.3s;
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      document.body.appendChild(button);
      
      button.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
      
      // Show/hide based on scroll position
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          button.style.opacity = '1';
          button.style.transform = 'translateY(0)';
        } else {
          button.style.opacity = '0';
          button.style.transform = 'translateY(20px)';
        }
      });
    };
    
    createBackToTopButton();
    
    // Project card animations
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      const technologies = card.querySelectorAll('.project-tech span');
      
      // Add staggered animation to technology tags
      technologies.forEach((tech, index) => {
        tech.style.transition = `opacity 0.3s ${index * 0.1}s, transform 0.3s ${index * 0.1}s`;
        tech.style.opacity = '0';
        tech.style.transform = 'translateY(10px)';
      });
      
      card.addEventListener('mouseenter', () => {
        technologies.forEach(tech => {
          tech.style.opacity = '1';
          tech.style.transform = 'translateY(0)';
        });
      });
      
      card.addEventListener('mouseleave', () => {
        technologies.forEach(tech => {
          tech.style.opacity = '0';
          tech.style.transform = 'translateY(10px)';
        });
      });
    });
    
    // Intersection Observer for reveal animations
    const observeElements = document.querySelectorAll('section, .project-card');
    
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-animated');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    observeElements.forEach(element => {
      element.classList.add('reveal');
      observer.observe(element);
    });
    
    // Custom CSS for reveal animations
    const style = document.createElement('style');
    style.textContent = `
      .reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s, transform 0.8s;
      }
      
      .reveal-animated {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
  });