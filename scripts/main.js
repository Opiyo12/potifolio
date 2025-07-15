import { 
  SkillsRenderer, 
  Navigation, 
  ThemeManager, 
  ContactForm, 
  ScrollAnimations 
} from './components.js';

// Performance optimization: Defer non-critical initializations
class PortfolioApp {
  constructor() {
    this.components = new Map();
    this.init();
  }

  init() {
    // Critical components - initialize immediately
    this.initCriticalComponents();
    
    // Non-critical components - initialize after page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initNonCriticalComponents());
    } else {
      this.initNonCriticalComponents();
    }

    // Setup error handling
    this.setupErrorHandling();
  }

  initCriticalComponents() {
    try {
      // Navigation is critical for UX
      this.components.set('navigation', new Navigation());
      
      // Theme should be applied immediately to prevent flash
      this.components.set('theme', new ThemeManager());
    } catch (error) {
      console.error('Failed to initialize critical components:', error);
    }
  }

  initNonCriticalComponents() {
    try {
      // Skills rendering
      const skillsRenderer = new SkillsRenderer('skills-container');
      skillsRenderer.render();
      this.components.set('skills', skillsRenderer);

      // Contact form
      this.components.set('contactForm', new ContactForm('contact-form'));

      // Scroll animations
      this.components.set('scrollAnimations', new ScrollAnimations());

      // Additional features
      this.initAdditionalFeatures();
    } catch (error) {
      console.error('Failed to initialize non-critical components:', error);
    }
  }

  initAdditionalFeatures() {
    // Keyboard navigation support
    this.setupKeyboardNavigation();
    
    // Performance monitoring
    this.setupPerformanceMonitoring();
    
    // Analytics (if needed)
    this.setupAnalytics();
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // ESC key closes mobile menu
      if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu?.classList.contains('open')) {
          this.components.get('navigation')?.closeMobileMenuHandler();
        }
      }
    });
  }

  setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      // This would integrate with a real performance monitoring service
      console.log('Performance monitoring initialized');
    }

    // Log performance metrics
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
    });
  }

  setupAnalytics() {
    // Placeholder for analytics integration
    // This would integrate with Google Analytics, Mixpanel, etc.
    console.log('Analytics ready');
  }

  setupErrorHandling() {
    window.addEventListener('error', (e) => {
      console.error('Global error:', e.error);
      // In production, this would send errors to a logging service
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      // In production, this would send errors to a logging service
    });
  }

  // Public API for external integrations
  getComponent(name) {
    return this.components.get(name);
  }

  // Cleanup method for SPA navigation
  destroy() {
    this.components.forEach(component => {
      if (typeof component.destroy === 'function') {
        component.destroy();
      }
    });
    this.components.clear();
  }
}

// Initialize the application
const app = new PortfolioApp();

// Make app available globally for debugging
if (typeof window !== 'undefined') {
  window.portfolioApp = app;
}

// Export for module systems
export default PortfolioApp;