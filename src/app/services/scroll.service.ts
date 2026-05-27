import {
  Injectable,
  signal,
  PLATFORM_ID,
  inject,
  NgZone,
  DestroyRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  /** Scroll progress as a percentage (0-100) */
  scrollProgress = signal<number>(0);

  /** Current scroll position in pixels from top */
  scrollPosition = signal<number>(0);

  /** Currently active section based on scroll position */
  activeSection = signal<string>('hero');

  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private scrollListener: (() => void) | null = null;

  constructor() {
    if (this.isBrowser) {
      this.initScrollListener();
    }
  }

  /**
   * Smooth-scrolls to the section with the given ID.
   * Uses native scrollIntoView with smooth behavior (300-800ms range
   * is handled by the browser's smooth scroll implementation).
   */
  scrollToSection(sectionId: string): void {
    if (!this.isBrowser) {
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Calculates and updates scroll progress (0-100) based on
   * current scroll position relative to total scrollable height.
   */
  trackScrollProgress(): void {
    if (!this.isBrowser) {
      return;
    }

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;

    this.scrollPosition.set(scrollTop);
    this.scrollProgress.set(Math.round(progress));
  }

  /**
   * Determines which section is currently in view based on scroll position.
   * Iterates through known sections and finds the one whose top is closest
   * to (but not below) the current viewport top + offset.
   */
  private updateActiveSection(): void {
    const sections = [
      'hero',
      'profile',
      'achievements',
      'timeline',
      'skills',
      'education',
      'contact',
    ];

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const offset = window.innerHeight * 0.3; // 30% of viewport as threshold

    let currentSection = 'hero';

    for (const sectionId of sections) {
      const element = document.getElementById(sectionId);
      if (element) {
        const rect = element.getBoundingClientRect();
        const sectionTop = rect.top + scrollTop;

        if (scrollTop + offset >= sectionTop) {
          currentSection = sectionId;
        }
      }
    }

    this.activeSection.set(currentSection);
  }

  private initScrollListener(): void {
    this.ngZone.runOutsideAngular(() => {
      this.scrollListener = () => {
        this.trackScrollProgress();
        this.updateActiveSection();
      };

      window.addEventListener('scroll', this.scrollListener, { passive: true });
    });

    this.destroyRef.onDestroy(() => {
      if (this.scrollListener) {
        window.removeEventListener('scroll', this.scrollListener);
        this.scrollListener = null;
      }
    });
  }
}
