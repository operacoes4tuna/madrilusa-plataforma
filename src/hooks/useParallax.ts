import { useEffect } from 'react';

export const useParallax = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('[class*="parallax-"]');
      
      parallaxElements.forEach((element) => {
        const rate = scrolled * -0.5;
        const element_classes = element.className;
        
        if (element_classes.includes('parallax-slow')) {
          (element as HTMLElement).style.transform = `translate3d(0, ${rate * 0.5}px, 0)`;
        } else if (element_classes.includes('parallax-medium')) {
          (element as HTMLElement).style.transform = `translate3d(0, ${rate * 0.3}px, 0)`;
        } else if (element_classes.includes('parallax-fast')) {
          (element as HTMLElement).style.transform = `translate3d(0, ${rate * 0.8}px, 0)`;
        }
      });

      // Set CSS custom property for other parallax effects
      document.documentElement.style.setProperty('--scroll-y', `${scrolled}`);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};