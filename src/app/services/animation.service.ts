import { ElementRef, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ThemeService } from './theme.service';

/**
 * Configuration for scroll-triggered animations via Intersection Observer.
 */
export interface ScrollAnimationConfig {
  /** Intersection ratio threshold (0.0 - 1.0) to trigger the animation. */
  threshold: number;
  /** Type of animation to apply when the element enters the viewport. */
  animationType: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'countUp';
  /** Duration of the animation in seconds. */
  duration: number;
  /** Stagger delay in seconds between child elements (for fadeIn). */
  staggerDelay?: number;
  /** Whether the animation should trigger only once. */
  once: boolean;
}

/**
 * AnimationService manages GSAP animations and Intersection Observer triggers.
 *
 * - Provides reusable animation methods (fadeInStagger, countUp, initScrollTrigger).
 * - Respects the user's `prefers-reduced-motion` OS preference via ThemeService.
 * - SSR-safe: all browser/DOM APIs are guarded with isPlatformBrowser checks.
 * - Exposes a cleanup() method to kill all active GSAP tweens.
 */
@Injectable({ providedIn: 'root' })
export class AnimationService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly themeService = inject(ThemeService);

  /** Local mirror of the reduced-motion preference for quick access. */
  readonly prefersReducedMotion = signal<boolean>(false);

  /** Active Intersection Observers for cleanup. */
  private observers: IntersectionObserver[] = [];

  /** Active GSAP tweens/timelines for cleanup. */
  private tweens: (gsap.core.Tween | gsap.core.Timeline)[] = [];

  constructor() {
    // Sync with ThemeService's reduced-motion signal
    this.prefersReducedMotion.set(this.themeService.prefersReducedMotion());
  }

  /**
   * Applies a staggered fade-in animation to a list of elements.
   * Elements start invisible (opacity 0, translateY 30px) and animate to their final state.
   *
   * @param elements - Array of HTMLElements to animate
   * @param staggerDelay - Delay in seconds between each element's animation start
   * @returns The GSAP Timeline instance (or an empty timeline if animations are skipped)
   */
  fadeInStagger(elements: HTMLElement[], staggerDelay: number = 0.15): gsap.core.Timeline {
    const tl = gsap.timeline();

    if (!isPlatformBrowser(this.platformId) || !elements.length) {
      return tl;
    }

    // If reduced motion is preferred, show elements immediately without animation
    if (this.themeService.prefersReducedMotion()) {
      elements.forEach((el) => {
        gsap.set(el, { opacity: 1, y: 0 });
      });
      return tl;
    }

    // Set initial state
    gsap.set(elements, { opacity: 0, y: 30 });

    // Animate with stagger
    tl.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: staggerDelay,
      ease: 'power2.out',
    });

    this.tweens.push(tl);
    return tl;
  }

  /**
   * Animates a number counting up from 0 to the target value.
   * Uses GSAP to tween an object property and updates the element's text content.
   *
   * @param element - The HTMLElement whose textContent will be updated
   * @param target - The target number to count up to
   * @param duration - Duration of the count-up animation in seconds
   */
  countUp(element: HTMLElement, target: number, duration: number = 2): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // If reduced motion is preferred, show final value immediately
    if (this.themeService.prefersReducedMotion()) {
      element.textContent = String(target);
      return;
    }

    const counter = { value: 0 };

    const tween = gsap.to(counter, {
      value: target,
      duration,
      ease: 'power1.out',
      onUpdate: () => {
        element.textContent = String(Math.round(counter.value));
      },
      onComplete: () => {
        // Ensure exact target value on completion
        element.textContent = String(target);
      },
    });

    this.tweens.push(tween);
  }

  /**
   * Initializes a scroll-triggered animation using Intersection Observer.
   * When the element enters the viewport at the configured threshold,
   * the specified animation type is applied.
   *
   * @param element - Angular ElementRef of the element to observe
   * @param config - ScrollAnimationConfig with threshold, animation type, duration, etc.
   */
  initScrollTrigger(element: ElementRef, config: ScrollAnimationConfig): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const nativeEl: HTMLElement = element.nativeElement;

    // If reduced motion is preferred, show element in final state immediately
    if (this.themeService.prefersReducedMotion()) {
      gsap.set(nativeEl, { opacity: 1, x: 0, y: 0 });
      return;
    }

    // Set initial hidden state based on animation type
    this.setInitialState(nativeEl, config.animationType);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.applyAnimation(nativeEl, config);

            if (config.once) {
              observer.unobserve(nativeEl);
            }
          }
        });
      },
      { threshold: config.threshold }
    );

    observer.observe(nativeEl);
    this.observers.push(observer);
  }

  /**
   * Cleans up all active GSAP tweens/timelines and disconnects all Intersection Observers.
   * Should be called when the consuming component is destroyed.
   */
  cleanup(): void {
    // Kill all tracked GSAP tweens and timelines
    this.tweens.forEach((tween) => {
      tween.kill();
    });
    this.tweens = [];

    // Disconnect all Intersection Observers
    this.observers.forEach((observer) => {
      observer.disconnect();
    });
    this.observers = [];
  }

  /**
   * Sets the initial hidden state of an element based on the animation type.
   */
  private setInitialState(
    element: HTMLElement,
    animationType: ScrollAnimationConfig['animationType']
  ): void {
    switch (animationType) {
      case 'fadeIn':
        gsap.set(element, { opacity: 0 });
        break;
      case 'slideUp':
        gsap.set(element, { opacity: 0, y: 50 });
        break;
      case 'slideLeft':
        gsap.set(element, { opacity: 0, x: 50 });
        break;
      case 'slideRight':
        gsap.set(element, { opacity: 0, x: -50 });
        break;
      case 'countUp':
        // countUp doesn't need initial transform state — handled by countUp() method
        gsap.set(element, { opacity: 0 });
        break;
    }
  }

  /**
   * Applies the configured animation to the element.
   */
  private applyAnimation(element: HTMLElement, config: ScrollAnimationConfig): void {
    let tween: gsap.core.Tween;

    switch (config.animationType) {
      case 'fadeIn':
        tween = gsap.to(element, {
          opacity: 1,
          duration: config.duration,
          ease: 'power2.out',
        });
        break;
      case 'slideUp':
        tween = gsap.to(element, {
          opacity: 1,
          y: 0,
          duration: config.duration,
          ease: 'power2.out',
        });
        break;
      case 'slideLeft':
        tween = gsap.to(element, {
          opacity: 1,
          x: 0,
          duration: config.duration,
          ease: 'power2.out',
        });
        break;
      case 'slideRight':
        tween = gsap.to(element, {
          opacity: 1,
          x: 0,
          duration: config.duration,
          ease: 'power2.out',
        });
        break;
      case 'countUp':
        tween = gsap.to(element, {
          opacity: 1,
          duration: config.duration,
          ease: 'power2.out',
        });
        break;
      default:
        return;
    }

    this.tweens.push(tween);
  }
}
