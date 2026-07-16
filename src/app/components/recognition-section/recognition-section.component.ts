import { Component, signal, inject } from '@angular/core';
import { IntersectionObserverDirective } from '../../directives/intersection-observer.directive';
import { AnalyticsService } from '../../services/analytics.service';

interface RecognitionItem {
  title: string;
  description: string;
  tags: string;
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
      <div class="container">
        <h2 id="recognition-heading" class="recognition-heading">Innovación y reconocimientos</h2>

        <div class="recognition-grid">
          @for (item of recognitions; track item.title) {
            <article class="recognition-card">
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
      background-color: $color-bg-primary;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity $anim-duration-normal $anim-easing,
                  transform $anim-duration-normal $anim-easing;

      &.is-visible {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .recognition-heading {
      font-family: $font-heading;
      font-weight: $font-weight-heading;
      font-size: $font-size-h2;
      line-height: 1.2;
      text-align: center;
      color: $color-text-primary;
      margin-bottom: $space-8;

      @media (max-width: $bp-tablet) {
        font-size: 28px;
        margin-bottom: $space-7;
      }
    }

    .recognition-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $space-6;
      max-width: 800px;
      margin: 0 auto;

      @media (max-width: $bp-tablet) {
        grid-template-columns: 1fr;
        gap: $space-5;
      }
    }

    .recognition-card {
      background: $color-bg-card;
      border: 1px solid rgba($color-accent-primary, 0.06);
      border-radius: 12px;
      padding: $space-6;
      display: flex;
      flex-direction: column;
      gap: $space-3;
      transition: transform $anim-duration-fast $anim-easing,
                  box-shadow $anim-duration-fast $anim-easing;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
      }

      &__title {
        font-family: $font-heading;
        font-weight: $font-weight-heading;
        font-size: 1.125rem;
        color: $color-text-primary;
        margin: 0;
      }

      &__description {
        font-family: $font-body;
        font-size: 0.9375rem;
        color: $color-text-secondary;
        line-height: 1.6;
        margin: 0;
      }

      &__tags {
        font-family: $font-body;
        font-size: 0.8125rem;
        font-weight: 500;
        color: $color-accent-secondary;
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
    },
    {
      title: 'Hackathon Kiro AWS',
      description: 'Reconocimiento por la integración de inteligencia artificial, tecnologías cloud y resolución ágil de problemas empresariales complejos.',
      tags: 'AWS · Kiro · IA · Innovación',
    },
  ];

  onVisibilityChange(visible: boolean): void {
    if (visible) {
      this.isVisible.set(true);
      this.analytics.trackSectionView('recognition');
    }
  }
}
