import { Component, signal, inject } from '@angular/core';
import { IntersectionObserverDirective } from '../../directives/intersection-observer.directive';
import { AnalyticsService } from '../../services/analytics.service';

interface RecognitionItem {
  title: string;
  description: string;
  tags: string;
  icon: string;
}

@Component({
  standalone: true,
  selector: 'app-recognition-section',
  imports: [IntersectionObserverDirective],
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
      <!-- Subtle radial glow -->
      <div class="recognition-glow" aria-hidden="true"></div>

      <div class="container">
        <div class="recognition-header">
          <span class="recognition-eyebrow">INNOVACIÓN APLICADA</span>
          <h2 id="recognition-heading" class="recognition-title">Reconocimientos que validan la capacidad de transformar</h2>
        </div>

        <div class="recognition-grid">
          @for (item of recognitions; track item.title) {
            <article class="recognition-card">
              <div class="recognition-card__icon" [innerHTML]="item.icon"></div>
              <h3 class="recognition-card__title">{{ item.title }}</h3>
              <p class="recognition-card__description">{{ item.description }}</p>
              <p class="recognition-card__tags">{{ item.tags }}</p>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    @use 'styles/tokens' as *;

    .recognition-section {
      position: relative;
      background: $color-navy-900;
      overflow: hidden;
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 450ms $anim-easing, transform 450ms $anim-easing;

      &.is-visible {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .recognition-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba($color-gold-500, 0.06) 0%, transparent 70%);
      pointer-events: none;
    }

    .recognition-header {
      text-align: center;
      margin-bottom: $space-8;
      position: relative;
    }

    .recognition-eyebrow {
      font-family: $font-body;
      font-size: 0.75rem;
      font-weight: $font-weight-emphasis;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: $color-gold-500;
      margin-bottom: $space-3;
      display: block;
    }

    .recognition-title {
      font-family: $font-heading;
      font-size: $font-size-h2;
      font-weight: $font-weight-heading;
      line-height: 1.2;
      color: #FFFFFF;
      margin: 0;
    }

    .recognition-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $space-6;
      max-width: 860px;
      margin: 0 auto;
      position: relative;

      @media (max-width: $bp-tablet) {
        grid-template-columns: 1fr;
        gap: $space-5;
      }
    }

    .recognition-card {
      background: rgba($color-navy-800, 0.6);
      border: 1px solid rgba($color-gold-500, 0.2);
      border-radius: 16px;
      padding: $space-6;
      display: flex;
      flex-direction: column;
      gap: $space-3;
      transition: transform $anim-duration-fast $anim-easing,
                  box-shadow $anim-duration-fast $anim-easing;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba($color-gold-500, 0.1);
      }

      &__icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: rgba($color-gold-500, 0.1);
        color: $color-gold-500;

        svg {
          width: 22px;
          height: 22px;
        }
      }

      &__title {
        font-family: $font-heading;
        font-weight: $font-weight-heading;
        font-size: 1.25rem;
        color: #FFFFFF;
        margin: 0;
      }

      &__description {
        font-family: $font-body;
        font-size: 0.9375rem;
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.6;
        margin: 0;
      }

      &__tags {
        font-family: $font-body;
        font-size: 0.8125rem;
        font-weight: 500;
        color: $color-cyan-500;
        margin: 0;
        margin-top: auto;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .recognition-section {
        opacity: 1;
        transform: none;
        transition: none;
      }
    }
  `],
})
export class RecognitionSectionComponent {
  private readonly analytics = inject(AnalyticsService);
  isVisible = signal<boolean>(false);

  readonly recognitions: RecognitionItem[] = [
    {
      title: 'Duplicados Cero',
      description: 'Reconocimiento por el diseño de una solución basada en inteligencia artificial y automatización para evitar la carga repetida de documentos en procesos aseguradores.',
      tags: 'IA aplicada · Automatización · Eficiencia operativa',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
    },
    {
      title: 'Hackathon Kiro AWS',
      description: 'Reconocimiento por la integración de inteligencia artificial, tecnologías cloud y resolución ágil de problemas empresariales complejos.',
      tags: 'AWS · Kiro · IA · Innovación',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
    },
  ];

  onVisibilityChange(visible: boolean): void {
    if (visible) {
      this.isVisible.set(true);
      this.analytics.trackSectionView('recognition');
    }
  }
}
