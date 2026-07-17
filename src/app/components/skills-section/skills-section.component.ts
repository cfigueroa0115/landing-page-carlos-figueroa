import { Component, signal, inject } from '@angular/core';
import { IntersectionObserverDirective } from '../../directives/intersection-observer.directive';
import { AnalyticsService } from '../../services/analytics.service';
import { SectionBackgroundComponent } from '../section-background/section-background.component';

interface SkillGroup {
  title: string;
  description: string;
  icon: string;
  accentColor: string;
  tags: string[];
}

@Component({
  standalone: true,
  selector: 'app-skills-section',
  templateUrl: './skills-section.component.html',
  styleUrls: ['./skills-section.component.scss'],
  imports: [IntersectionObserverDirective, SectionBackgroundComponent],
})
export class SkillsSectionComponent {
  private readonly analytics = inject(AnalyticsService);
  isVisible = signal<boolean>(false);
  activeCategory = signal<number>(-1);

  readonly categories: SkillGroup[] = [
    {
      title: 'Estrategia y transformación',
      description: 'Define dirección, priorización y evolución organizacional.',
      icon: 'M12 12 m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0|M16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76',
      accentColor: 'blue',
      tags: [
        'Transformación digital',
        'Planeación estratégica',
        'Gestión del cambio',
        'Gobierno de TI',
        'Arquitectura empresarial',
        'Modelos operativos inteligentes',
      ],
    },
    {
      title: 'Procesos y excelencia operativa',
      description: 'Convierte flujos complejos en operaciones eficientes y escalables.',
      icon: 'M3 3h6l6 18h6|M14 3h7',
      accentColor: 'teal',
      tags: [
        'BPM',
        'BPMN 2.0',
        'BPMS',
        'Mejora continua',
        'Lean Six Sigma',
        'SmartOps',
        'Rediseño de procesos',
      ],
    },
    {
      title: 'Producto, proyectos y agilidad',
      description: 'Conecta necesidades, productos, recursos y entrega de valor.',
      icon: 'M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z|M22 17.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65|M22 12.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65',
      accentColor: 'cyan-blue',
      tags: [
        'Product Management',
        'Product Owner',
        'Gestión de portafolios',
        'Scrum',
        'Kanban',
        'Product Discovery',
        'MVP',
        'Gestión de stakeholders',
      ],
    },
    {
      title: 'Tecnología, datos e IA',
      description: 'Integra automatización, datos y tecnología para resolver problemas empresariales.',
      icon: 'M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5a2.5 2.5 0 0 0 2.32.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0 1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5',
      accentColor: 'cyan',
      tags: [
        'Inteligencia artificial aplicada',
        'Automatización',
        'Python',
        'SQL',
        'Analítica de datos',
        'AWS',
        'Oracle',
        'Oracle BPM/SOA',
        'Bizagi',
        'Angular',
        'Java',
      ],
    },
  ];

  onVisibilityChange(visible: boolean): void {
    if (visible) {
      this.isVisible.set(true);
      this.analytics.trackSectionView('skills');
    }
  }

  setActiveCategory(index: number): void {
    this.activeCategory.set(index);
  }

  clearActiveCategory(): void {
    this.activeCategory.set(-1);
  }

  getIconPaths(iconStr: string): string[] {
    return iconStr.split('|');
  }
}
