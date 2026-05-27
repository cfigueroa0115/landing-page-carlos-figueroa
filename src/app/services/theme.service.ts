import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * ThemeService manages accessibility preferences and font loading state.
 *
 * - Detects `prefers-reduced-motion` media query and exposes it as a signal.
 * - Monitors Google Fonts loading via the document.fonts API with a 3-second timeout fallback.
 * - SSR-safe: all browser APIs are guarded with isPlatformBrowser checks.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);

  /** Whether the user prefers reduced motion (OS-level setting). */
  readonly prefersReducedMotion = signal<boolean>(false);

  /** Whether custom fonts (Google Fonts) have finished loading. */
  readonly fontsLoaded = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.detectMotionPreference();
      this.monitorFontLoading();
    }
  }

  /**
   * Detects the current `prefers-reduced-motion` preference and listens
   * for changes (e.g. user toggles the setting while the page is open).
   */
  detectMotionPreference(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion.set(mediaQuery.matches);

    mediaQuery.addEventListener('change', (event: MediaQueryListEvent) => {
      this.prefersReducedMotion.set(event.matches);
    });
  }

  /**
   * Monitors font loading using the document.fonts API.
   * Sets `fontsLoaded` to true when fonts are ready, or after a 3-second
   * timeout (whichever comes first) to prevent blocking page display.
   */
  monitorFontLoading(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const FONT_TIMEOUT_MS = 3000;

    const fontReadyPromise = document.fonts.ready.then(() => true);
    const timeoutPromise = new Promise<boolean>((resolve) =>
      setTimeout(() => resolve(true), FONT_TIMEOUT_MS)
    );

    Promise.race([fontReadyPromise, timeoutPromise]).then(() => {
      this.fontsLoaded.set(true);
    });
  }
}
