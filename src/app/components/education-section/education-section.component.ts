import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntersectionObserverDirective } from '../../directives/intersection-observer.directive';
import { EducationEntry } from '../../models/education-entry.interface';
import { Certification } from '../../models/certification.interface';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  standalone: true,
  selector: 'app-education-section',
  templateUrl: './education-section.component.html',
  styleUrls: ['./education-section.component.scss'],
  imports: [CommonModule, IntersectionObserverDirective],
})
export class EducationSectionComponent {
  private readonly analytics = inject(AnalyticsService);
  isVisible = signal<boolean>(false);

  /** Education entries data */
  readonly educationEntries: EducationEntry[] = [
    {
      degree: 'Doctorado en Administración de Empresas',
      institution: 'UIIX México',
      yearRange: '2024-presente',
      status: 'en curso',
    },
    {
      degree: 'Magíster en Alta Dirección',
      institution: 'Universidad Rey Juan Carlos, España',
      yearRange: '2017-2024',
      status: 'completado',
    },
    {
      degree: 'Especialista en Gerencia Financiera',
      institution: 'Pontificia Universidad Javeriana',
      yearRange: '2021-2022',
      status: 'completado',
    },
    {
      degree: 'Ingeniero Industrial',
      institution: 'Universidad Autónoma del Caribe',
      yearRange: '2003-2007',
      status: 'completado',
    },
  ];

  /** Certification badges data */
  readonly certifications: Certification[] = [
    { title: 'Innovación Estratégica', year: 2024 },
    { title: 'Gestión de Proyectos e Innovación Empresarial', year: 2024 },
    { title: 'Inteligencia Artificial y Marketing', year: 2024 },
    { title: 'Pensamiento Estratégico', institution: 'Javeriana', year: 2021 },
    { title: 'Mentoring Ejecutivo', institution: 'Javeriana', year: 2021 },
    { title: 'Analítica para Directivos', institution: 'Javeriana', year: 2021 },
    {
      title: 'Scrum Master Professional Certificate (SMPC)',
      institution: 'Certiprof',
      year: 2018,
    },
    { title: 'Lean Six Sigma', institution: 'Javeriana', year: 2013 },
    { title: 'Business Process Management', institution: 'Javeriana', year: 2013 },
  ];

  onVisibilityChange(visible: boolean): void {
    if (visible) {
      this.isVisible.set(true);
      this.analytics.trackSectionView('education');
    }
  }
}
