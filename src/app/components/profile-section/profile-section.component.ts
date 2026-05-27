import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntersectionObserverDirective } from '../../directives/intersection-observer.directive';

@Component({
  standalone: true,
  selector: 'app-profile-section',
  templateUrl: './profile-section.component.html',
  styleUrls: ['./profile-section.component.scss'],
  imports: [CommonModule, IntersectionObserverDirective],
})
export class ProfileSectionComponent {
  /** Controls animation trigger when section enters viewport */
  isVisible = signal<boolean>(false);

  /** Professional keyword tags for orbital display */
  readonly keywordTags: string[] = [
    'Transformación Digital',
    'IA Aplicada',
    'BPM',
    'BPMS',
    'Oracle SOA',
    'AWS',
    'Python',
    'SQL',
    'Scrum',
    'Kanban',
    'Product Owner',
    'Lean Six Sigma',
    'Angular',
    'Java',
    'Agilidad',
    'SmartOps',
  ];

  /** Professional summary text */
  readonly summary =
    'Ejecutivo en transformación digital, excelencia operativa e inteligencia artificial aplicada al negocio, con más de 18 años de trayectoria liderando modernización tecnológica, automatización de procesos, gestión de producto, mejora continua y evolución de modelos operativos inteligentes en sectores asegurador, cooperativo, financiero, servicios, tecnología, sector público y educación superior.';

  onVisibilityChange(visible: boolean): void {
    if (visible) {
      this.isVisible.set(true);
    }
  }
}
