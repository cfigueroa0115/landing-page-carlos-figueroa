import {
  Directive,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../services/theme.service';

/**
 * TypewriterDirective creates a cycling typewriter animation effect.
 *
 * It types characters sequentially from a list of titles, pauses on each
 * completed title, clears it, then types the next title in sequence.
 * After the last title, it cycles back to the first.
 *
 * Respects prefers-reduced-motion: shows the first title statically.
 * SSR-safe: only animates in the browser environment.
 */
@Directive({ standalone: true, selector: '[appTypewriter]' })
export class TypewriterDirective implements OnInit, OnDestroy {
  @Input() titles: string[] = [];
  @Input() typingSpeed: number = 80;
  @Input() pauseDuration: number = 2000;

  /** The current text being displayed (exposed for template binding). */
  currentText = signal<string>('');

  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly themeService = inject(ThemeService);

  private currentTitleIndex = 0;
  private currentCharIndex = 0;
  private isDeleting = false;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.titles || this.titles.length === 0) {
      return;
    }

    // Respect reduced-motion preference: show first title statically
    if (this.themeService.prefersReducedMotion()) {
      this.currentText.set(this.titles[0]);
      this.el.nativeElement.textContent = this.titles[0];
      return;
    }

    this.tick();
  }

  ngOnDestroy(): void {
    this.clearTimeout();
  }

  private tick(): void {
    const currentTitle = this.titles[this.currentTitleIndex];

    if (this.isDeleting) {
      // Remove characters one by one
      this.currentCharIndex--;
      const text = currentTitle.substring(0, this.currentCharIndex);
      this.currentText.set(text);
      this.el.nativeElement.textContent = text;

      if (this.currentCharIndex === 0) {
        // Done deleting, move to next title
        this.isDeleting = false;
        this.currentTitleIndex = (this.currentTitleIndex + 1) % this.titles.length;
        this.timeoutId = setTimeout(() => this.tick(), this.typingSpeed);
      } else {
        this.timeoutId = setTimeout(() => this.tick(), this.typingSpeed / 2);
      }
    } else {
      // Type characters one by one
      this.currentCharIndex++;
      const text = currentTitle.substring(0, this.currentCharIndex);
      this.currentText.set(text);
      this.el.nativeElement.textContent = text;

      if (this.currentCharIndex === currentTitle.length) {
        // Title complete — pause, then start deleting
        this.timeoutId = setTimeout(() => {
          this.isDeleting = true;
          this.tick();
        }, this.pauseDuration);
      } else {
        this.timeoutId = setTimeout(() => this.tick(), this.typingSpeed);
      }
    }
  }

  private clearTimeout(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
