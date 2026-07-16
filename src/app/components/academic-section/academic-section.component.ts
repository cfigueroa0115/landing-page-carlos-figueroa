import { Component, signal, inject } from '@angular/core';
import { IntersectionObserverDirective } from '../../directives/intersection-observer.directive';
import { AnalyticsService } from '../../services/analytics.service';

interface AcademicEntry {
  institution: string;
  role: string;
  period: string;
}

@Component({
  standalone: true,
  selector: 'app-academic-section',
  imports: [IntersectionObserverDirective],
  template: `
    <section
      id="academic"
      class="section academic-section"
      appInView
      [threshold]="0.2"
      (inView)="onVisibilityChange($event)"
      [class.is-visible]="isVisible()"
      aria-labelledby="academic-heading"
    >
      <div class="container">
        <h2 id="academic-heading" class="academic-heading">Liderazgo académico y formación de talento</h2>

        <p class="academic-intro">
          Integra su experiencia empresarial con la formación de nuevos profesionales, conectando la teoría con desafíos reales de productividad, transformación digital, operaciones, proyectos e innovación.
        </p>

        <div class="academic-entries">
          @for (entry of entries; track entry.institution) {
            <article class="academic-entry">
              <h3 class="academic-entry__institution">{{ entry.institution }}</h3>
              <p class="academic-entry__role">{{ entry.role }}</p>
              <span class="academic-entry__period">{{ entry.period }}</span>
            </article>
          }
        </div>

        <div class="academic-areas">
          @for (area of areas; track area) {
            <span class="academic-area-tag">{{ area }}</span>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    @use 'styles/tokens' as *;

    .academic-section {
      background-color: $color-bg-secondary;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity $anim-duration-normal $anim-easing,
                  transform $anim-duration-normal $anim-easing;

      &.is-visible {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .academic-heading {
      font-family: $font-heading;
      font-weight: $font-weight-heading;
      font-size: $font-size-h2;
      line-height: 1.2;
      text-align: center;
      color: $color-text-primary;
      margin-bottom: $space-5;

      @media (max-width: $bp-tablet) {
        font-size: 28px;
      }
    }

    .academic-intro {
      font-family: $font-body;
      font-size: 1.0625rem;
      color: $color-text-secondary;
      line-height: 1.7;
      text-align: center;
      max-width: 750px;
      margin: 0 auto $space-7;
    }

    .academic-entries {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $space-5;
      margin-bottom: $space-7;

      @media (max-width: $bp-desktop) {
        grid-template-columns: 1fr;
        gap: $space-4;
      }
    }

    .academic-entry {
      background: $color-bg-card;
      border: 1px solid rgba($color-accent-primary, 0.06);
      border-radius: 12px;
      padding: $space-5;
      display: flex;
      flex-direction: column;
      gap: $space-2;
      transition: transform $anim-duration-fast $anim-easing,
                  box-shadow $anim-duration-fast $anim-easing;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
      }

      &__institution {
        font-family: $font-heading;
        font-weight: $font-weight-heading;
        font-size: 1rem;
        color: $color-text-primary;
        margin: 0;
      }

      &__role {
        font-family: $font-body;
        font-size: 0.9375rem;
        color: $color-text-secondary;
        margin: 0;
      }

      &__period {
        font-family: $font-body;
        font-size: 0.8125rem;
        font-weight: $font-weight-emphasis;
        color: $color-accent-secondary;
        margin-top: auto;
      }
    }

    .academic-areas {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: $space-2;
    }

    .academic-area-tag {
      padding: $space-2 $space-3;
      font-family: $font-body;
      font-size: 0.8125rem;
      font-weight: 500;
      color: $color-accent-primary;
      border: 1px solid rgba($color-accent-primary, 0.15);
      border-radius: 20px;
      white-space: nowrap;
    }

    @media (prefers-reduced-motion: reduce) {
      .academic-section {
        opacity: 1;
        transform: none;
        transition: none;
      }
    }
  `],
})
export class AcademicSectionComponent {
  private readonly analytics = inject(AnalyticsService);
  isVisible = signal<boolean>(false);

  readonly entries: AcademicEntry[] = [
    {
      institution: 'Universidad Cooperativa de Colombia',
      role: 'Profesor de Ingeniería Industrial',
      period: '2026 – actualmente',
    },
    {
      institution: 'CUN',
      role: 'Docente de Ingeniería Industrial',
      period: '2023 – 2025',
    },
    {
      institution: 'Universidad Manuela Beltrán',
      role: 'Docente de Ingeniería Industrial',
      period: '2025',
    },
  ];

  readonly areas: string[] = [
    'Operaciones y producción',
    'Gestión de proyectos',
    'Calidad y mejora continua',
    'Costos y finanzas',
    'Procesos y transformación digital',
    'Investigación y analítica',
  ];

  onVisibilityChange(visible: boolean): void {
    if (visible) {
      this.isVisible.set(true);
      this.analytics.trackSectionView('academic');
    }
  }
}
