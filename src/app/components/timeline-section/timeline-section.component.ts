import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntersectionObserverDirective } from '../../directives/intersection-observer.directive';
import { TimelineEntry } from '../../models/timeline-entry.interface';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  standalone: true,
  selector: 'app-timeline-section',
  templateUrl: './timeline-section.component.html',
  styleUrls: ['./timeline-section.component.scss'],
  imports: [CommonModule, IntersectionObserverDirective],
})
export class TimelineSectionComponent {
  private readonly analytics = inject(AnalyticsService);
  isVisible = signal<boolean>(false);

  /** Tracks which nodes have entered the viewport (by index) */
  visibleNodes = signal<Set<number>>(new Set());

  /** Tracks which nodes are expanded (by index) */
  expandedNodes = signal<Set<number>>(new Set());

  /** All timeline entries in reverse chronological order (2026 to 2013) */
  readonly timelineEntries: TimelineEntry[] = [
    {
      company: 'Universidad Cooperativa de Colombia',
      position: 'Profesor Ingeniería Industrial',
      startYear: 2026,
      endYear: null,
      responsibilities: [
        'Investigación de operaciones',
        'Sistemas CAD',
        'Gestión de calidad',
        'Costos industriales',
        'Diseño de planta',
      ],
      isExpanded: false,
    },
    {
      company: 'Compañía de Seguros Bolívar S.A.',
      position: 'Product Owner Senior | Builder Strategist',
      startYear: 2023,
      endYear: 2026,
      responsibilities: [
        'Gestión documental con 95% de modernización',
        'Facturación electrónica con 80% de automatización',
        'Ganador hackathon Kiro AWS',
        'Estrategia de producto digital',
        'Liderazgo de equipos ágiles',
      ],
      isExpanded: false,
    },
    {
      company: 'Management and Quality SAS',
      position: 'Consultor de Procesos',
      startYear: 2023,
      endYear: 2023,
      responsibilities: [
        'Consultoría para Defensoría del Pueblo',
        'Implementación Bizagi BPMS',
        '40% mejora en eficacia operativa',
        'Rediseño de procesos misionales',
        'Documentación de procedimientos',
      ],
      isExpanded: false,
    },
    {
      company: 'CUN',
      position: 'Docente Ingeniería Industrial',
      startYear: 2023,
      endYear: 2025,
      responsibilities: [
        'Lean Manufacturing',
        'Gestión de proyectos',
        'Simulación de procesos',
        'Procesos industriales',
        'Costos y presupuestos',
      ],
      isExpanded: false,
    },
    {
      company: 'Consultoría Estratégica Integral',
      position: 'Especialista Rediseño de Procesos',
      startYear: 2021,
      endYear: 2021,
      responsibilities: [
        'Consultoría para MINTIC',
        'Modelado BPMN 2.0',
        'Implementación Bizagi',
        '35% mejora en eficiencia operativa',
        'Optimización de flujos de trabajo',
      ],
      isExpanded: false,
    },
    {
      company: 'Beneficiar Entidad Cooperativa',
      position: 'Director Organización y Métodos',
      startYear: 2019,
      endYear: 2023,
      responsibilities: [
        'Implementación BPMS corporativo',
        'Automatización con Python',
        '90% eficiencia global operativa',
        'Creación modelo SmartOps',
        'Transformación digital integral',
      ],
      isExpanded: false,
    },
    {
      company: 'Outsourcing S.A.',
      position: 'Jefe Mejoramiento Continuo',
      startYear: 2017,
      endYear: 2019,
      responsibilities: [
        'Oracle SOA Suite 12C',
        '85% eficiencia en procesos',
        '86% crecimiento operativo',
        'Gestión de mejora continua',
        'Automatización de servicios',
      ],
      isExpanded: false,
    },
    {
      company: 'Indra – Tecnocom',
      position: 'Jefe de Proyectos TI',
      startYear: 2013,
      endYear: 2016,
      responsibilities: [
        'Plataforma PSE',
        'Crédito web y pagarés digitales',
        '98% satisfacción del cliente',
        'Productos fintech',
        'Gestión de portafolio TI',
      ],
      isExpanded: false,
    },
    {
      company: 'DB-System / INVIMA',
      position: 'Consultor BPM-PMO',
      startYear: 2013,
      endYear: 2013,
      responsibilities: [
        'Oracle BPM/SOA JDeveloper 11g/12c',
        '88.5% tasa de éxito en proyectos',
        'Gestión de oficina de proyectos',
        'Implementación BPM',
        'Consultoría metodológica',
      ],
      isExpanded: false,
    },
  ];

  onSectionVisibilityChange(visible: boolean): void {
    if (visible) {
      this.isVisible.set(true);
      this.analytics.trackSectionView('timeline');
    }
  }

  onNodeVisibilityChange(visible: boolean, index: number): void {
    if (visible) {
      const current = new Set(this.visibleNodes());
      current.add(index);
      this.visibleNodes.set(current);
    }
  }

  toggleNode(index: number): void {
    const current = new Set(this.expandedNodes());
    if (current.has(index)) {
      current.delete(index);
    } else {
      current.add(index);
    }
    this.expandedNodes.set(current);
  }

  isNodeVisible(index: number): boolean {
    return this.visibleNodes().has(index);
  }

  isNodeExpanded(index: number): boolean {
    return this.expandedNodes().has(index);
  }

  getDateRange(entry: TimelineEntry): string {
    if (entry.endYear === null) {
      return `${entry.startYear} – Presente`;
    }
    if (entry.startYear === entry.endYear) {
      return `${entry.startYear}`;
    }
    return `${entry.startYear} – ${entry.endYear}`;
  }

  getDuration(entry: TimelineEntry): string {
    const end = entry.endYear ?? new Date().getFullYear();
    const years = end - entry.startYear;
    if (years === 0) {
      return '< 1 año';
    }
    if (years === 1) {
      return '1 año';
    }
    return `${years} años`;
  }
}
