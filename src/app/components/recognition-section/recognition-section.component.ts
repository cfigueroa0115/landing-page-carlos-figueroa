import { Component, signal, inject } from '@angular/core';
import { IntersectionObserverDirective } from '../../directives/intersection-observer.directive';
import { AnalyticsService } from '../../services/analytics.service';
import { SectionBackgroundComponent } from '../section-background/section-background.component';

interface RecognitionItem {
  title: string;
  description: string;
  context: string;
  tags: string;
  icon: string;
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
          @for (item of recognitions; track item.title) {
            <article class="recognition-card" [attr.data-accent]="item.accentColor">
              <div class="recognition-card__icon" [innerHTML]="item.icon"></div>
              <h3 class="recognition-card__title">{{ item.title }}</h3>
              <p class="recognition-card__description">{{ item.description }}</p>
              <p class="recognition-card__context">{{ item.context }}</p>
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
      position: relative;
      overflow: hidden;
      transition: transform $anim-duration-fast $anim-easing,
                  box-shadow $anim-duration-fast $anim-easing,
                  border-color $anim-duration-fast $anim-easing;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        border: 1px solid transparent;
        background: linear-gradient(135deg, rgba($color-gold-500, 0.1), transparent 50%, rgba($color-cyan-500, 0.1)) border-box;
        mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
        mask-composite: exclude;
        -webkit-mask-composite: xor;
        opacity: 0;
        transition: opacity 400ms $anim-easing;
        pointer-events: none;
      }

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba($color-gold-500, 0.1);
        border-color: rgba($color-gold-500, 0.4);

        &::before {
          opacity: 1;
        }
      }

      &[data-accent="cyan"] {
        border-color: rgba($color-cyan-500, 0.25);

        &:hover {
          border-color: rgba($color-cyan-500, 0.5);
          box-shadow: 0 12px 40px rgba($color-cyan-500, 0.1);
        }
      }

      &__icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 14px;
        background: rgba($color-gold-500, 0.1);
        color: $color-gold-500;

        svg {
          width: 24px;
          height: 24px;
        }

        [data-accent="cyan"] & {
          background: rgba($color-cyan-500, 0.1);
          color: $color-cyan-500;
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

      &__context {
        font-family: $font-body;
        font-size: 0.8125rem;
        font-style: italic;
        color: rgba(255, 255, 255, 0.5);
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
      description: 'Diseño de una solución basada en inteligencia artificial y automatización para detectar y evitar la carga repetida de documentos en procesos aseguradores de gran volumen.',
      context: 'Seguros Bolívar · Producto digital con IA aplicada',
      tags: 'IA aplicada · Automatización · Eficiencia operativa · AWS',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v2"/><path d="M20 16v2a2 2 0 0 1-2 2h-2"/><path d="M8 20H6a2 2 0 0 1-2-2v-2"/><path d="M4 8V6a2 2 0 0 1 2-2h2"/><path d="m9 15 3-3 3 3"/><path d="M12 12v6"/></svg>',
      accentColor: 'cyan',
    },
    {
      title: 'Hackathon Kiro AWS',
      description: 'Reconocimiento por la integración de inteligencia artificial, tecnologías cloud y resolución ágil de problemas empresariales complejos en un entorno competitivo.',
      context: 'AWS · Innovación competitiva · Cloud & IA',
      tags: 'AWS · Kiro · IA · Innovación · Cloud',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
      accentColor: 'gold',
    },
  ];

  onVisibilityChange(visible: boolean): void {
    if (visible) {
      this.isVisible.set(true);
      this.analytics.trackSectionView('recognition');
    }
  }
}
