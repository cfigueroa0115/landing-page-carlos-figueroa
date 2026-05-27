import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../services/theme.service';

/**
 * CountUpDirective animates a numeric count from 0 to a target value
 * when the host element enters the viewport.
 *
 * - Uses IntersectionObserver to detect viewport entry.
 * - Animates using requestAnimationFrame for smooth 60fps counting.
 * - Triggers only once per page load.
 * - Respects prefers-reduced-motion (shows final value immediately).
 * - SSR-safe: only animates in the browser.
 */
@Directive({ standalone: true, selector: '[appCountUp]' })
export class CountUpDirective implements AfterViewInit, OnDestroy {
  /** The target number to count up to. */
  @Input() targetValue: number = 0;

  /** Duration of the count-up animation in milliseconds. */
  @Input() duration: number = 2000;

  /** Intersection Observer threshold (0.0 - 1.0) to trigger animation. */
  @Input() threshold: number = 0.5;

  /** Optional suffix appended after the number (e.g. '%', '+'). */
  @Input() suffix: string = '';

  /** Current animated value exposed as a signal. */
  currentValue = signal<number>(0);

  /** Whether the animation has already been triggered. */
  hasTriggered = signal<boolean>(false);

  private observer: IntersectionObserver | null = null;
  private animationFrameId: number | null = null;

  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly themeService = inject(ThemeService);

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      // SSR: show final value immediately without animation
      this.currentValue.set(this.targetValue);
      this.updateTextContent();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasTriggered()) {
            this.hasTriggered.set(true);
            this.startCountUp();
            // Stop observing after triggering once
            if (this.observer) {
              this.observer.unobserve(this.el.nativeElement);
            }
          }
        });
      },
      { threshold: this.threshold }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Starts the count-up animation. If reduced motion is preferred,
   * sets the final value immediately without animation.
   */
  private startCountUp(): void {
    if (this.themeService.prefersReducedMotion()) {
      this.currentValue.set(this.targetValue);
      this.updateTextContent();
      return;
    }

    const startTime = performance.now();
    const startValue = 0;
    const endValue = this.targetValue;
    const duration = this.duration;

    const animate = (currentTime: number): void => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for a smooth deceleration effect
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const value = Math.round(startValue + (endValue - startValue) * easedProgress);
      this.currentValue.set(value);
      this.updateTextContent();

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        // Ensure we land exactly on the target value
        this.currentValue.set(endValue);
        this.updateTextContent();
        this.animationFrameId = null;
      }
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  /** Updates the host element's text content with the current value and suffix. */
  private updateTextContent(): void {
    this.el.nativeElement.textContent = `${this.currentValue()}${this.suffix}`;
  }
}
