import {
  Component,
  signal,
  inject,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  PLATFORM_ID,
  ViewChild,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IntersectionObserverDirective } from '../../directives/intersection-observer.directive';
import { AnalyticsService } from '../../services/analytics.service';
import { ExecutiveTimelineEntry } from '../../models/timeline-entry.interface';

interface ConsultancyEntry {
  company: string;
  client: string;
  year: number;
  role: string;
  problem: string;
  solution: string;
  result: string;
  technologies: string[];
}

@Component({
  standalone: true,
  selector: 'app-timeline-section',
  templateUrl: './timeline-section.component.html',
  styleUrls: ['./timeline-section.component.scss'],
  imports: [IntersectionObserverDirective],
})
export class TimelineSectionComponent implements AfterViewInit, OnDestroy {
  private readonly analytics = inject(AnalyticsService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elRef = inject(ElementRef);

  isVisible = signal<boolean>(false);
  expandedNodes = signal<Set<number>>(new Set());
  activeNodes = signal<Set<number>>(new Set());
  lineProgress = signal<number>(0);
  pathNodesRevealed = signal<Set<number>>(new Set());

  private cardObservers: IntersectionObserver[] = [];
  private scrollHandler: (() => void) | null = null;
  private pathObserver: IntersectionObserver | null = null;
  private animatedOnce = false;
  private prefersReducedMotion = false;

  readonly timelineEntries: ExecutiveTimelineEntry[] = [
    {
      company: 'Compañía de Seguros Bolívar S.A.',
      position: 'Product Owner Senior · Builder Strategist',
      startYear: 2023,
      endYear: 2026,
      stage: 'Producto, IA y modernización',
      stageColor: 'product-ia',
      mainResult: 'Mejora máxima en eficiencia operativa',
      mainMetric: '95%',
      description: 'Modernización del core documental y desarrollo de soluciones digitales, articulando negocio, tecnología, operaciones y proveedores.',
      tags: ['IA aplicada', 'AWS', 'Producto digital'],
      iconPath: 'M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5a2.5 2.5 0 0 0 2.32.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0 1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5|M15 9l-6 6|M9 9l6 6',
      isFeatured: true,
      accordion: {
        challenge: 'Core documental legacy con procesos manuales, baja trazabilidad y tiempos de respuesta elevados en una aseguradora de gran escala.',
        leadership: 'Liderazgo del producto digital end-to-end, articulando equipos de negocio, tecnología, operaciones y proveedores bajo marcos ágiles. Desarrollo de soluciones con IA aplicada y arquitectura cloud.',
        impact: 'Modernización de la gestión documental alcanzando 95% de eficiencia. Facturación electrónica con 80% de reducción de tiempos. Ganador Hackathon Kiro AWS.',
        technologies: ['IA Generativa', 'AWS', 'Product Management', 'Scrum', 'Kanban', 'Angular', 'Python', 'Arquitectura Cloud'],
      },
    },
    {
      company: 'Beneficiar Entidad Cooperativa',
      position: 'Director de Organización y Métodos',
      startYear: 2019,
      endYear: 2023,
      stage: 'Transformación digital y SmartOps',
      stageColor: 'smartops',
      mainResult: 'Incremento en eficiencia operativa',
      mainMetric: '90%',
      description: 'Diseño e implementación de un modelo de operaciones inteligentes y automatización de procesos core.',
      tags: ['SmartOps', 'BPMS', 'Python'],
      iconPath: 'M9 2v6|M15 2v6|M12 17v5|M5 8h14|M5 12h14|M8 17h.01|M12 17h.01|M16 17h.01',
      isFeatured: false,
      accordion: {
        challenge: 'Operaciones manuales y descentralizadas en una cooperativa con múltiples líneas de servicio y alta carga transaccional.',
        leadership: 'Diseño del modelo SmartOps integrando automatización con BPMS, analítica predictiva y gobierno de procesos. Dirección del equipo de transformación digital.',
        impact: '90% de eficiencia global operativa. Implementación exitosa de BPMS corporativo y automatización con Python para operaciones críticas.',
        technologies: ['BPMS', 'Python', 'SmartOps', 'Bizagi', 'Analítica', 'Gestión del Cambio', 'RPA'],
      },
    },
    {
      company: 'Outsourcing S.A.',
      position: 'Jefe de Mejoramiento Continuo',
      startYear: 2017,
      endYear: 2019,
      stage: 'Automatización y agilidad',
      stageColor: 'automation',
      mainResult: 'Eficiencia operativa transversal',
      mainMetric: '85%',
      description: 'Implementación de un ecosistema de automatización mediante BPM, Oracle SOA y modelos analíticos de capacidad.',
      tags: ['BPM', 'Oracle SOA', 'Analítica'],
      iconPath: 'M3 3v18h18|M8 17V9|M12 17V5|M16 17v-3|M20 17v-7',
      isFeatured: false,
      accordion: {
        challenge: 'Procesos transversales no estandarizados con altos niveles de reproceso y tiempos muertos en operaciones BPO.',
        leadership: 'Implementación de un ecosistema de automatización con Oracle SOA Suite 12C y modelos analíticos de capacidad. Gestión de la mejora continua organizacional.',
        impact: '85% de automatización en procesos transversales. 86% de crecimiento operativo. Estandarización completa del ciclo de mejora continua.',
        technologies: ['Oracle SOA Suite 12C', 'BPM', 'Analítica de Capacidad', 'Lean Six Sigma', 'Mejora Continua'],
      },
    },
    {
      company: 'Indra–Tecnocom',
      position: 'Jefe de Proyectos TI',
      startYear: 2013,
      endYear: 2016,
      stage: 'Productos digitales y fintech',
      stageColor: 'projects',
      mainResult: 'En indicadores de experiencia y satisfacción',
      mainMetric: '98%',
      description: 'Dirección de soluciones fintech, originación de crédito web, integración PSE y pagarés desmaterializados.',
      tags: ['Fintech', 'Producto', 'PSE'],
      iconPath: 'M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z|M22 17.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65|M22 12.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65',
      isFeatured: false,
      accordion: {
        challenge: 'Portafolio fintech con múltiples productos digitales en etapa de construcción y necesidad de integración con ecosistemas bancarios (PSE, pagarés).',
        leadership: 'Dirección de proyectos TI para soluciones fintech: originación de crédito web, integración PSE, pagarés desmaterializados. Gestión del portafolio tecnológico.',
        impact: '98% en indicadores de satisfacción del cliente. Lanzamiento exitoso de plataforma de crédito web y pagarés digitales.',
        technologies: ['Fintech', 'PSE', 'Crédito Web', 'Pagarés Digitales', 'Gestión de Portafolio', 'Java', 'SOA'],
      },
    },
    {
      company: 'DB-System / INVIMA',
      position: 'Consultor BPM–PMO',
      startYear: 2013,
      endYear: 2013,
      stage: 'BPM y automatización de procesos',
      stageColor: 'bpm',
      mainResult: 'Éxito en implementación',
      mainMetric: '88,5%',
      description: 'Definición e implementación de procesos automatizados mediante Oracle BPM/SOA.',
      tags: ['BPM', 'Oracle SOA', 'PMO'],
      iconPath: 'M5 22h14|M5 2h14|M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22|M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2',
      isFeatured: false,
      accordion: {
        challenge: 'Procesos regulatorios complejos en INVIMA sin automatización, con alta carga documental y necesidad de trazabilidad.',
        leadership: 'Definición e implementación de procesos automatizados con Oracle BPM/SOA JDeveloper 11g/12c. Gestión de la oficina de proyectos (PMO).',
        impact: '88,5% de tasa de éxito en proyectos de implementación BPM. Automatización de procesos regulatorios críticos.',
        technologies: ['Oracle BPM', 'Oracle SOA', 'JDeveloper 11g/12c', 'PMO', 'Procesos Regulatorios'],
      },
    },
  ];

  readonly consultancies: ConsultancyEntry[] = [
    {
      company: 'Management and Quality SAS',
      client: 'Defensoría del Pueblo',
      year: 2023,
      role: 'Consultor en Transformación Digital',
      problem: 'Procesos manuales en servicios al ciudadano con baja eficiencia y trazabilidad limitada.',
      solution: 'Rediseño de procesos con enfoque BPM y digitalización de trámites mediante BPMS Bizagi.',
      result: '40% de mejora operativa en servicios al ciudadano',
      technologies: ['BPMS', 'Bizagi', 'BPM', 'Transformación Digital'],
    },
    {
      company: 'Consultoría Estratégica Integral',
      client: 'MINTIC',
      year: 2021,
      role: 'Consultor en Arquitectura Empresarial',
      problem: 'Procesos sin estándar y desarticulación entre áreas misionales y tecnología.',
      solution: 'Diseño de arquitectura empresarial y optimización de procesos con BPMN 2.0.',
      result: '35% de mejora en eficiencia de procesos',
      technologies: ['BPMN 2.0', 'Bizagi', 'Arquitectura Empresarial'],
    },
  ];

  readonly evolutionPath = [
    { label: 'Procesos', icon: 'M5 22h14|M5 2h14|M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22|M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2' },
    { label: 'Tecnología', icon: 'M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z|M22 17.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65|M22 12.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65' },
    { label: 'Automatización', icon: 'M3 3v18h18|M8 17V9|M12 17V5|M16 17v-3|M20 17v-7' },
    { label: 'SmartOps', icon: 'M9 2v6|M15 2v6|M12 17v5|M5 8h14|M5 12h14|M8 17h.01|M12 17h.01|M16 17h.01' },
    { label: 'Producto e IA', icon: 'M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5a2.5 2.5 0 0 0 2.32.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0 1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5' },
  ];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.prefersReducedMotion) {
      // Show everything immediately
      const allNodes = new Set<number>();
      const allPathNodes = new Set<number>();
      this.timelineEntries.forEach((_, i) => allNodes.add(i));
      this.evolutionPath.forEach((_, i) => allPathNodes.add(i));
      this.activeNodes.set(allNodes);
      this.pathNodesRevealed.set(allPathNodes);
      this.lineProgress.set(100);
      return;
    }

    this.setupScrollAnimation();
    this.setupCardObservers();
    this.setupPathAnimation();
  }

  ngOnDestroy(): void {
    this.cardObservers.forEach(obs => obs.disconnect());
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
    if (this.pathObserver) {
      this.pathObserver.disconnect();
    }
  }

  private setupScrollAnimation(): void {
    this.scrollHandler = () => {
      const section = this.elRef.nativeElement.querySelector('.executive-timeline');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionHeight = rect.height;

      if (sectionTop < windowHeight && rect.bottom > 0) {
        const scrolled = windowHeight - sectionTop;
        const progress = Math.min(Math.max((scrolled / (sectionHeight + windowHeight * 0.3)) * 100, 0), 100);
        this.lineProgress.set(progress);
      }
    };
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  private setupCardObservers(): void {
    setTimeout(() => {
      const cards = this.elRef.nativeElement.querySelectorAll('.exec-card');
      cards.forEach((card: Element, index: number) => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const current = new Set(this.activeNodes());
                current.add(index);
                this.activeNodes.set(current);
                observer.unobserve(entry.target); // animate once
              }
            });
          },
          { threshold: 0.2 }
        );
        observer.observe(card);
        this.cardObservers.push(observer);
      });
    }, 100);
  }

  private setupPathAnimation(): void {
    setTimeout(() => {
      const pathContainer = this.elRef.nativeElement.querySelector('.evolution-path');
      if (!pathContainer) return;

      this.pathObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.revealPathNodes();
              this.pathObserver?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      this.pathObserver.observe(pathContainer);
    }, 100);
  }

  private revealPathNodes(): void {
    this.evolutionPath.forEach((_, i) => {
      setTimeout(() => {
        const current = new Set(this.pathNodesRevealed());
        current.add(i);
        this.pathNodesRevealed.set(current);
      }, i * 300);
    });
  }

  onSectionVisibilityChange(visible: boolean): void {
    if (visible) {
      this.isVisible.set(true);
      this.analytics.trackSectionView('timeline');
    }
  }

  toggleNode(index: number): void {
    const current = this.expandedNodes();
    if (current.has(index)) {
      this.expandedNodes.set(new Set());
    } else {
      this.expandedNodes.set(new Set([index]));
    }
  }

  isNodeExpanded(index: number): boolean {
    return this.expandedNodes().has(index);
  }

  isNodeActive(index: number): boolean {
    return this.activeNodes().has(index);
  }

  isPathNodeRevealed(index: number): boolean {
    return this.pathNodesRevealed().has(index);
  }

  getDateRange(entry: ExecutiveTimelineEntry): string {
    if (entry.endYear === null) {
      return `${entry.startYear} – Presente`;
    }
    if (entry.startYear === entry.endYear) {
      return `${entry.startYear}`;
    }
    return `${entry.startYear} – ${entry.endYear}`;
  }

  getIconPaths(pathString: string): string[] {
    return pathString.split('|');
  }
}
