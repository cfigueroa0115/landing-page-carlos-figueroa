import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntersectionObserverDirective } from '../../directives/intersection-observer.directive';
import { SkillCategory } from '../../models/skill-category.interface';
import { SkillBar } from '../../models/skill-bar.interface';

@Component({
  standalone: true,
  selector: 'app-skills-section',
  templateUrl: './skills-section.component.html',
  styleUrls: ['./skills-section.component.scss'],
  imports: [CommonModule, IntersectionObserverDirective],
})
export class SkillsSectionComponent {
  /** Controls animation trigger when section enters viewport */
  isVisible = signal<boolean>(false);

  /** Skill category groups with icons and tags */
  readonly categories: SkillCategory[] = [
    {
      title: 'Estrategia y Transformación',
      icon: 'rocket',
      tags: [
        'Transformación Digital',
        'IA Aplicada',
        'Planificación Estratégica',
        'Gobierno TI',
        'Gestión del Cambio',
        'Modelos Operativos Inteligentes',
        'SmartOps',
      ],
    },
    {
      title: 'Operaciones y Excelencia',
      icon: 'settings',
      tags: [
        'Excelencia Operativa',
        'Automatización Empresarial',
        'Mejora Continua',
        'BPM',
        'BPMN 2.0',
        'BPMS',
        'Oracle BPM/SOA Suite 12C',
        'Bizagi',
      ],
    },
    {
      title: 'Datos, IA y Tecnología',
      icon: 'cpu',
      tags: [
        'Python',
        'SQL',
        'Analítica de Datos',
        'AWS',
        'Oracle Cloud',
        'Angular',
        'Java',
        'Cobol',
      ],
    },
    {
      title: 'Producto, Proyectos y Agilidad',
      icon: 'layers',
      tags: [
        'Product Owner',
        'Scrum Master',
        'Kanban',
        'Product Discovery',
        'MVP',
        'OKRs',
        'Gestión de Portafolios',
        'Arquitectura Empresarial',
      ],
    },
  ];

  /** Key competency bars with percentage values */
  readonly skillBars: SkillBar[] = [
    { label: 'Transformación Digital', percentage: 95 },
    { label: 'Automatización de Procesos', percentage: 92 },
    { label: 'Gestión de Producto', percentage: 90 },
    { label: 'Inteligencia Artificial Aplicada', percentage: 85 },
    { label: 'Liderazgo de Equipos', percentage: 95 },
    { label: 'Arquitectura Empresarial', percentage: 88 },
  ];

  onVisibilityChange(visible: boolean): void {
    if (visible) {
      this.isVisible.set(true);
    }
  }
}
