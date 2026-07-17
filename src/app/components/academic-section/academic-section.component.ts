import { Component, signal, inject } from '@angular/core';
import { IntersectionObserverDirective } from '../../directives/intersection-observer.directive';
import { AnalyticsService } from '../../services/analytics.service';
import { SectionBackgroundComponent } from '../section-background/section-background.component';

interface AcademicEntry {
  institution: string;
  role: string;
  period: string;
  focus: string;
  subjects: string[];
}

@Component({
  standalone: true,
  selector: 'app-academic-section',
  imports: [IntersectionObserverDirective, SectionBackgroundComponent],
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
      <app-section-background variant="academic" [height]="800"></app-section-background>

      <div class="container">
        <div class="academic-header">
          <span class="section-eyebrow">FORMACIÓN DE TALENTO</span>
          <h2 id="academic-heading" class="section-title">Experiencia corporativa convertida en aprendizaje aplicado</h2>
        </div>

        <div class="academic-entries">
          @for (entry of entries; track entry.institution) {
            <article class="academic-entry">
              <div class="academic-entry__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 10 3 12 0v-5"/>
                </svg>
              </div>
              <h3 class="academic-entry__institution">{{ entry.institution }}</h3>
              <p class="academic-entry__role">{{ entry.role }}</p>
              <p class="academic-entry__focus">{{ entry.focus }}</p>
              <span class="academic-entry__period">{{ entry.period }}</span>
              <details class="academic-entry__details">
                <summary class="academic-entry__summary">Ver asignaturas</summary>
                <div class="academic-entry__subjects">
                  @for (subject of entry.subjects; track subject) {
                    <span class="academic-entry__subject-tag">{{ subject }}</span>
                  }
                </div>
              </details>
            </article>
          }
        </div>

        <div class="academic-areas">
          <h4 class="academic-areas__title">Áreas de dominio docente</h4>
          <div class="academic-areas__tags">
            @for (area of areas; track area) {
              <span class="academic-area-tag">{{ area }}</span>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @use 'styles/tokens' as *;

    .academic-section {
      position: relative;
      background-color: $color-bg-primary;
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 450ms $anim-easing, transform 450ms $anim-easing;

      &.is-visible {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .academic-header {
      text-align: center;
      margin-bottom: $space-8;
      position: relative;
    }

    .academic-entries {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $space-5;
      margin-bottom: $space-7;
      position: relative;

      @media (max-width: $bp-desktop) {
        grid-template-columns: 1fr;
        gap: $space-4;
      }
    }

    .academic-entry {
      background: $color-bg-card;
      border: 1px solid $color-border;
      border-radius: 16px;
      padding: $space-5;
      display: flex;
      flex-direction: column;
      gap: $space-2;
      transition: transform $anim-duration-fast $anim-easing,
                  box-shadow $anim-duration-fast $anim-easing,
                  border-color $anim-duration-fast $anim-easing;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
        border-color: rgba($color-cyan-500, 0.3);
      }

      &__icon {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: linear-gradient(135deg, rgba($color-blue-600, 0.08), rgba($color-cyan-500, 0.12));
        border: 1px solid rgba($color-cyan-500, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        color: $color-blue-600;
        margin-bottom: $space-2;
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

      &__focus {
        font-family: $font-body;
        font-size: 0.8125rem;
        color: $color-blue-600;
        font-weight: 500;
        margin: 0;
      }

      &__period {
        font-family: $font-body;
        font-size: 0.8125rem;
        font-weight: $font-weight-emphasis;
        color: $color-cyan-500;
        margin-top: auto;
      }

      &__details {
        margin-top: $space-2;
      }

      &__summary {
        font-family: $font-body;
        font-size: 0.75rem;
        font-weight: $font-weight-emphasis;
        color: $color-blue-600;
        cursor: pointer;
        padding: $space-1 0;

        &:hover {
          color: $color-cyan-500;
        }
      }

      &__subjects {
        display: flex;
        flex-wrap: wrap;
        gap: $space-1;
        margin-top: $space-2;
      }

      &__subject-tag {
        font-size: 0.6875rem;
        padding: 2px 6px;
        border-radius: 4px;
        background: $color-bg-secondary;
        color: $color-text-muted;
        border: 1px solid $color-border;
      }
    }

    .academic-areas {
      text-align: center;
      position: relative;

      &__title {
        font-family: $font-heading;
        font-size: 0.9375rem;
        font-weight: $font-weight-emphasis;
        color: $color-text-secondary;
        margin: 0 0 $space-4;
      }

      &__tags {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: $space-2;
      }
    }

    .academic-area-tag {
      padding: $space-2 $space-3;
      font-family: $font-body;
      font-size: 0.8125rem;
      font-weight: 500;
      color: $color-blue-600;
      border: 1px solid rgba($color-cyan-500, 0.2);
      border-radius: 20px;
      white-space: nowrap;
      background: rgba($color-cyan-500, 0.04);
      transition: all 200ms $anim-easing;

      &:hover {
        border-color: rgba($color-cyan-500, 0.4);
        background: rgba($color-cyan-500, 0.08);
      }
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
      focus: 'Operaciones, procesos y transformación digital',
      subjects: ['Gestión de operaciones', 'Mejora continua', 'Procesos industriales'],
    },
    {
      institution: 'CUN',
      role: 'Docente de Ingeniería Industrial',
      period: '2023 – 2025',
      focus: 'Proyectos, costos y analítica',
      subjects: ['Gestión de proyectos', 'Costos y presupuestos', 'Analítica de datos', 'Calidad'],
    },
    {
      institution: 'Universidad Manuela Beltrán',
      role: 'Docente de Ingeniería Industrial',
      period: '2025',
      focus: 'Investigación y calidad',
      subjects: ['Investigación de operaciones', 'Sistemas de calidad'],
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
