import { Component, signal, inject } from '@angular/core';
import { IntersectionObserverDirective } from '../../directives/intersection-observer.directive';
import { AnalyticsService } from '../../services/analytics.service';

interface SkillGroup {
  title: string;
  tags: string[];
}

@Component({
  standalone: true,
  selector: 'app-skills-section',
  templateUrl: './skills-section.component.html',
  styleUrls: ['./skills-section.component.scss'],
  imports: [IntersectionObserverDirective],
})
export class SkillsSectionComponent {
  private readonly analytics = inject(AnalyticsService);
  isVisible = signal<boolean>(false);

  readonly categories: SkillGroup[] = [
    {
      title: 'Estrategia y transformación',
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
}
