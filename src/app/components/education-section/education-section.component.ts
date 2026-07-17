import { Component, signal, inject } from '@angular/core';
import { IntersectionObserverDirective } from '../../directives/intersection-observer.directive';
import { AnalyticsService } from '../../services/analytics.service';
import { SectionBackgroundComponent } from '../section-background/section-background.component';

interface EducationItem {
  degree: string;
  institution: string;
  yearRange: string;
  status: 'en curso' | 'completado';
}

interface CertificationItem {
  title: string;
  institution?: string;
  year: number;
  category?: string;
}

@Component({
  standalone: true,
  selector: 'app-education-section',
  templateUrl: './education-section.component.html',
  styleUrls: ['./education-section.component.scss'],
  imports: [IntersectionObserverDirective, SectionBackgroundComponent],
})
export class EducationSectionComponent {
  private readonly analytics = inject(AnalyticsService);
  isVisible = signal<boolean>(false);

  readonly educationEntries: EducationItem[] = [
    {
      degree: 'Doctorado en Administración de Empresas',
      institution: 'UIIX México',
      yearRange: '2024 – presente',
      status: 'en curso',
    },
    {
      degree: 'Magíster en Alta Dirección',
      institution: 'Universidad Rey Juan Carlos, España',
      yearRange: '2017 – 2024',
      status: 'completado',
    },
    {
      degree: 'Especialista en Gerencia Financiera',
      institution: 'Pontificia Universidad Javeriana',
      yearRange: '2021 – 2022',
      status: 'completado',
    },
    {
      degree: 'Ingeniero Industrial',
      institution: 'Universidad Autónoma del Caribe',
      yearRange: '2003 – 2007',
      status: 'completado',
    },
  ];

  readonly certifications: CertificationItem[] = [
    { title: 'Innovación Estratégica', year: 2024, category: 'Estrategia' },
    { title: 'Gestión de Proyectos e Innovación Empresarial', year: 2024, category: 'Estrategia' },
    { title: 'Inteligencia Artificial y Marketing', year: 2024, category: 'Innovación e IA' },
    { title: 'Pensamiento Estratégico', institution: 'Javeriana', year: 2021, category: 'Estrategia' },
    { title: 'Mentoring Ejecutivo', institution: 'Javeriana', year: 2021, category: 'Estrategia' },
    { title: 'Analítica para Directivos', institution: 'Javeriana', year: 2021, category: 'Analítica' },
    { title: 'Scrum Master Professional (SMPC)', institution: 'CertiProf', year: 2018, category: 'Proyectos y agilidad' },
    { title: 'Lean Six Sigma', institution: 'Javeriana', year: 2013, category: 'Procesos y excelencia' },
    { title: 'Business Process Management', institution: 'Javeriana', year: 2013, category: 'Procesos y excelencia' },
  ];

  get certificationGroups(): { category: string; items: CertificationItem[] }[] {
    const groups = new Map<string, CertificationItem[]>();
    for (const cert of this.certifications) {
      const cat = cert.category || 'Otros';
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push(cert);
    }
    return Array.from(groups.entries()).map(([category, items]) => ({ category, items }));
  }

  onVisibilityChange(visible: boolean): void {
    if (visible) {
      this.isVisible.set(true);
      this.analytics.trackSectionView('education');
    }
  }
}
