import { Component, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IntersectionObserverDirective } from '../../directives/intersection-observer.directive';
import { AnalyticsService } from '../../services/analytics.service';
import { SectionBackgroundComponent } from '../section-background/section-background.component';

interface AcademicEntry {
  institution: string;
  role: string;
  period: string;
  focus: string;
  subjects: string[];
  iconPaths: string;
  accentColor: string;
  isCurrent: boolean;
}

interface DomainArea {
  label: string;
  iconPaths: string;
}

@Component({
  standalone: true,
  selector: 'app-academic-section',
  imports: [IntersectionObserverDirective, SectionBackgroundComponent],
  templateUrl: './academic-section.component.html',
  styleUrls: ['./academic-section.component.scss'],
})
export class AcademicSectionComponent {
  private readonly analytics = inject(AnalyticsService);
  private readonly platformId = inject(PLATFORM_ID);
  isVisible = signal<boolean>(false);
  expandedIndex = signal<number>(isPlatformBrowser(this.platformId) && window.innerWidth >= 1024 ? 0 : -1);

  readonly entries: AcademicEntry[] = [
    {
      institution: 'Universidad Cooperativa de Colombia',
      role: 'Profesor de Ingeniería Industrial',
      period: '2026 – presente',
      focus: 'Operaciones, procesos y transformación digital',
      subjects: ['Gestión de operaciones', 'Mejora continua', 'Procesos industriales'],
      iconPaths: 'M22 10v6M2 10l10-5 10 5-10 5z|M6 12v5c3 3 10 3 12 0v-5|M2 2h4l2 3h12',
      accentColor: 'cyan',
      isCurrent: true,
    },
    {
      institution: 'CUN',
      role: 'Docente de Ingeniería Industrial',
      period: '2023 – 2025',
      focus: 'Proyectos, costos y analítica',
      subjects: ['Gestión de proyectos', 'Costos y presupuestos', 'Analítica de datos', 'Calidad'],
      iconPaths: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z|M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
      accentColor: 'blue',
      isCurrent: false,
    },
    {
      institution: 'Universidad Manuela Beltrán',
      role: 'Docente de Ingeniería Industrial',
      period: '2025',
      focus: 'Investigación y calidad',
      subjects: ['Investigación de operaciones', 'Sistemas de calidad'],
      iconPaths: 'M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 10 17 10|M11 20v2|M7 20h8|M2 15c6.5-3.5 9.5-3.5 16 0',
      accentColor: 'teal',
      isCurrent: false,
    },
  ];

  readonly domainAreas: DomainArea[] = [
    { label: 'Operaciones y producción', iconPaths: 'M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z' },
    { label: 'Gestión de proyectos', iconPaths: 'M8 6h10|M6 12h9|M11 18h7|M3 6h.01|M3 12h.01|M3 18h.01' },
    { label: 'Calidad y mejora continua', iconPaths: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z|M9 12l2 2 4-4' },
    { label: 'Costos y finanzas', iconPaths: 'M3 3v18h18|M18 17V9|M13 17V5|M8 17v-3' },
    { label: 'Procesos y transformación digital', iconPaths: 'M3 3h6l6 18h6|M14 3h7' },
    { label: 'Investigación y analítica', iconPaths: 'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z|M10 7v6|M7 10h6' },
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

  toggleAccordion(index: number): void {
    if (this.expandedIndex() === index) {
      this.expandedIndex.set(-1);
    } else {
      this.expandedIndex.set(index);
    }
  }

  isExpanded(index: number): boolean {
    return this.expandedIndex() === index;
  }

  getIconPaths(pathString: string): string[] {
    return pathString.split('|');
  }
}
