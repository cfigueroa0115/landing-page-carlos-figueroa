import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TypewriterDirective } from '../../directives/typewriter.directive';
import { AnimationService } from '../../services/animation.service';
import { ScrollService } from '../../services/scroll.service';
import { MetricChip } from '../../models/metric-chip.interface';

/**
 * HeroSectionComponent — Primary above-the-fold section.
 *
 * Displays:
 * - Full name with gradient text
 * - Typewriter cycling professional titles
 * - Tagline
 * - 4 metric chips with hover float animation
 * - Two CTAs: "Descargar CV" (PDF download) and "Ver Logros" (scroll)
 * - Circular profile photo with rotating gradient ring
 * - GSAP stagger fade-in on load
 * - Scroll indicator arrow at bottom
 *
 * Layout: 60/40 (content left, photo right) on desktop 1024px+
 * Responsive: stacks vertically below 768px, single-column centered 768-1023px
 */
@Component({
  standalone: true,
  selector: 'app-hero-section',
  imports: [CommonModule, TypewriterDirective],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
})
export class HeroSectionComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly animationService = inject(AnimationService);
  private readonly scrollService = inject(ScrollService);

  @ViewChildren('animateEl') animateElements!: QueryList<ElementRef>;
  @ViewChild('heroSection') heroSection!: ElementRef;

  /** Professional titles for the typewriter effect. */
  readonly titles: string[] = [
    'Líder en Transformación Digital',
    'Especialista en IA Aplicada al Negocio',
    'Arquitecto de Operaciones Inteligentes',
    'Product Owner Senior | Docente Universitario',
  ];

  /** Metric chips data. */
  readonly metrics: MetricChip[] = [
    { value: '18+', label: 'Años de experiencia' },
    { value: '95%', label: 'Máxima eficiencia lograda' },
    { value: '8+', label: 'Sectores impactados' },
    { value: '+100', label: 'Proyectos gestionados' },
  ];

  /** Error state for CV download. */
  downloadError = signal<string>('');

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // GSAP stagger fade-in animation on load (150ms delay between elements)
    const elements = this.animateElements
      .toArray()
      .map((el) => el.nativeElement);

    if (elements.length) {
      this.animationService.fadeInStagger(elements, 0.15);
    }
  }

  ngOnDestroy(): void {
    // AnimationService handles its own cleanup via the service lifecycle
  }

  /**
   * Initiates PDF download of the CV file.
   * Shows an error message if the file is unavailable.
   */
  downloadCV(): void {
    this.downloadError.set('');

    const link = document.createElement('a');
    link.href = 'assets/documents/cv-carlos-figueroa.pdf';
    link.download = 'CV-Carlos-Figueroa.pdf';
    link.target = '_blank';

    // Attempt to fetch the file first to verify availability
    fetch(link.href, { method: 'HEAD' })
      .then((response) => {
        if (response.ok) {
          link.click();
        } else {
          this.downloadError.set(
            'El archivo no está disponible en este momento. Intente más tarde.'
          );
        }
      })
      .catch(() => {
        this.downloadError.set(
          'No se pudo descargar el archivo. Verifique su conexión e intente nuevamente.'
        );
      });
  }

  /**
   * Smooth-scrolls to the achievements section.
   */
  scrollToAchievements(): void {
    this.scrollService.scrollToSection('achievements');
  }
}
