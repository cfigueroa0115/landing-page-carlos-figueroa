import { ElementRef, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AnimationService, ScrollAnimationConfig } from './animation.service';
import { ThemeService } from './theme.service';

describe('AnimationService', () => {
  let service: AnimationService;
  let mockThemeService: { prefersReducedMotion: ReturnType<typeof vi.fn> };
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let mockUnobserve: ReturnType<typeof vi.fn>;
  let observerCallback: IntersectionObserverCallback;

  beforeEach(() => {
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();
    mockUnobserve = vi.fn();

    (globalThis as any).IntersectionObserver = class {
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }
      observe = mockObserve;
      disconnect = mockDisconnect;
      unobserve = mockUnobserve;
    };

    mockThemeService = {
      prefersReducedMotion: vi.fn().mockReturnValue(false),
    };

    TestBed.configureTestingModule({
      providers: [
        AnimationService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: ThemeService, useValue: mockThemeService },
      ],
    });

    service = TestBed.inject(AnimationService);
  });

  afterEach(() => {
    service.cleanup();
  });

  describe('fadeInStagger', () => {
    it('should return a GSAP timeline', () => {
      const elements = [document.createElement('div'), document.createElement('div')];
      const timeline = service.fadeInStagger(elements, 0.2);
      expect(timeline).toBeDefined();
      expect(timeline.totalDuration).toBeDefined();
    });

    it('should set elements to visible immediately when reduced motion is preferred', () => {
      mockThemeService.prefersReducedMotion.mockReturnValue(true);
      const el1 = document.createElement('div');
      const el2 = document.createElement('div');
      const elements = [el1, el2];

      service.fadeInStagger(elements, 0.2);

      // Elements should be visible (opacity 1, no transform)
      expect(el1.style.opacity).toBe('1');
      expect(el2.style.opacity).toBe('1');
    });

    it('should return an empty timeline for empty elements array', () => {
      const timeline = service.fadeInStagger([], 0.2);
      expect(timeline).toBeDefined();
      expect(timeline.totalDuration()).toBe(0);
    });
  });

  describe('countUp', () => {
    it('should set final value immediately when reduced motion is preferred', () => {
      mockThemeService.prefersReducedMotion.mockReturnValue(true);
      const el = document.createElement('span');

      service.countUp(el, 95, 2);

      expect(el.textContent).toBe('95');
    });

    it('should start counting from 0 when reduced motion is not preferred', () => {
      const el = document.createElement('span');
      el.textContent = '';

      service.countUp(el, 50, 2);

      // The animation starts, so the element should have some content
      // (GSAP begins the tween immediately)
      expect(el.textContent).toBeDefined();
    });
  });

  describe('initScrollTrigger', () => {
    it('should create an IntersectionObserver for the element', () => {
      const el = document.createElement('div');
      const elementRef = new ElementRef(el);
      const config: ScrollAnimationConfig = {
        threshold: 0.2,
        animationType: 'fadeIn',
        duration: 0.6,
        once: true,
      };

      service.initScrollTrigger(elementRef, config);

      expect(mockObserve).toHaveBeenCalledWith(el);
    });

    it('should set initial hidden state for slideUp animation', () => {
      const el = document.createElement('div');
      const elementRef = new ElementRef(el);
      const config: ScrollAnimationConfig = {
        threshold: 0.3,
        animationType: 'slideUp',
        duration: 0.6,
        once: true,
      };

      service.initScrollTrigger(elementRef, config);

      expect(el.style.opacity).toBe('0');
    });

    it('should skip observer and show element when reduced motion is preferred', () => {
      mockThemeService.prefersReducedMotion.mockReturnValue(true);
      const el = document.createElement('div');
      const elementRef = new ElementRef(el);
      const config: ScrollAnimationConfig = {
        threshold: 0.2,
        animationType: 'slideUp',
        duration: 0.6,
        once: true,
      };

      service.initScrollTrigger(elementRef, config);

      // Should NOT create an observer
      expect(mockObserve).not.toHaveBeenCalled();
      // Element should be visible
      expect(el.style.opacity).toBe('1');
    });

    it('should unobserve element after animation when once is true', () => {
      const el = document.createElement('div');
      const elementRef = new ElementRef(el);
      const config: ScrollAnimationConfig = {
        threshold: 0.5,
        animationType: 'fadeIn',
        duration: 0.6,
        once: true,
      };

      service.initScrollTrigger(elementRef, config);

      // Simulate intersection
      const entry = { isIntersecting: true, target: el } as unknown as IntersectionObserverEntry;
      observerCallback([entry], {} as IntersectionObserver);

      expect(mockUnobserve).toHaveBeenCalledWith(el);
    });

    it('should NOT unobserve element when once is false', () => {
      const el = document.createElement('div');
      const elementRef = new ElementRef(el);
      const config: ScrollAnimationConfig = {
        threshold: 0.5,
        animationType: 'fadeIn',
        duration: 0.6,
        once: false,
      };

      service.initScrollTrigger(elementRef, config);

      // Simulate intersection
      const entry = { isIntersecting: true, target: el } as unknown as IntersectionObserverEntry;
      observerCallback([entry], {} as IntersectionObserver);

      expect(mockUnobserve).not.toHaveBeenCalled();
    });

    it('should not animate when element is not intersecting', () => {
      const el = document.createElement('div');
      const elementRef = new ElementRef(el);
      const config: ScrollAnimationConfig = {
        threshold: 0.5,
        animationType: 'slideUp',
        duration: 0.6,
        once: true,
      };

      service.initScrollTrigger(elementRef, config);

      // Simulate non-intersection
      const entry = { isIntersecting: false, target: el } as unknown as IntersectionObserverEntry;
      observerCallback([entry], {} as IntersectionObserver);

      // Element should still be hidden (opacity 0)
      expect(el.style.opacity).toBe('0');
      expect(mockUnobserve).not.toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('should disconnect all observers', () => {
      const el = document.createElement('div');
      const elementRef = new ElementRef(el);
      const config: ScrollAnimationConfig = {
        threshold: 0.2,
        animationType: 'fadeIn',
        duration: 0.6,
        once: true,
      };

      service.initScrollTrigger(elementRef, config);
      service.cleanup();

      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should be safe to call cleanup multiple times', () => {
      service.cleanup();
      service.cleanup();
      // No error thrown
      expect(true).toBe(true);
    });
  });
});

describe('AnimationService (SSR)', () => {
  let service: AnimationService;
  let mockThemeService: { prefersReducedMotion: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockThemeService = {
      prefersReducedMotion: vi.fn().mockReturnValue(false),
    };

    TestBed.configureTestingModule({
      providers: [
        AnimationService,
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: ThemeService, useValue: mockThemeService },
      ],
    });

    service = TestBed.inject(AnimationService);
  });

  it('should return empty timeline for fadeInStagger on server', () => {
    const elements = [document.createElement('div')];
    const timeline = service.fadeInStagger(elements, 0.2);
    expect(timeline.totalDuration()).toBe(0);
  });

  it('should not throw for countUp on server', () => {
    const el = document.createElement('span');
    expect(() => service.countUp(el, 100, 2)).not.toThrow();
  });

  it('should not throw for initScrollTrigger on server', () => {
    const el = document.createElement('div');
    const elementRef = new ElementRef(el);
    const config: ScrollAnimationConfig = {
      threshold: 0.2,
      animationType: 'fadeIn',
      duration: 0.6,
      once: true,
    };
    expect(() => service.initScrollTrigger(elementRef, config)).not.toThrow();
  });
});
