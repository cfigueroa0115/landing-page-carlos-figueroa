import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private sessionId = '';

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.sessionId = this.getOrCreateSessionId();
      this.trackPageView();
    }
  }

  trackPageView(): void {
    this.track('page_view', { url: window.location.pathname });
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

  private track(eventType: string, eventData: Record<string, string>): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const payload = {
      event_type: eventType,
      event_data: eventData,
      page_url: window.location.href,
      referrer: document.referrer || '',
      session_id: this.sessionId,
    };

    // Fire and forget — don't block UI
    this.http.post('/api/track', payload).subscribe({ error: () => {} });
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
