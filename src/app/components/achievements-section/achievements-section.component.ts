import { Component, signal, inject } from '@angular/core';
import { IntersectionObserverDirective } from '../../directives/intersection-observer.directive';
import { CountUpDirective } from '../../directives/count-up.directive';
import { AnalyticsService } from '../../services/analytics.service';
import { SectionBackgroundComponent } from '../section-background/section-background.component';

interface AchievementItem {
  percentage: number;
  title: string;
  description: string;
  company: string;
}

@Component({
  standalone: true,
  selector: 'app-achievements-section',
  imports: [IntersectionObserverDirective, CountUpDirective, SectionBackgroundComponent],
  templateUrl: './achievements-section.component.html',
  styleUrls: ['./achievements-section.component.scss'],
})
export class AchievementsSectionComponent {
  private readonly analytics = inject(AnalyticsService);
  isVisible = signal<boolean>(false);

  readonly achievements: AchievementItem[] = [
    {
      percentage: 95,
      title: 'Modernización tecnológica',
      description: 'Modernización del sistema core de gestión documental mediante la migración de IBM FileNet hacia arquitecturas con AWS, Oracle, Angular y Java.',
      company: 'Seguros Bolívar',
    },
    {
      percentage: 80,
      title: 'Reducción de tiempos',
      description: 'Implementación de facturación electrónica y portal transaccional de autogestión para intermediarios.',
      company: 'Seguros Bolívar',
    },
    {
      percentage: 90,
      title: 'Eficiencia operativa',
      description: 'Diseño e implementación de un modelo SmartOps para automatización integral de procesos core.',
      company: 'Beneficiar Entidad Cooperativa',
    },
    {
      percentage: 85,
      title: 'Automatización transversal',
      description: 'Implementación de BPM y Oracle SOA Suite 12C para optimizar procesos y habilitar crecimiento operacional.',
      company: 'Outsourcing S.A.',
    },
    {
      percentage: 98,
      title: 'Experiencia y satisfacción',
      description: 'Desarrollo de soluciones fintech, integración PSE, originación de crédito web y pagarés desmaterializados.',
      company: 'Indra–Tecnocom',
    },
    {
      percentage: 40,
      title: 'Mejora en eficacia operativa',
      description: 'Optimización de procesos y servicios digitales para una entidad del sector público mediante BPMS y Bizagi.',
      company: 'Defensoría del Pueblo',
    },
  ];

  onVisibilityChange(visible: boolean): void {
    if (visible) {
      this.isVisible.set(true);
      this.analytics.trackSectionView('achievements');
    }
  }
}
