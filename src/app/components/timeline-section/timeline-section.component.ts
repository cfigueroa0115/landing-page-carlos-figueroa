import { Component, signal, inject } from '@angular/core';
import { IntersectionObserverDirective } from '../../directives/intersection-observer.directive';
import { AnalyticsService } from '../../services/analytics.service';

interface TimelineEntry {
  company: string;
  position: string;
  startYear: number;
  endYear: number | null;
  responsibilities: string[];
}

interface ConsultancyEntry {
  company: string;
  client: string;
  year: number;
}

@Component({
  standalone: true,
  selector: 'app-timeline-section',
  templateUrl: './timeline-section.component.html',
  styleUrls: ['./timeline-section.component.scss'],
  imports: [IntersectionObserverDirective],
})
export class TimelineSectionComponent {
  private readonly analytics = inject(AnalyticsService);
  isVisible = signal<boolean>(false);
  expandedNodes = signal<Set<number>>(new Set());

  readonly timelineEntries: TimelineEntry[] = [
    {
      company: 'Compañía de Seguros Bolívar S.A.',
      position: 'Product Owner Senior · Builder Strategist',
      startYear: 2023,
      endYear: 2026,
      responsibilities: [
        'Modernización gestión documental con 95% de eficiencia',
        'Facturación electrónica con 80% reducción de tiempos',
        'Estrategia de producto digital y liderazgo ágil',
        'Ganador Hackathon Kiro AWS',
      ],
    },
    {
      company: 'Beneficiar Entidad Cooperativa',
      position: 'Director de Organización y Métodos',
      startYear: 2019,
      endYear: 2023,
      responsibilities: [
        'Implementación BPMS corporativo',
        'Automatización con Python y modelo SmartOps',
        '90% eficiencia global operativa',
        'Transformación digital integral',
      ],
    },
    {
      company: 'Outsourcing S.A.',
      position: 'Jefe de Mejoramiento Continuo',
      startYear: 2017,
      endYear: 2019,
      responsibilities: [
        'Oracle SOA Suite 12C',
        '85% automatización en procesos transversales',
        '86% crecimiento operativo',
        'Gestión de mejora continua',
      ],
    },
    {
      company: 'Indra – Tecnocom',
      position: 'Jefe de Proyectos TI',
      startYear: 2013,
      endYear: 2016,
      responsibilities: [
        'Plataforma PSE y productos fintech',
        'Crédito web y pagarés digitales',
        '98% satisfacción del cliente',
        'Gestión de portafolio TI',
      ],
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
      ],
    },
  ];

  readonly consultancies: ConsultancyEntry[] = [
    { company: 'Management and Quality SAS', client: 'Defensoría del Pueblo', year: 2023 },
    { company: 'Consultoría Estratégica Integral', client: 'MINTIC', year: 2021 },
  ];

  onSectionVisibilityChange(visible: boolean): void {
    if (visible) {
      this.isVisible.set(true);
      this.analytics.trackSectionView('timeline');
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
}
