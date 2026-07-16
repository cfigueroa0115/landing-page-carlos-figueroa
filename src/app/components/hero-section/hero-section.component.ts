import { Component, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ScrollService } from '../../services/scroll.service';
import { AnalyticsService } from '../../services/analytics.service';
import { HeroBgComponent } from '../hero-bg/hero-bg.component';

@Component({
  standalone: true,
  selector: 'app-hero-section',
  imports: [HeroBgComponent],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
})
export class HeroSectionComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly scrollService = inject(ScrollService);
  private readonly analytics = inject(AnalyticsService);

  downloadError = signal<string>('');

  downloadCV(): void {
    this.downloadError.set('');
    this.analytics.trackDownloadCV();

    if (!isPlatformBrowser(this.platformId)) return;

    const link = document.createElement('a');
    link.href = 'assets/documents/cv-carlos-figueroa.pdf';
    link.download = 'CV-Carlos-Figueroa.pdf';
    link.target = '_blank';

    fetch(link.href, { method: 'HEAD' })
      .then((response) => {
        if (response.ok) {
          link.click();
        } else {
          this.downloadError.set('El archivo no está disponible en este momento. Intente más tarde.');
        }
      })
      .catch(() => {
        this.downloadError.set('No se pudo descargar el archivo. Verifique su conexión e intente nuevamente.');
      });
  }

  scrollToTimeline(): void {
    this.scrollService.scrollToSection('timeline');
  }

  scrollToContact(): void {
    this.scrollService.scrollToSection('contact');
  }
}
