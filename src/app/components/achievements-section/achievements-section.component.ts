import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountUpDirective } from '../../directives/count-up.directive';
import { IntersectionObserverDirective } from '../../directives/intersection-observer.directive';
import { Achievement } from '../../models/achievement.interface';

/**
 * AchievementsSectionComponent — Displays 7 glassmorphism cards with
 * animated count-up percentages in a responsive grid layout.
 *
 * Features:
 * - 7 achievement cards with glassmorphism effect
 * - Count-up animation triggered at 50% visibility (once per page load)
 * - Responsive grid: 3-col desktop, 2-col tablet, 1-col mobile
 * - Hover: translateY(-8px) + colored glow
 * - Touch: tap toggle for the hover effect
 * - Count-up completes within 2 seconds per card
 */
@Component({
  standalone: true,
  selector: 'app-achievements-section',
  imports: [CommonModule, CountUpDirective, IntersectionObserverDirective],
  templateUrl: './achievements-section.component.html',
  styleUrls: ['./achievements-section.component.scss'],
})
export class AchievementsSectionComponent {
  /** Controls animation trigger when section enters viewport */
  isVisible = signal<boolean>(false);

  /** Tracks which card is currently active on touch devices */
  activeTouchCard = signal<number | null>(null);

  /** All 7 achievement metrics data */
  readonly achievements: (Achievement & { description: string })[] = [
    {
      percentage: 95,
      title: 'Modernización gestión documental',
      description: 'IBM FileNet → AWS/Oracle/Angular/Java',
      company: 'Seguros Bolívar',
    },
    {
      percentage: 80,
      title: 'Facturación electrónica + portal autogestión',
      description: 'Reducción tiempos de procesamiento',
      company: 'Seguros Bolívar',
    },
    {
      percentage: 90,
      title: 'Modelo SmartOps automatización integral',
      description: 'Procesos core del negocio',
      company: 'Beneficiar Cooperativa',
    },
    {
      percentage: 85,
      title: 'Automatización BPM + Oracle SOA Suite 12C',
      description: 'Eficiencia operativa transversal',
      company: 'Outsourcing S.A.',
    },
    {
      percentage: 100,
      title: 'Portafolio estratégico tecnología',
      description: 'Gestión y cierre de proyectos',
      company: 'Outsourcing S.A.',
    },
    {
      percentage: 98,
      title: 'Soluciones fintech y productos digitales',
      description: 'PSE, crédito web, pagarés',
      company: 'Indra Tecnocom',
    },
    {
      percentage: 40,
      title: 'Consultoría digital sector público',
      description: 'Defensoría del Pueblo',
      company: 'Management & Quality',
    },
  ];

  onVisibilityChange(visible: boolean): void {
    if (visible) {
      this.isVisible.set(true);
    }
  }

  /**
   * Handles touch tap toggle for mobile devices.
   * Tapping a card activates it; tapping again or tapping another card deactivates it.
   */
  onCardTap(index: number): void {
    if (this.activeTouchCard() === index) {
      this.activeTouchCard.set(null);
    } else {
      this.activeTouchCard.set(index);
    }
  }

  /**
   * Checks if a card is currently active via touch.
   */
  isCardActive(index: number): boolean {
    return this.activeTouchCard() === index;
  }
}
