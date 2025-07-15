import { skillsData, animationConfig } from './data.js';

// Skills component renderer
export class SkillsRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = skillsData
      .map(skill => this.createSkillItem(skill))
      .join('');
  }

  createSkillItem(skill) {
    const backgroundClass = skill.needsBackground ? 'style="background: white; border-radius: 4px; padding: 2px;"' : '';
    
    return `
      <div class="skill-item animate-on-scroll">
        <img src="${skill.icon}" alt="${skill.name}" ${backgroundClass} />
        <span>${skill.name}</span>
      </div>
    `;
  }
}

// Navigation component
export class Navigation {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
    this.closeMobileMenu = document.getElementById('close-mobile-menu');
    this.navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');
    
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupActiveLinks();
    this.setupSmoothScroll();
  }

  setupMobileMenu() {
    this.mobileMenuBtn?.addEventListener('click', () => this.openMobileMenu());
    this.closeMobileMenu?.addEventListener('click', () => this.closeMobileMenuHandler());
    
    // Close menu when clicking on links
    this.navLinks.forEach(link => {
      if (link.classList.contains('nav-link-mobile')) {
        link.addEventListener('click', () => this.closeMobileMenuHandler());
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.mobileMenu?.classList.contains('open') && 
          !this.mobileMenu.contains(e.target) && 
          !this.mobileMenuBtn?.contains(e.target)) {
        this.closeMobileMenuHandler();
      }
    });
  }

  openMobileMenu() {
    this.mobileMenu?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeMobileMenuHandler() {
    this.mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
  }

  setupActiveLinks() {
    const sections = document.querySelectorAll('section[id]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.updateActiveLink(entry.target.id);
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-80px 0px -80px 0px'
    });

    sections.forEach(section => observer.observe(section));
  }

  updateActiveLink(activeSection) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${activeSection}`) {
        link.classList.add('active');
      }
    });
  }

  setupSmoothScroll() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// Theme manager
export class ThemeManager {
  constructor() {
    this.toggleBtn = document.getElementById('dark-toggle');
    this.storageKey = 'portfolio-theme';
    
    this.init();
  }

  init() {
    this.loadTheme();
    this.setupToggle();
  }

  loadTheme() {
    const savedTheme = localStorage.getItem(this.storageKey);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      this.enableDarkMode();
    }
  }

  setupToggle() {
    this.toggleBtn?.addEventListener('click', () => this.toggleTheme());
  }

  toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
      this.enableLightMode();
    } else {
      this.enableDarkMode();
    }
  }

  enableDarkMode() {
    document.documentElement.classList.add('dark');
    localStorage.setItem(this.storageKey, 'dark');
    this.updateToggleIcon('sun');
  }

  enableLightMode() {
    document.documentElement.classList.remove('dark');
    localStorage.setItem(this.storageKey, 'light');
    this.updateToggleIcon('moon');
  }

  updateToggleIcon(icon) {
    if (this.toggleBtn) {
      const iconElement = this.toggleBtn.querySelector('i');
      iconElement.className = `fas fa-${icon}`;
    }
  }
}

// Form handler
export class ContactForm {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.emailInput = document.getElementById('email');
    this.messageInput = document.getElementById('message');
    this.emailError = document.getElementById('email-error');
    this.messageError = document.getElementById('message-error');
    this.successMessage = document.getElementById('form-success');
    
    this.init();
  }

  init() {
    if (!this.form) return;
    
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.setupRealTimeValidation();
  }

  setupRealTimeValidation() {
    this.emailInput?.addEventListener('blur', () => this.validateEmail());
    this.messageInput?.addEventListener('blur', () => this.validateMessage());
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const isEmailValid = this.validateEmail();
    const isMessageValid = this.validateMessage();
    
    if (isEmailValid && isMessageValid) {
      this.showSuccess();
      this.form.reset();
    }
  }

  validateEmail() {
    const email = this.emailInput?.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || !emailPattern.test(email)) {
      this.showError(this.emailError);
      return false;
    }
    
    this.hideError(this.emailError);
    return true;
  }

  validateMessage() {
    const message = this.messageInput?.value.trim();
    
    if (!message || message.length < 10) {
      this.showError(this.messageError);
      return false;
    }
    
    this.hideError(this.messageError);
    return true;
  }

  showError(errorElement) {
    errorElement?.classList.add('show');
  }

  hideError(errorElement) {
    errorElement?.classList.remove('show');
  }

  showSuccess() {
    this.successMessage?.classList.add('show');
    
    setTimeout(() => {
      this.successMessage?.classList.remove('show');
    }, 5000);
  }
}

// Scroll animations
export class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll('.animate-on-scroll');
    this.init();
  }

  init() {
    this.setupObserver();
  }

  setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * animationConfig.staggerDelay);
        }
      });
    }, animationConfig.observerOptions);

    this.elements.forEach(element => observer.observe(element));
  }
}