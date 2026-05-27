import { Injectable, inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private sessionId = '';
  private startTime = 0;
  private maxScrollDepth = 0;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.sessionId = this.getOrCreateSessionId();
      this.startTime = Date.now();
      this.trackPageView();
      this.initGlobalClickTracking();
      this.initScrollDepthTracking();
      this.initExitTracking();
      this.initExternalLinkTracking();
    }
  }

  // === Public tracking methods ===

  trackPageView(): void {
    this.track('page_view', {
      url: window.location.pathname,
      screen_width: String(window.innerWidth),
      screen_height: String(window.innerHeight),
      user_agent_short: this.getDeviceType(),
    });
  }

  trackClick(element: string): void {
    this.track('click', { element });
  }

  trackSectionView(section: string): void {
    this.track('section_view', { section });
  }

  trackDownloadCV(): void {
    this.track('download_cv', { file: 'cv-carlos-figueroa.pdf' });
  }

  trackContactFormOpen(): void {
    this.track('contact_form_open', {});
  }

  trackContactFormSubmit(): void {
    this.track('contact_form_submit', {});
  }

  trackWhatsAppClick(): void {
    this.track('click', { element: 'whatsapp_button' });
  }

  trackLinkedInClick(): void {
    this.track('click', { element: 'linkedin_button' });
  }

  trackEmailClick(): void {
    this.track('click', { element: 'email_button' });
  }

  // === Automatic global tracking ===

  private initGlobalClickTracking(): void {
    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const clickable = target.closest('a, button, [role="button"]') as HTMLElement;

        if (clickable) {
          const label = this.getClickLabel(clickable);
          if (label) {
            this.track('click', { element: label });
          }
        }
      }, { passive: true });
    });
  }

  private initScrollDepthTracking(): void {
    this.ngZone.runOutsideAngular(() => {
      let lastTracked = 0;

      window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const depth = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

        if (depth > this.maxScrollDepth) {
          this.maxScrollDepth = depth;
        }

        // Track at 25%, 50%, 75%, 100% milestones
        const milestones = [25, 50, 75, 100];
        for (const milestone of milestones) {
          if (depth >= milestone && lastTracked < milestone) {
            lastTracked = milestone;
            this.track('scroll_depth', { depth: String(milestone) });
          }
        }
      }, { passive: true });
    });
  }

  private initExitTracking(): void {
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((Date.now() - this.startTime) / 1000);
        // Use sendBeacon for reliable exit tracking
        const payload = JSON.stringify({
          event_type: 'session_end',
          event_data: {
            time_spent_seconds: String(timeSpent),
            max_scroll_depth: String(this.maxScrollDepth),
          },
          page_url: window.location.href,
          referrer: document.referrer || '',
          session_id: this.sessionId,
        });
        navigator.sendBeacon('/api/track', payload);
      });
    });
  }

  private initExternalLinkTracking(): void {
    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('click', (event) => {
        const link = (event.target as HTMLElement).closest('a[href]') as HTMLAnchorElement;
        if (link && link.hostname !== window.location.hostname) {
          this.track('external_link', {
            url: link.href,
            text: link.textContent?.trim().substring(0, 50) || '',
          });
        }
      }, { passive: true });
    });
  }

  // === Helpers ===

  private track(eventType: string, eventData: Record<string, string>): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const payload = {
      event_type: eventType,
      event_data: eventData,
      page_url: window.location.href,
      referrer: document.referrer || '',
      session_id: this.sessionId,
    };

    this.http.post('/api/track', payload).subscribe({ error: () => {} });
  }

  private getClickLabel(el: HTMLElement): string {
    // Skip admin panel clicks
    if (el.closest('.admin-panel, .admin-overlay, .admin-trigger')) return '';

    // Try aria-label first
    const ariaLabel = el.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel.substring(0, 60);

    // Try text content
    const text = el.textContent?.trim();
    if (text && text.length < 60) return text;

    // Try class name
    const cls = el.className;
    if (typeof cls === 'string' && cls) return cls.split(' ')[0].substring(0, 40);

    return '';
  }

  private getDeviceType(): string {
    const w = window.innerWidth;
    if (w < 768) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
  }

  private getOrCreateSessionId(): string {
    const key = 'cf_session_id';
    let id = sessionStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage.setItem(key, id);
    }
    return id;
  }
}
