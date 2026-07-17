import { Component, signal, inject, PLATFORM_ID, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IntersectionObserverDirective } from '../../directives/intersection-observer.directive';
import { AnalyticsService } from '../../services/analytics.service';
import { SectionBackgroundComponent } from '../section-background/section-background.component';

interface RecognitionItem {
  title: string;
  eyebrow: string;
  description: string;
  context: string;
  tags: string[];
  iconPaths: string;
  accentColor: 'cyan' | 'gold';
}

@Component({
  standalone: true,
  selector: 'app-recognition-section',
  imports: [IntersectionObserverDirective, SectionBackgroundComponent],
  template: `
    <section
      id="recognition"
      class="section recognition-section"
      appInView
      [threshold]="0.2"
      (inView)="onVisibilityChange($event)"
      [class.is-visible]="isVisible()"
      aria-labelledby="recognition-heading"
    >
      <app-section-background variant="innovation" [height]="700"></app-section-background>

      <div class="container">
        <div class="recognition-header">
          <span class="recognition-eyebrow">INNOVACIÓN APLICADA</span>
          <h2 id="recognition-heading" class="recognition-title">Reconocimientos que validan la capacidad de transformar</h2>
        </div>

        <div class="recognition-grid">
          @for (item of recognitions; track item.title; let i = $index) {
            <article
              class="recognition-card"
              [attr.data-accent]="item.accentColor"
              [style.--card-delay]="i * 1.8 + 's'"
              (mousemove)="onCardMouseMove($event, i)"
              (mouseleave)="onCardMouseLeave(i)"
            >
              <div class="recognition-card__glow" [style.--mouse-x]="cardMouseX[i]" [style.--mouse-y]="cardMouseY[i]" aria-hidden="true"></div>
              <div class="recognition-card__border-anim" aria-hidden="true"></div>

              <span class="recognition-card__eyebrow">{{ item.eyebrow }}</span>

              <div class="recognition-card__icon-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  @for (path of getIconPaths(item.iconPaths); track path) {
                    <path [attr.d]="path"/>
                  }
                </svg>
              </div>

              <h3 class="recognition-card__title">{{ item.title }}</h3>
              <p class="recognition-card__description">{{ item.description }}</p>
              <p class="recognition-card__context">{{ item.context }}</p>
              <div class="recognition-card__tags">
                @for (tag of item.tags; track tag) {
                  <span class="recognition-card__tag">{{ tag }}</span>
                }
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./recognition-section.component.scss'],
})
export class RecognitionSectionComponent implements AfterViewInit, OnDestroy {
  private readonly analytics = inject(AnalyticsService);
  private readonly platformId = inject(PLATFORM_ID);
  isVisible = signal<boolean>(false);

  cardMouseX: string[] = ['50%', '50%'];
  cardMouseY: string[] = ['50%', '50%'];

  readonly recognitions: RecognitionItem[] = [
    {
      title: 'Duplicados Cero',
      eyebrow: 'INNOVACIÓN APLICADA',
      description: 'Diseño de una solución basada en inteligencia artificial y automatización para detectar y evitar la carga repetida de documentos en procesos aseguradores de gran volumen.',
      context: 'Seguros Bolívar · Producto digital con IA aplicada',
      tags: ['IA aplicada', 'Automatización', 'Eficiencia operativa', 'AWS'],
      iconPaths: 'M16 4h2a2 2 0 0 1 2 2v2|M20 16v2a2 2 0 0 1-2 2h-2|M8 20H6a2 2 0 0 1-2-2v-2|M4 8V6a2 2 0 0 1 2-2h2|M9.5 7h5|M9.5 7v9|M13.5 7v9|M9.5 16h5',
      accentColor: 'cyan',
    },
    {
      title: 'Hackathon Kiro AWS',
      eyebrow: 'RECONOCIMIENTO DESTACADO',
      description: 'Reconocimiento por la integración de inteligencia artificial, tecnologías cloud y resolución ágil de problemas empresariales complejos en un entorno competitivo.',
      context: 'AWS · Innovación competitiva · Cloud & IA',
      tags: ['AWS', 'Kiro', 'IA', 'Innovación', 'Cloud'],
      iconPaths: 'M6 9H4.5a2.5 2.5 0 0 1 0-5H6|M18 9h1.5a2.5 2.5 0 0 0 0-5H18|M4 22h16|M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22|M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22|M18 2H6v7a6 6 0 0 0 12 0V2Z',
      accentColor: 'gold',
    },
  ];

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {}

  onVisibilityChange(visible: boolean): void {
    if (visible) {
      this.isVisible.set(true);
      this.analytics.trackSectionView('recognition');
    }
  }

  onCardMouseMove(event: MouseEvent, index: number): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const card = (event.currentTarget as HTMLElement);
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    this.cardMouseX[index] = x + '%';
    this.cardMouseY[index] = y + '%';
  }

  onCardMouseLeave(index: number): void {
    this.cardMouseX[index] = '50%';
    this.cardMouseY[index] = '50%';
  }

  getIconPaths(pathString: string): string[] {
    return pathString.split('|');
  }
}
