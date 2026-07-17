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

  readonly categoryIcons: Record<string, string> = {
    'Estrategia': 'M12 12 m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0|M16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76',
    'Innovación e IA': 'M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5a2.5 2.5 0 0 0 2.32.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0 1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5',
    'Analítica': 'M3 3v18h18|M18 17V9|M13 17V5|M8 17v-3',
    'Proyectos y agilidad': 'M8 6h10|M6 12h9|M11 18h7|M3 6h.01|M3 12h.01|M3 18h.01',
    'Procesos y excelencia': 'M3 3h6l6 18h6|M14 3h7',
  };

  get certificationGroups(): { category: string; items: CertificationItem[]; iconPaths: string }[] {
    const groups = new Map<string, CertificationItem[]>();
    for (const cert of this.certifications) {
      const cat = cert.category || 'Otros';
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push(cert);
    }
    return Array.from(groups.entries()).map(([category, items]) => ({
      category,
      items,
      iconPaths: this.categoryIcons[category] || '',
    }));
  }

  getIconPaths(pathString: string): string[] {
    return pathString.split('|');
  }

  onVisibilityChange(visible: boolean): void {
    if (visible) {
      this.isVisible.set(true);
      this.analytics.trackSectionView('education');
    }
  }
}
